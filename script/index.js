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
            if (response.status === 401) {
                errorMessage.style.display = 'block'; // Показываем сообщение об ошибке
                throw new Error('Неверный логин или пароль');
            }
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.text(); // Возвращаем текст ответа от сервера
        })
        .then(data => {
            console.log(data); // Выводим ответ от сервера в консоль
            alert('Успешная аутентификация');
            overlay.style.display = 'none';
            // Убираем размытие фона и закрываем модальное окно после успешного входа
            closeModal();
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

    openModal();
});
