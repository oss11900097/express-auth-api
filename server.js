//import configured app and start the engine.
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Enterprise Express API running on http://localhost:${PORT}`);
});