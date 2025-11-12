class BotDashboard {
    constructor() {
        // URL бэкенда на Railway (замените на ваш после деплоя)
        this.BACKEND_URL = 'https://your-app-name.railway.app';
        
        this.init();
    }

    init() {
        this.checkConnection();
        this.loadCurrentSettings();
        this.setupEventListeners();
    }

    async checkConnection() {
        const statusElement = document.getElementById('connectionStatus');
        
        try {
            const response = await fetch(`${this.BACKEND_URL}/api/health`);
            if (response.ok) {
                statusElement.className = 'status online';
                statusElement.innerHTML = '<span class="status-dot"></span> Подключено к серверу';
            } else {
                throw new Error('Сервер не отвечает');
            }
        } catch (error) {
            statusElement.className = 'status offline';
            statusElement.innerHTML = '<span class="status-dot"></span> Нет подключения к серверу';
            console.error('Ошибка подключения:', error);
        }
    }

    async loadCurrentSettings() {
        try {
            const response = await fetch(`${this.BACKEND_URL}/api/settings`);
            const data = await response.json();
            
            if (data.success) {
                // Заполняем форму
                document.getElementById('prefix').value = data.settings.prefix || '!';
                document.getElementById('status').value = data.settings.status || 'online';
                document.getElementById('activity').value = data.settings.activity || '';
                
                // Показываем текущие настройки
                document.getElementById('currentSettings').textContent = 
                    JSON.stringify(data.settings, null, 2);
            }
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
            this.showMessage('Ошибка загрузки текущих настроек', 'error');
        }
    }

    setupEventListeners() {
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    async saveSettings() {
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.textContent;
        
        try {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Сохранение...';
            
            const formData = {
                prefix: document.getElementById('prefix').value,
                status: document.getElementById('status').value,
                activity: document.getElementById('activity').value
            };

            const response = await fetch(`${this.BACKEND_URL}/api/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showMessage('✅ Настройки успешно сохранены!', 'success');
                document.getElementById('currentSettings').textContent = 
                    JSON.stringify(result.settings, null, 2);
            } else {
                throw new Error(result.error || 'Ошибка сохранения');
            }

        } catch (error) {
            console.error('Ошибка сохранения:', error);
            this.showMessage(`❌ Ошибка: ${error.message}`, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = originalText;
        }
    }

    showMessage(text, type) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BotDashboard();
});
