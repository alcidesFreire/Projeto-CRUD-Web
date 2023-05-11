const pool = require('./db')
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
// const userController = require('./controller/userController');
// const addUsuario = require('./controller/userController');


const app = express();

// Configura o middleware body-parser para ler os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Define uma rota para o formulário
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/index', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario ORDER BY COD_USUARIO');
    res.render('index', { data: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Erro ao buscar dados');
  }
});

app.get('/dados', (req, res) => {
  pool.query('SELECT * FROM usuario', (err, result) => {
    if (err) {
      console.error('Erro ao carregar dados do banco de dados', err);
      res.status(500).send('Erro ao carregar dados do banco de dados');
    } else {
      console.log('Dados do banco de dados carregados com sucesso');
      res.redirect(`/`);
    }
  });
});

app.get('/edit/:cod_usuario', async (req, res) => {
 
  const { cod_usuario} = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE cod_usuario = $1', [cod_usuario]);
    res.render('edit', { data: result.rows[0] } );
  } catch (err) {
    console.error(err);
    res.send('Erro ao buscar dados');
  }
});

app.post('/edit/:cod_usuario', async (req, res) => {
  const { cod_usuario } = req.params;
  const { nome, email, telefone, senha, cpf } = req.body;
  try {
    await pool.query('UPDATE usuario SET nome = $1, email = $2, telefone = $3, senha = $4, cpf = $5 WHERE cod_usuario = $6', [nome, email, telefone, senha, cpf, cod_usuario]);
    res.redirect(`/index`);
  } catch (err) {
    console.error(err);
    res.redirect(`/edit/${cod_usuario}?msg=Erro ao atualizar dados`);
  }
});

app.get('/delete/:cod_usuario', async (req, res) => {
  const { cod_usuario } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE cod_usuario = $1', [cod_usuario]);
    if (result.rowCount === 0) {
      return res.send('Item não encontrado');
    }
    res.render('delete', { data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.send('Erro ao buscar dados');
  }
});

app.post('/delete/:cod_usuario', async (req, res) => {
  const { cod_usuario } = req.params;
  try {
    await pool.query('DELETE FROM usuario WHERE cod_usuario = $1', [cod_usuario]);
    res.redirect('/index');
  } catch (err) {
    console.error(err);
    res.send('Erro ao deletar usuário');
  }
});





// Define uma rota para consultar os dados do formulário no banco de dados
app.post('/consulta', (req, res) => {
    const { email, senha} = req.body;

    // Consulta os dados do formulário no banco de dados
    pool.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2', [email, senha], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Erro ao executar consulta no banco de dados');
        } else if (results.rows.length > 0) {
          // O login e a senha existem no banco de dados
          res.redirect('/index');
        } else {
          // O login e/ou a senha estão incorretos
          res.status(401).send('Login e/ou senha incorretos');
        }
      });
    });

    app.post('/add', async (req, res) => {
      try {
          const {nome,telefone,cpf,senha,email} = req.body;
    
        const result = await pool.query(
          'INSERT INTO usuario (nome, telefone, cpf, senha, email) VALUES ($1, $2, $3, $4, $5)',
          [nome, telefone, cpf, senha, email]
        );
        res.redirect('/index');
      } catch (err) {
        console.error(err);
        res.send('Erro ao adicionar dados');
      }
    });

    app.set('view engine', 'ejs');
// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}.`);
});
module.exports = app;
