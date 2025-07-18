document.addEventListener('DOMContentLoaded', function() {
    const guestList = document.getElementById('guest-list');
    const refreshBtn = document.getElementById('refresh-btn');
    
    // Загружаем гостей при загрузке страницы
    loadGuests();
    
    // Кнопка обновления
    refreshBtn.addEventListener('click', loadGuests);
    
    async function loadGuests() {
        try {
            guestList.innerHTML = '<div class="loading-spinner">Загрузка списка гостей...</div>';
            
            const guests = await fetchGuests();
            
            if (guests.length === 0) {
                guestList.innerHTML = '<p class="typewriter">$ Пока никто не подтвердил участие.</p>';
                return;
            }
            
            guestList.innerHTML = '';
            guests.forEach(guest => {
                const guestItem = document.createElement('div');
                guestItem.className = 'guest-item';
                
                const title = guest.title.replace('Гость: ', '');
                const date = new Date(guest.created_at).toLocaleString('ru-RU');
                
                guestItem.innerHTML = `
                    <span class="guest-name">${title}</span>
                    <span class="timestamp">${date}</span>
                `;
                
                guestList.appendChild(guestItem);
            });
        } catch (error) {
            console.error('Ошибка загрузки гостей:', error);
            guestList.innerHTML = '<p class="typewriter error">$ Ошибка загрузки списка. Попробуйте позже.</p>';
        }
    }
    
    async function fetchGuests() {
        const REPO_OWNER = 'YOUR_GITHUB_USERNAME';
        const REPO_NAME = 'YOUR_REPO_NAME';
        
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?labels=guest`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        
        return response.json();
    }
});
