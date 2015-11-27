var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validator = require('validator'); //medida de segurança
var db_string = 'mongodb://127.0.0.1/mymongodb';
var mongoose = require('mongoose').connect(db_string);
var db = mongoose.connection;
var User;

 db.on('error', console.error.bind(console, 'Erro ao conectar'));
 db.once('open', function(){
  	var userSchema = mongoose.Schema({
 // 		//colunas do banco de dados
	 	fullname: String,
	 	email: String,
	 	password: String,
	 	created_at: Date
	 });

	// //podemos usar os metodos do model do mongoose
	 User = mongoose.model('User', userSchema);
 });

 app.listen(5000);
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded ({
 	extended: true
}));

app.get('/', function(req, res){
	res.end("Você está conecatado.");

	console.log("Servidor ligado, console");
});

app.get('/teste', function(req, res){
	res.end("Estamos em teste");

	console.log("Estamos em teste, console");
});

/*******  Operacoes em usuarios  ********/
app.get('/users', function(req, res){
	//res.end("Pegando lista de usuarios");

	User.find({}, function(error, users){
		if(error){
			res.json({error: 'Nao foi possível retornar os usuários'});
		}else {
			res.json(users);
		}
	});//.limit(2).skip(2) - limita a dois resultados e pula dois resultados

	console.log("Pegando lista de usuarios, console");
});
app.get('/users/:id', function(req, res){
	//res.end("Pegando usuario com esse ID");
	var id = validator.trim(validator.escape(req.param('id')));
	User.findById(id, function(error, user){
		if(error){
			res.json({error: 'Nao foi possível retornar o usuário de id='+ id});
		}else {
			res.json(user);
		}
	});
	console.log("Pegando usuario com esse ID, console");
});
app.post('/users', function(req, res){
	//res.json(req.body);
	//res.end("Gravando usuario");
	//precisa chamar save() para salvar no banco de dados
	var fullname = validator.trim(validator.escape(req.param('fullname')));
	var email = validator.trim(validator.escape(req.param('email')));
	var password = validator.trim(validator.escape(req.param('password')));
	new User({
		'fullname': fullname,
		'email': email,
		'password': password,
		'created_at': new Date()
	}).save(function(error, user){
		if(error){
			res.json({error: 'Nao foi possivel salvar o usuario'});
		}else {
			res.json(user);
		}
	});

	console.log("Gravando usuario, console");
});
app.put('/users', function(req, res){
	//res.end("Atualiza usuario com esse ID");

	var id = validator.trim(validator.escape(req.param('id')));
	var fullname = validator.trim(validator.escape(req.param('fullname')));
	var email = validator.trim(validator.escape(req.param('email')));
	var password = validator.trim(validator.escape(req.param('password')));
	User.findById(id, function(error, user){
		if(fullname) user.fullname = fullname;
		if(email) user.email = email;
		if(password) user.password = password;

		user.save(function(error, user){
			if(error){
				res.json({error: 'Nao foi possível atualizar o usuário de id='+ id});
			}else {
				res.json(user);
			}	
		})
		
	});
	console.log("Atualiza usuario com esse ID, console");
})
app.post('/users', function(req, res){
	res.end("Gravando usuario");

	console.log("Gravando usuario, console");
})