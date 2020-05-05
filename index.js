require('dotenv').config();
const application = require('./dist/bot');
const bot = new application.Bot();
bot.catch(err => {
    console.error('Error starting bot.');
    process.exit(1);
});
