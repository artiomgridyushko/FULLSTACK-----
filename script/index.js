document.addEventListener('DOMContentLoaded', function() {
    const modal = document.createElement('div');
    modal.id = 'loginModal';
    modal.classList.add('modal');
    modal.innerHTML = `
        <h2>Вход</h2>
        <form id="loginForm">
            <input type="text" id="username" placeholder="Логин" required>
            <input type="password" id="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
        </form>
        <p id="error-message" class="error-message" style="display: none;">Неверный логин или пароль</p>
    `;
    document.body.appendChild(modal);

    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем отправку формы по умолчанию

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Создаем объект с данными для отправки на сервер
        const userData = {
            username: username,
            password: password
        };

        // Отправляем данные на сервер для аутентификации
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // Преобразуем объект в JSON перед отправкой
            
        })
        .then(response => {
            if (response.status === 200) {
                // Извлекаем данные пользователя из ответа сервера
                response.json().then(userData => {
                    // Получаем id пользователя из данных
                    const userId = userData.id;
            
                    // Сохраняем данные пользователя в localStorage
                    localStorage.setItem('user', JSON.stringify({ id: userId, username: username, password: password }));
            
                    alert('Успешная аутентификация');
                    // Закрываем модальное окно после успешного входа
                    closeModal();
                    // Открываем новую форму со словом "hello" и информацией о клиентах
                    openHelloForm();
                });
            } else {
                // Показываем сообщение об ошибке
                errorMessage.style.display = 'block';
                throw new Error('Неверный логин или пароль');
            }
        })
        
        
    
        .then(data => {
            console.log(data); // Выводим ответ от сервера в консоль
        
            // Получаем имя пользователя и пароль из ответа сервера
            // const { username, password } = data;
        
            // Сохраняем данные пользователя в localStorage
            // localStorage.setItem('user', JSON.stringify({ username, password }));
        
            // alert('Успешная аутентификация');
            // Закрываем модальное окно после успешного входа
            // closeModal();
            // // Открываем новую форму со словом "hello" и информацией о клиентах
            // openHelloForm();
        })
        
        .catch(error => {
            console.error('Произошла ошибка:', error.message);
        });
    });

    function openModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function openHelloForm() {
        const userData = localStorage.getItem('user');
        
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const userId = parsedUserData.id; // Получаем только ID пользователя
            
            fetch(`http://localhost:3000/user/${userId}/user_clients`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка получения данных о клиентах');
                    }
                    return response.json();
                })
                .then(clientData => {
                    const helloForm = document.createElement('div');
                    helloForm.innerHTML = `
                        <form>
                            <p>hello</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Номер счета</th>
                                        <th>Фамилия</th>
                                        <th>Имя</th>
                                        <th>Отчество</th>
                                        <th>Дата рождения</th>
                                        <th>ИНН</th>
                                        <th>Статус</th>
                                    </tr>
                                </thead>
                                <tbody id="clientListBody"></tbody>
                            </table>
                        </form>
                    `;
    
                    const clientListBody = helloForm.querySelector('#clientListBody');
    
                    clientData.forEach(client => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${client.account_number}</td>
                            <td>${client.last_name}</td>
                            <td>${client.first_name}</td>
                            <td>${client.middle_name || ''}</td>
                            <td>${client.birth_date || ''}</td>
                            <td>${client.INN || ''}</td>
                            <td>${client.status || ''}</td>
                        `;
                        clientListBody.appendChild(row);
                    });
    
                    document.body.appendChild(helloForm);
                })
                .catch(error => {
                    console.error('Произошла ошибка при получении данных о клиентах:', error.message);
                });
        } else {
            console.log('Пользователь не найден в localStorage');
        }
    }
    
    
    
    
    

    openModal();
});
