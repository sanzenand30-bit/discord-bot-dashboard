require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://ваш-username.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500' // для локального тестирования
  ],
  credentials: true
}));
app.use(express.json());

// Временное хранилище настроек (замените на базу данных)
let botSettings = {
  prefix: '!',
  status: 'online',
  activity: 'Настройте меня!'
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Discord Bot Dashboard API работает!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    settings: botSettings
  });
});

app.post('/api/settings', (req, res) => {
  try {
    const { prefix, status, activity } = req.body;
    
    // Валидация данных
    if (prefix && prefix.length > 5) {
      return res.status(400).json({
        success: false,
        error: 'Префикс слишком длинный'
      });
    }

    // Обновляем настройки
    botSettings = {
      ...botSettings,
      ...req.body,
      lastUpdated: new Date().toISOString()
    };

    console.log('🔧 Настройки обновлены:', botSettings);

    // Здесь добавьте логику применения настроек к вашему боту
    // Например, через Discord API или WebSocket

    res.json({
      success: true,
      message: 'Настройки успешно сохранены!',
      settings: botSettings
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
