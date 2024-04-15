document.addEventListener('DOMContentLoaded', function() {
    const userId = JSON.parse(localStorage.getItem('user')).id;

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
                <table id="clientTable">
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
                <button id="change">Изменить</button>
            </form>`;

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
                    <td contenteditable="true">${client.status || ''}</td>
                `;
                clientListBody.appendChild(row);
            });

            document.body.appendChild(helloForm);

            const changeButton = helloForm.querySelector('#change');
            changeButton.addEventListener('click', function(event) {
                event.preventDefault();

                const tableRows = document.querySelectorAll('#clientTable tbody tr');
                const statusChanges = [];

                tableRows.forEach(row => {
                    const accountNumber = row.cells[0].innerText;
                    const newStatus = row.cells[6].innerText;

                    statusChanges.push({ accountNumber, newStatus });
                });

                fetch('http://localhost:3000/change-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(statusChanges)
                })
                .then(response => {
                    if (response.ok) {
                        alert('Статусы успешно изменены');
                        return response.json();
                    } else {
                        // Если ответ не является JSON, возвращаем ошибку
                        return response.text().then(errorMessage => {
                            throw new Error(errorMessage);
                        });
                    }
                })
                .then(updatedClients => {
                    updateTable(updatedClients);
                })
                .catch(error => {
                    console.error('Ошибка при отправке запроса:', error);
                    // alert(error.message); // Выводим сообщение об ошибке через alert
                });
                
            });
        })
        .catch(error => {
            console.error('Произошла ошибка при получении данных о клиентах:', error.message);
        });

    function updateTable(updatedClients) {
        const clientListBody = document.getElementById('clientListBody');
        clientListBody.innerHTML = '';

        updatedClients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.account_number}</td>
                <td>${client.last_name}</td>
                <td>${client.first_name}</td>
                <td>${client.middle_name || ''}</td>
                <td>${client.birth_date || ''}</td>
                <td>${client.INN || ''}</td>
                <td contenteditable="true">${client.status || ''}</td>
            `;
            clientListBody.appendChild(row);
        });
    }
});
