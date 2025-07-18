document.addEventListener('DOMContentLoaded', function() {
    try {
        // Получаем список гостей из localStorage
        const guests = loadGuestsFromStorage();
        const guestList = document.getElementById('guest-list');
        const guestCount = document.getElementById('guest-count');
        
        // Сортируем гостей по времени регистрации (новые вверху)
        guests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Отображаем гостей
        if (guests.length === 0) {
            guestList.innerHTML = '<p class="typewriter">$ Пока никто не подтвердил участие.</p>';
        } else {
            guestList.innerHTML = '';
            guests.forEach(guest => {
                const guestItem = document.createElement('div');
                guestItem.className = 'guest-item';
                guestItem.innerHTML = `
                    <span>${guest.firstName} ${guest.lastName}</span>
                    <span class="timestamp">${formatDate(guest.timestamp)}</span>
                `;
                guestList.appendChild(guestItem);
            });
        }
        
        // Обновляем счетчик гостей
        guestCount.textContent = `$ Всего гостей: ${guests.length}`;
        
    } catch (error) {
        console.error('Ошибка загрузки гостей:', error);
        guestList.innerHTML = '<p class="typewriter error">$ Ошибка загрузки списка гостей.</p>';
    }
    
    // Анимация загрузки
    setTimeout(() => {
        document.querySelectorAll('.typewriter').forEach(el => {
            el.style.whiteSpace = 'normal';
        });
    }, 3000);
});

function loadGuestsFromStorage() {
    try {
        const guestsJSON = localStorage.getItem('birthdayGuests');
        return guestsJSON ? JSON.parse(guestsJSON) : [];
    } catch (error) {
        console.error('Ошибка загрузки гостей:', error);
        return [];
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}