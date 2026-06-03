const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`✨ Luz Secreta API running on port ${config.port}`);
});
