const express = require('express');


const app = express();

app.set('view engine', 'ejs');
app.set(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/scripts"));
app.use(express.static(__dirname + "/styles"));

app.get('/', (req, res) => {
 
   res.render('game');
});

 app.listen(3000, () => {
   console.log('Server started on port 3000');
});