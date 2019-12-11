require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const helmet = require('helmet');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection; 
db.once('open', () => {
  console.log(` 💫 Connected to MongoDB on ${db.host}: ${db.port}...`);
});
db.on('err', (err) => {
  consolelog(`🚨 Database error:\n${err}`);
});


app.use('/auth', require('./routes/auth'));
app.use('/api', expressJWT({ secret: process.env.JWT_SECRET}), require('./routes/api' ));
app.use('/locked', 
        expressJWT({ secret: process.env.JWT_SECRET }).unless({ method: 'POST' }),
        require('./routes/locked'));

//Heroku deployment
app.get('*', (req, res) =>{
  res.sendFile(__dirname + 'client/build/index.html')
})

app.listen( process.env.PORT, () => {
  console.log(` 🎧 You are listening on port ${process.env.PORT}`)
});
