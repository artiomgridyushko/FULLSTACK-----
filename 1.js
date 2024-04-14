const sqlite3 = require('sqlite3').verbose();

// Подключение к базе данных SQLite
const db = new sqlite3.Database('bd1.db');

// Создание таблицы clients
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            client_id INTEGER PRIMARY KEY,
            last_name TEXT NOT NULL,
            first_name TEXT NOT NULL,
            middle_name TEXT,
            birth_date DATE,
            INN TEXT UNIQUE,
            responsible_person_name TEXT,
            status TEXT DEFAULT 'Не в работе'
        )
    `);

    // Вставка данных в таблицу clients
    const clientsData = [
        [1, 'Иванов', 'Иван', 'Иванович', '1990-05-15', '123456789012', 'Петров Петр Петрович', 'В работе'],
        [2, 'Петров', 'Петр', 'Петрович', '1985-08-20', '234567890123', 'Сидоров Сидор Сидорович', 'В работе'],
        [3, 'Сидоров', 'Сидор', 'Сидорович', '1978-11-25', '345678901234', 'Иванов Иван Иванович', 'В работе'],
        [4, 'Кузнецов', 'Алексей', 'Дмитриевич', '1982-03-10', '456789012345', 'Алексеев Алексей Алексеевич', 'В работе'],
        [5, 'Смирнова', 'Марина', 'Александровна', '1995-09-05', '567890123456', 'Дмитриева Дмитрина Дмитриевна', 'Не в работе'],
        [6, 'Алексеев', 'Алексей', 'Алексеевич', '1980-07-12', '678901234567', 'Смирнова Смирнова Смирновна', 'Не в работе'],
        [7, 'Дмитриев', 'Дмитрий', 'Дмитриевич', '1976-04-18', '789012345678', 'Сидорова Сидора Сидоровна', 'В работе'],
        [8, 'Федорова', 'Наталья', 'Владимировна', '1993-01-30', '890123456789', 'Петрова Петра Петровна', 'В работе'],
        [9, 'Петрова', 'Петра', 'Петровна', '1987-06-22', '901234567890', 'Иванова Иванна Ивановна', 'Не в работе'],
        [10, 'Сидорова', 'Сидора', 'Сидоровна', '1989-12-08', '012345678901', 'Алексеева Александра Алексеевна', 'В работе']
    ];

    const insertClientStmt = db.prepare('INSERT INTO clients (client_id, last_name, first_name, middle_name, birth_date, INN, responsible_person_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    clientsData.forEach(client => {
        insertClientStmt.run(client, err => {
            if (err) console.error('Ошибка вставки данных в таблицу clients:', err);
        });
    });
    insertClientStmt.finalize();

    console.log('Таблица clients создана и заполнена данными');

    // Создание таблицы users
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            full_name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);

    // Вставка данных в таблицу users
    const usersData = [
        ['Иванов Иван Иванович', '2', '2'],
        ['Петров Петр Петрович', 'petr', 'password2'],
        ['Артём', '1', '1']
    ];

    const insertUserStmt = db.prepare('INSERT INTO users (full_name, username, password) VALUES (?, ?, ?)');
    usersData.forEach(user => {
        insertUserStmt.run(user, err => {
            if (err) console.error('Ошибка вставки данных в таблицу users:', err);
        });
    });
    insertUserStmt.finalize();

    console.log('Таблица users создана и заполнена данными');

    // Создание таблицы user_clients
    db.run(`
        CREATE TABLE IF NOT EXISTS user_clients (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            client_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(account_number)
        )
    `);

    // Вставка данных в таблицу user_clients для пользователя с идентификатором 1 (Иванов)
    const userClientsDataIvanov = [
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5]
    ];

    const insertUserClientStmt = db.prepare('INSERT INTO user_clients (user_id, client_id) VALUES (?, ?)');
    userClientsDataIvanov.forEach(pair => {
        insertUserClientStmt.run(pair, err => {
            if (err) console.error('Ошибка вставки данных в таблицу user_clients:', err);
        });
    });

    // Вставка данных в таблицу user_clients для пользователя с идентификатором 2 (Петров)
    const userClientsDataPetrov = [
        [2, 6],
        [2, 7],
        [2, 8],
        [2, 9],
        [2, 10]
    ];

    userClientsDataPetrov.forEach(pair => {
        insertUserClientStmt.run(pair, err => {
            if (err) console.error('Ошибка вставки данных в таблицу user_clients:', err);
        });
    });

    insertUserClientStmt.finalize(); // Финализация только здесь
    console.log('Таблица user_clients создана и заполнена данными');
});

// Закрытие соединения с базой данных после выполнения запросов
db.close();
