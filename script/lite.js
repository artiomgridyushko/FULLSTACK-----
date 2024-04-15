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
    const sql = 'SELECT id, username, password FROM users WHERE username = ? AND password = ?';
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

        // Отправляем статус 200 и данные пользователя в виде JSON для успешной аутентификации
        return res.status(200).json({ id: row.id, username: row.username, password: row.password });
    });
});


// Обработчик GET-запроса для получения данных о клиентах для определенного пользователя
// app.get('/user/:userId/user_clients', (req, res) => {
//     const userId = req.params.userId;

//     // Поиск client_id, принадлежащих данному userId
//     const userClientSql = 'SELECT client_id FROM user_clients WHERE user_id = ?';
//     db.all(userClientSql, [userId], (err, userClientRows) => {
//         if (err) {
//             console.error('Ошибка при выполнении запроса:', err);
//             return res.status(500).send('Ошибка сервера');
//         }

//         if (!userClientRows || userClientRows.length === 0) {
//             // Если не найдены client_id для данного пользователя, возвращаем пустой результат
//             console.log('Клиенты не найдены для пользователя с ID:', userId);
//             return res.status(404).send('Клиенты не найдены');
//         }

//         // Получаем список client_id
//         const clientIds = userClientRows.map(row => row.client_id);

//         // Поиск клиентов по найденным account_number
//         const clientSql = 'SELECT * FROM clients WHERE account_number IN (?)';
//         console.log('SQL-запрос для получения клиентов по account_number:', clientIds);

//         db.all(clientSql, [clientIds], (err, clientRows) => {
//             if (err) {
//                 console.error('Ошибка при выполнении запроса:', err);
//                 return res.status(500).send('Ошибка сервера');
//             }

//             // Выводим результат запроса для отладки
//             console.log('Результат запроса:', clientRows);

//             // Отправляем данные о клиентах в виде JSON
//             return res.status(200).json(clientRows);
//         });
//     });
// });


app.get('/user/:userId/user_clients', (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT c.* 
        FROM user_clients uc
        JOIN clients c ON uc.client_id = c.account_number
        WHERE uc.user_id = ?
    `;

    db.all(sql, [userId], (err, clientRows) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка сервера');
        }

        if (!clientRows || clientRows.length === 0) {
            console.log('Клиенты не найдены для пользователя с ID:', userId);
            return res.status(404).send('Клиенты не найдены');
        }

        // Отправляем данные о клиентах в виде JSON
        return res.status(200).json(clientRows);
    });
});


app.post('/change-status', (req, res) => {
    const statusChanges = req.body;
    console.log('Полученные изменения статусов:', statusChanges);

    const allowedStatus = ["В работе", "Отказ", "Сделка закрыта"];

    // Итерация по каждому изменению статуса и выполнение соответствующего SQL-запроса для обновления данных в таблице
    statusChanges.forEach(change => {
        const { accountNumber, newStatus } = change;

         // Проверка, является ли новый статус допустимым
         if (!allowedStatus.includes(newStatus)) {
            console.error(`Недопустимый статус: ${newStatus}`);
            return res.status(400).send(`Недопустимый статус: ${newStatus}`);
        }

        const updateQuery = `UPDATE clients SET status = ? WHERE account_number = ?`;

        db.run(updateQuery, [newStatus, accountNumber], function(err) {
            if (err) {
                console.error('Ошибка при выполнении SQL-запроса:', err.message);
                res.status(500).send('Ошибка сервера');
            } 
            else {
                console.log(`Статус клиента с номером счета ${accountNumber} успешно обновлен.`);
            }
        });
    });

    res.status(200).send('Статусы клиентов успешно обновлены');
});



// Запуск сервера на порту 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
