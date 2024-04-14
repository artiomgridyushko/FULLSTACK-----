const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Параметры подключения к базе данных MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Artiom_Dom',
    password: 'Artiom62004_',
    database: 'customers'
});

// Подключение к базе данных
db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Успешное подключение к базе данных');
});

// Middleware для обработки данных из формы и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Добавленный middleware для парсинга JSON
app.use(cors()); // Используем middleware для CORS

// Обработчик POST-запроса для аутентификации пользователей
// Обработчик POST-запроса для аутентификации пользователей
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Поиск пользователя в базе данных по логину и паролю
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    console.log('SQL-запрос:', sql, 'с параметрами:', [username, password]);

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка сервера');
        }

        // Выводим результат запроса для отладки
        console.log('Результат запроса:', result);

        if (result.length === 0) {
            return res.status(401).send('Неверный логин или пароль');
        }

        const row = result[0];
        console.log('Успешная аутентификация:', row);
        res.status(200).send('Успешная аутентификация');
    });
});



// Запуск сервера на порту 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
