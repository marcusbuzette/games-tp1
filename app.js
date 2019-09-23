var express = require('express')
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http')
const app = express();


app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.engine('html', require('ejs').renderFile)

app.use(express.static(path.join(__dirname + '/src' )))


app.get('/', (req, res) => {
  res.render('index');
});

const server = http.createServer(app)


server.on('error', (err) => {
	console.log('Erro no servidor: ' + err)
})

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});