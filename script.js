document.addEventListener('DOMContentLoaded', function() {
    // Анимация загрузки
    setTimeout(() => {
        document.querySelectorAll('.typewriter').forEach(el => {
            el.style.whiteSpace = 'normal';
        });
    }, 7000);
    
    // Обработка формы
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const fullName = `${firstName} ${lastName}`.toLowerCase();
            
            // Загружаем текущий список гостей
            let guests = loadGuestsFromStorage();
                
            // Проверяем на дубликаты
            const isDuplicate = guests.some(guest => 
                `${guest.firstName} ${guest.lastName}`.toLowerCase() === fullName
            );
            
            if (isDuplicate) {
                showMessage(`$ ${firstName}, вы уже в списке гостей!`, 'error');
                return;
            }
            
            // Добавляем нового гостя
            const newGuest = {
                firstName,
                lastName,
                timestamp: new Date().toISOString()
            };
            
            guests.push(newGuest);
            saveGuestsToStorage(guests);
            downloadGuestsJSON(guests);
            
            // Показываем сообщение об успехе
            showMessage(`$ Спасибо, ${firstName}! Вы добавлены в список гостей.`, 'success');
            
            // Очищаем форму
            form.reset();
            
            // Обновляем список гостей на других вкладках
            localStorage.setItem('forceUpdate', Date.now().toString());
        });
    }
    
    // Слушаем изменения в localStorage для обновления между вкладками
    window.addEventListener('storage', function(e) {
        if (e.key === 'forceUpdate') {
            const guests = loadGuestsFromStorage();
            saveGuestsToStorage(guests); // Триггерим обновление
        }
    });
    
    // Случайные эффекты в фоне
    setInterval(() => {
        const effect = document.querySelector('.hacker-effect');
        effect.style.background = repeatingLinearGradientWithRandom();
    }, 3000);
});

// Функции для работы с гостями
function loadGuestsFromStorage() {
    try {
        const guestsJSON = localStorage.getItem('birthdayGuests');
        return guestsJSON ? JSON.parse(guestsJSON) : [];
    } catch (error) {
        console.error('Ошибка загрузки гостей:', error);
        return [];
    }
}

function saveGuestsToStorage(guests) {
    try {
        localStorage.setItem('birthdayGuests', JSON.stringify(guests));
    } catch (error) {
        console.error('Ошибка сохранения гостей:', error);
    }
}

function downloadGuestsJSON(guests) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(guests, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "guests.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function showMessage(text, type = 'success') {
    const oldMessage = document.querySelector('.form-message');
    if (oldMessage) oldMessage.remove();
    
    const message = document.createElement('p');
    message.textContent = text;
    message.className = `form-message typewriter ${type}`;
    
    const form = document.getElementById('registration-form');
    form.parentNode.insertBefore(message, form.nextSibling);
    
    setTimeout(() => {
        message.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function repeatingLinearGradientWithRandom() {
    const angle = Math.floor(Math.random() * 360);
    const opacity1 = (Math.random() * 0.2).toFixed(2);
    const opacity2 = (Math.random() * 0.2).toFixed(2);
    const color1 = `rgba(0, 255, 65, ${opacity1})`;
    const color2 = `rgba(0, 255, 65, ${opacity2})`;
    
    return `repeating-linear-gradient(
        ${angle}deg,
        ${color1},
        ${color1} ${Math.floor(Math.random() * 2) + 1}px,
        transparent ${Math.floor(Math.random() * 2) + 1}px,
        transparent ${Math.floor(Math.random() * 3) + 2}px
    )`;
}
