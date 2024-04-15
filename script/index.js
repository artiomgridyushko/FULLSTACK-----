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

        const userData = {
            username: username,
            password: password
        };

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.status === 200) {
                response.json().then(userData => {
                    const userId = userData.id;
                    localStorage.setItem('user', JSON.stringify({ id: userId, username: username, password: password }));
                    window.location.href = '/hello.html'; // Перенаправляем на страницу приветствия
                });
            } else {
                errorMessage.style.display = 'block';
                throw new Error('Неверный логин или пароль');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка:', error.message);
        });
    });

    function closeModal() {
        modal.style.display = 'none';
    }
});
