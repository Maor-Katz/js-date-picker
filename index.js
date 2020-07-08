const express = require('express');
const app = express();

const path = require('path');

// serve static assets in production
// Set static folder
app.use(express.json({extended: false}));

app.use(express.static('build'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
})


const PORT = process.env.PORT
app.listen(PORT, () => console.log('connected to server'))