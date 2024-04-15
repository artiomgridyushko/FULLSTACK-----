const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

const db = new sqlite3.Database('bd.db');

// Middleware для обработки данных из формы и JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT id, username, password, full_name FROM users WHERE username = ? AND password = ?';

    db.get(sql, [username, password], (err, row) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).send('Ошибка сервера');
        }

        console.log('Результат запроса:', row);

        if (!row) {
            return res.status(401).send('Неверный логин или пароль');
        }

        return res.status(200).json({ 
            id: row.id, 
            username: row.username, 
            password: row.password,
            full_name: row.full_name 
        });
        
    });
});

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

        return res.status(200).json(clientRows);
    });
});


app.post('/change-status', (req, res) => {
    const statusChanges = req.body;
    console.log('Полученные изменения статусов:', statusChanges);

    const allowedStatus = ["В работе", "Отказ", "Сделка закрыта"];

    const promises = statusChanges.map(change => {
        return new Promise((resolve, reject) => {
            const { accountNumber, newStatus } = change;

            if (!allowedStatus.includes(newStatus)) {
                reject(`Недопустимый статус: ${newStatus}`);
            }

            const updateQuery = `UPDATE clients SET status = ? WHERE account_number = ?`;

            db.run(updateQuery, [newStatus, accountNumber], function(err) {
                if (err) {
                    reject('Ошибка при выполнении SQL-запроса');
                } else {
                    resolve();
                }
            });
        });
    });

    Promise.all(promises)
        .then(() => {
            res.status(200).send('Статусы клиентов успешно обновлены');
        })
        .catch(error => {
            console.error('Ошибка при обновлении статусов клиентов:', error);
            res.status(500).send('Ошибка сервера');
        });
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
