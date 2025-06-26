// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// Download button functionality
document.getElementById('download-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки

    // Получаем активную версию из data-version активной вкладки
    const versionTab = document.querySelector('.version-tab.active');
    const version = versionTab ? versionTab.dataset.version : null;
    
    const downloadButton = this;
    const originalButtonHtml = downloadButton.innerHTML; // Сохраняем исходный HTML кнопки
    const statusElement = document.getElementById('download-status');

    if (!version) {
        statusElement.textContent = 'Пожалуйста, выберите версию для скачивания!';
        statusElement.style.color = '#ff6b6b'; // Красный цвет для ошибки
        return;
    }

    statusElement.textContent = `Подготовка к загрузке ${version}...`;
    statusElement.style.color = 'white';
    downloadButton.innerHTML = `<span>Подготовка...</span>`;
    downloadButton.disabled = true; // Отключаем кнопку на время загрузки
    downloadButton.style.pointerEvents = 'none'; // Отключаем клики

    setTimeout(() => {
        // Запускаем реальную загрузку файла
        // Убедитесь, что у вас есть файлы: DanerClient_v2.1.3_1.8.9.zip, DanerClient_v2.1.3_1.12.2.zip и т.д.
        window.location.href = `downloads/DanerClient_v2.1.3_${version}.zip`; 
        
        statusElement.textContent = `Скачивание ${version} началось!`;
        statusElement.style.color = '#00b894'; // Используем строковое значение цвета
        downloadButton.innerHTML = `<span>Скачивание ${version} началось!</span>`;
        // Применяем те же градиенты, что и в CSS для active кнопки
        downloadButton.style.background = 'linear-gradient(45deg, #00b894, #00e676)'; 

        // Через 3 секунды возвращаем кнопку в исходное состояние
        setTimeout(() => {
            statusElement.textContent = ''; // Очищаем статус
            downloadButton.innerHTML = originalButtonHtml; // Восстанавливаем исходный HTML
            downloadButton.style.background = ''; // Сбрасываем фон
            downloadButton.disabled = false;
            downloadButton.style.pointerEvents = 'auto'; // Включаем клики
        }, 3000);

    }, 2000); // Симулируем задержку в 2 секунды перед началом загрузки
});


// Version Tabs functionality
document.querySelectorAll('.version-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Удаляем 'active' класс со всех вкладок
        document.querySelectorAll('.version-tab').forEach(t => t.classList.remove('active'));
        // Добавляем 'active' класс к текущей вкладке
        this.classList.add('active');
        // Очищаем статус загрузки при смене вкладки
        document.getElementById('download-status').textContent = '';
    });
});

// Animate stats counters
function animateCounters() {
    const counters = [
        { element: document.getElementById('user-count'), target: 12500, suffix: '+' },
        { element: document.getElementById('update-count'), target: 75, suffix: '+' },
        { element: document.getElementById('version-count'), target: 18, suffix: '+' }
    ];
    
    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();
    
    function updateCounters(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        counters.forEach(counter => {
            if (counter.element) { // Добавляем проверку на существование элемента
                const value = Math.floor(progress * counter.target);
                counter.element.textContent = value + counter.suffix;
            }
        });
        
        if (progress < 1) {
            requestAnimationFrame(updateCounters);
        }
    }
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) { // Проверяем, существует ли секция stats
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                requestAnimationFrame(updateCounters);
                observer.disconnect();
            }
        }, { threshold: 0.5 }); // Начинаем анимацию, когда 50% секции видно
        
        observer.observe(statsSection);
    }
}

// FAQ Section functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const answer = this.nextElementSibling;
        const toggleIcon = this.querySelector('.faq-toggle');

        // Закрываем все остальные открытые ответы
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== this.closest('.faq-item')) { // Проверяем, что это не текущий FAQ-элемент
                const otherAnswer = item.querySelector('.faq-answer');
                const otherToggleIcon = item.querySelector('.faq-toggle');
                item.querySelector('.faq-question').classList.remove('active'); // Убираем active класс с вопроса
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.style.paddingBottom = '0';
                }
                if (otherToggleIcon) {
                    otherToggleIcon.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Открываем/закрываем текущий ответ
        this.classList.toggle('active'); // Добавляем/удаляем класс active для вопроса

        if (answer.style.maxHeight && answer.style.maxHeight !== '0px') {
            answer.style.maxHeight = null; // Закрываем
            answer.style.paddingBottom = '0'; // Убираем padding
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px'; // Открываем
            answer.style.paddingBottom = '20px'; // Добавляем padding снизу
        }
    });
});

// Initialize the counter animation when page loads
window.addEventListener('load', animateCounters);