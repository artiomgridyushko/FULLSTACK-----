const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Подключение к базе данных SQLite
const db = new sqlite3.Database('bd.db');

// Middleware для обработки данных из формы и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Обработчик POST-запроса для аутентификации пользователей
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Поиск пользователя в базе данных по логину и паролю
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    console.log('SQL-запрос:', sql, 'с параметрами:', [username, password]);

    db.get(sql, [username, password], (err, row) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка сервера');
        }

        // Выводим результат запроса для отладки
        console.log('Результат запроса:', row);

        if (!row) {
            return res.status(401).send('Неверный логин или пароль');
        }

        console.log('Успешная аутентификация:', row);
        res.status(200).send('Успешная аутентификация');
    });
});

// Запуск сервера на порту 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
