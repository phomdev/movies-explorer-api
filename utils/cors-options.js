// Настройки для CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://api.phomdev-diploma.nomoredomains.monster', 'https://phomdev-diploma.nomoredomains.monster'],
  credentials: true,
};

module.exports = corsOptions;
