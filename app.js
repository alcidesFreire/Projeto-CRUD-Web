const pool = require('./db')
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const UserController = require('./controller/usuario/userController');
const donoController = require('./controller/dono_veiculo/donoController');
const veiculoController = require('./controller/veiculo/veiculoController');
const session = require('express-session');
const protecao = require('./autenticacao');

// Configura o middleware body-parser para ler os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
  secret: 'PassWordKey15',
  resave: false,
  saveUninitialized: true
}));
app.get('/obterModelos', protecao, veiculoController.obterModelos);

app.post('/add/veiculo', protecao, veiculoController.adicionaVeiculo);
app.get('/edit/veiculo/:cod_veiculo', protecao, veiculoController.paginaVeiculoEdit);
app.post('/edit/veiculo/:cod_veiculo', protecao, veiculoController.adicionaVeiculo);
app.get('/delete/veiculo/:cod_veiculo', protecao, veiculoController.paginaVeiculoDelete);
app.post('/delete/veiculo/:cod_veiculo', protecao, veiculoController.deletaVeiculo);

//pagina inicial para efetuar o login
app.get('/',  UserController.paginaLogin);

app.post('/logout', protecao, UserController.logOut);
//metodo que verifica se o login e senha existem no banco de dados
app.post('/consulta', UserController.consultaUsuario);

//página inicial que contem o direcionamento pra qual parte ir
app.get('/index', protecao, UserController.paginaIndex);

//página que mostra a lista de donos
app.get('/index/dono', protecao, donoController.donoIndex);

//pagina que efetua a adição de um novo dono
app.get('/add/dono', protecao, donoController.paginadonoAdd);

//pagina que efetua a adição de dono de veiculo
app.get('/edit/dono/:cod_dono_veiculo', protecao, donoController.paginadonoEdit);

//metodo para adicionar um dono
app.post('/add/dono', protecao, donoController.adicionaDono);

//metodo que edita um dono específico
app.post('/edit/dono/:cod_dono_veiculo', protecao, donoController.atualizaDono);
app.get('/delete/dono/:cod_dono_veiculo', protecao, donoController.paginaDonoDelete);
app.post('/delete/dono/:cod_dono_veiculo', protecao, donoController.deletaDono);

//pagina que mostra a lista de usuarios
app.get('/index/usuario', protecao, UserController.indexUsuario);

//pagina que mostra a lista de veículos
app.get('/index/veiculo', protecao, veiculoController.veiculoIndex);
app.get('/add/veiculo', protecao, veiculoController.paginaVeiculoAdd);

//pagina que efetua a adição de um novo usuario
app.get('/add/usuario', protecao, UserController.paginaUsuarioAdd);

//pagina que efetua a edição de um usuário específico
app.get('/edit/usuario/:cod_usuario', protecao, UserController.paginaUsuarioEdit);



//pagina que efetua a exclusão de um usuário específico
app.get('/delete/usuario/:cod_usuario', protecao, UserController.paginaUsuarioDelete);

//metodo para deletar um usuario
app.post('/delete/usuario/:cod_usuario', protecao, UserController.deletaUsuario);

//metodo para editar um usuario
app.post('/edit/usuario/:cod_usuario', protecao, UserController.atualizaUsuario);

//metodo para adicionar um usuario
app.post('/add/usuario', protecao, UserController.adicionaUsuario);

app.set('view engine', 'ejs');
// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}.`);
});
module.exports = app;
