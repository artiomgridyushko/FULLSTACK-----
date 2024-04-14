const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Подключение к базе данных SQLite
const db = new sqlite3.Database('bd.db');

// Middleware для обработки данных из формы и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Обработчик GET-запроса для получения данных о клиентах для определенного пользователя
app.get('/user/:userId/user_clients', (req, res) => {
    const userId = req.params.userId;

    // Поиск client_id, принадлежащих данному userId
    const userClientSql = 'SELECT client_id FROM user_clients WHERE user_id = ?';
    db.all(userClientSql, [userId], (err, userClientRows) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка сервера');
        }

        if (!userClientRows || userClientRows.length === 0) {
            // Если не найдены client_id для данного пользователя, возвращаем пустой результат
            console.log('Клиенты не найдены для пользователя с ID:', userId);
            return res.status(404).send('Клиенты не найдены');
        }

        // Получаем список client_id
        const clientIds = userClientRows.map(row => row.client_id);

        // Поиск клиентов по найденным client_id
        const clientSql = 'SELECT * FROM clients WHERE account_number IN (?)';
        console.log('SQL-запрос для получения клиентов по client_id:', clientIds);

        db.all(clientSql, [clientIds], (err, clientRows) => {
            if (err) {
                console.error('Ошибка при выполнении запроса:', err);
                return res.status(500).send('Ошибка сервера');
            }

            // Выводим результат запроса для отладки
            console.log('Результат запроса:', clientRows);

            // Отправляем данные о клиентах в виде JSON
            return res.status(200).json(clientRows);
        });
    });
});







// Запуск сервера на порту 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
