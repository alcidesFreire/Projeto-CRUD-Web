const pool = require('./db')
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const UserController = require('./controller/userController');


// Configura o middleware body-parser para ler os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

//pagina inicial para efetuar o login
app.get('/', UserController.loginPagina);

//pagina que mostra a lista de usuarios
app.get('/index/usuario', UserController.indexUsuario);

//pagina que efetua a adição de um novo usuario
app.get('/add/usuario', UserController.paginaUsuarioAdd);

//pagina que efetua a edição de um usuário específico
app.get('/edit/usuario/:cod_usuario', UserController.paginaUsuarioEdit);

//pagina que efetua a exclusão de um usuário específico
app.get('/delete/usuario/:cod_usuario', UserController.paginaUsuarioDelete);

//metodo para deletar um usuario
app.post('/delete/:cod_usuario', UserController.deletaUsuario);

//metodo para editar um usuario
app.post('/edit/:cod_usuario', UserController.atualizaUsuario);

//metodo para adicionar um usuario
app.post('/add', UserController.adicionaUsuario);

//metodo que verifica se o login e senha existem no banco de dados
app.post('/consulta', UserController.consultaUsuario);


app.set('view engine', 'ejs');
// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});
module.exports = app;
