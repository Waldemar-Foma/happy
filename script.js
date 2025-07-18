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
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            
            if (!firstName || !lastName) {
                showMessage('$ Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            try {
                // Показываем загрузку
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner">⌛</span> Отправка...';
                
                // Отправляем данные
                await registerGuest(firstName, lastName);
                
                showMessage(`$ Спасибо, ${firstName}! Вы добавлены в список.`, 'success');
                form.reset();
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                showMessage(`$ Ошибка: ${error.message}`, 'error');
            } finally {
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Отправить →';
            }
        });
    }
    
    // Случайные эффекты в фоне
    setInterval(() => {
        const effect = document.querySelector('.hacker-effect');
        effect.style.background = repeatingLinearGradientWithRandom();
    }, 3000);
});

async function registerGuest(firstName, lastName) {
    const REPO_OWNER = 'Waldemar-Foma';
    const REPO_NAME = 'happy';
    
    try {
        const response = await fetch(`/.netlify/functions/register-guest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName
            })
        });
        
        if (!response.ok) throw new Error('Ошибка сервера');
        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
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
