const pool = require('./db')
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const UserController = require('./controller/usuario/userController');
const donoController = require('./controller/dono_veiculo/donoController');


// Configura o middleware body-parser para ler os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

//pagina inicial para efetuar o login
app.get('/', UserController.paginaLogin);

//metodo que verifica se o login e senha existem no banco de dados
app.post('/consulta', UserController.consultaUsuario);

//página inicial que contem o direcionamento pra qual parte ir
app.get('/index', UserController.paginaIndex);

//página que mostra a lista de donos
app.get('/index/dono', donoController.donoIndex);
//pagina que efetua a adição de um novo dono
app.get('/add/dono', donoController.paginadonoAdd);

//pagina que efetua a adição de dono de veiculo
app.get('/edit/dono/:cod_dono_veiculo', donoController.paginadonoEdit);

//metodo para adicionar um dono
app.post('/add/dono', donoController.adicionaDono);

//metodo que edita um dono específico
app.post('/edit/dono/:cod_dono_veiculo', donoController.atualizaDono);
app.get('/delete/dono/:cod_dono_veiculo', donoController.paginaDonoDelete);
app.post('/delete/dono/:cod_dono_veiculo', donoController.deletaDono);

//pagina que mostra a lista de usuarios
app.get('/index/usuario', UserController.indexUsuario);

//pagina que efetua a adição de um novo usuario
app.get('/add/usuario', UserController.paginaUsuarioAdd);

//pagina que efetua a edição de um usuário específico
app.get('/edit/usuario/:cod_usuario', UserController.paginaUsuarioEdit);



//pagina que efetua a exclusão de um usuário específico
app.get('/delete/usuario/:cod_usuario', UserController.paginaUsuarioDelete);

//metodo para deletar um usuario
app.post('/delete/usuario/:cod_usuario', UserController.deletaUsuario);

//metodo para editar um usuario
app.post('/edit/usuario/:cod_usuario', UserController.atualizaUsuario);

//metodo para adicionar um usuario
app.post('/add/usuario', UserController.adicionaUsuario);

app.set('view engine', 'ejs');
// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});
module.exports = app;
