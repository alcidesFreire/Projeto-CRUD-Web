const pool = require('../../db');




const UserController = {

  async consultaUsuario(req,res){
    const { email, senha } = req.body;

    // Consulta os dados do formulário no banco de dados
    pool.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2', [email, senha], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erro ao executar consulta no banco de dados');
      } else if (results.rows.length > 0) {

         // Armazena o ID do usuário na sessão
         req.session.userID = results.rows[0].cod_usuario;

         //Armazena o Nome do usuario na sessão
         req.session.username = results.rows[0].nome;

        // O login e a senha existem no banco de dados
        res.redirect('/index');
      } else {
        // O login e/ou a senha estão incorretos
        res.status(401).send('Login e/ou senha incorretos');
      }
    });
  },

  async logout(req,res){
req.session.destroy((error)=>{
  if(error){
    console.error(error);
    res.status(500).send('Erro ao fazer logout');
  }else{
    
    res.redirect('/');
  }
});

    
  },

async paginaUsuarioDelete(req,res){
  const { cod_usuario } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE cod_usuario = $1', [cod_usuario]);
    if (result.rowCount === 0) {
      return res.send('Item não encontrado');
    }
    res.render('usuarioDelete', { data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.send('Erro ao buscar dados');
  }
},

  async adicionaUsuario(req,res){
    try {
      const {nome,telefone,cpf,senha,email} = req.body;
      const cpfSemCaracteresEspeciais = req.body.cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

      const emailExists = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
      if (emailExists.rowCount > 0) {
        // Já existe um usuário com o mesmo email, retorne uma mensagem de erro ou redirecione para uma página de erro
        return res.send('Já existe um usuário com esse email');
      }
      const cpfExists = await pool.query('SELECT * FROM usuario where cpf = $1', [cpf]);
      if(cpfExists.rowCount>0){
        return res.send('já existe um usuário com esse CPF');
      }
    const result = await pool.query(
      'INSERT INTO usuario (nome, telefone, cpf, senha, email) VALUES ($1, $2, $3, $4, $5)',
      [nome, telefone, cpfSemCaracteresEspeciais, senha, email]
    );
    res.redirect('/index/usuario');
  } catch (err) {
    console.error(err);
    res.send('Erro ao adicionar dados');
  }
  },
  async paginaIndex(req,res){
    const username = req.session.username;

    res.render('index', { username })
  },

  async paginaLogin(req, res) {
   const message = req.session.message;
   req.session.message = null;
    res.render('login', {message});
  },
  async paginaUsuarioAdd(req, res) {
    res.render('usuarioAdd')
  },

  async indexUsuario(req, res) {
    try {
      const result = await pool.query('SELECT * FROM usuario ORDER BY nome');
      res.render('usuarioIndex', { data: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Erro ao buscar dados');
    }
  },

  async paginaUsuarioEdit(req, res) {
    const { cod_usuario } = req.params;
    try {
      const result = await pool.query('SELECT * FROM usuario WHERE cod_usuario = $1', [cod_usuario]);
      res.render('usuarioEdit', { data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.send('Erro ao buscar dados');
    }
  },

  async atualizaUsuario(req, res) {
    const { cod_usuario } = req.params;
    const { nome, email, telefone, senha, cpf } = req.body;
    try {
      await pool.query('UPDATE usuario SET nome = $1, email = $2, telefone = $3, senha = $4, cpf = $5 WHERE cod_usuario = $6', [nome, email, telefone, senha, cpf, cod_usuario]);
      res.redirect(`/index/usuario`);
    } catch (err) {
      console.error(err);
      res.redirect(`/edit/usuario/${cod_usuario}?msg=Erro ao atualizar dados`);
    }
  },

  async deletaUsuario(req, res) {
    const { cod_usuario } = req.params;
    try {
      await pool.query('DELETE FROM usuario WHERE cod_usuario = $1', [cod_usuario]);
      res.redirect('/index/usuario');
    } catch (err) {
      console.error(err);
      res.send('Erro ao deletar usuário');
    }
  },

  

};

module.exports = UserController;
