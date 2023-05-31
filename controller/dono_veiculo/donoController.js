const pool = require('../../db');

const donoController = {
async donoIndex(req, res) {
    try {
      const result = await pool.query('SELECT * FROM dono_veiculo ORDER BY nome');
      res.render('donoIndex', { data: result.rows });
    } catch (err) {
      console.error(err);
      res.send('Erro ao buscar dados');
    }
  },
  async adicionaDono(req,res){
    try {
      const {nome,telefone,cpf,endereco,email} = req.body;
      const cpfSemCaracteresEspeciais = req.body.cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

      const cpfExists = await pool.query('SELECT * FROM dono_veiculo where cpf = $1', [cpfSemCaracteresEspeciais]);
      if(cpfExists.rowCount>0){
                // Já existe um usuário com o mesmo cpf, retorne uma mensagem de erro ou redirecione para uma página de erro

        return res.send('já existe um dono com esse CPF');
      }

      const emailExists = await pool.query('SELECT * FROM dono_veiculo WHERE email = $1', [email]);
      if (emailExists.rowCount > 0) {
        // Já existe um usuário com o mesmo email, retorne uma mensagem de erro ou redirecione para uma página de erro
        return res.send('Já existe um dono com esse email');
      }
     
    const result = await pool.query(
      'INSERT INTO dono_veiculo (nome, telefone, cpf, endereco, email) VALUES ($1, $2, $3, $4, $5)',
      [nome, telefone, cpfSemCaracteresEspeciais, endereco, email]
    );
    res.redirect('/index/dono');
  } catch (err) {
    console.error(err);
    res.send('Erro ao adicionar dados');
  }
  },

  async paginadonoAdd(req, res) {
    res.render('donoAdd')
  },

  async paginadonoEdit(req, res) {
    const { cod_dono_veiculo } = req.params;
    try {
      const result = await pool.query('SELECT * FROM dono_veiculo WHERE cod_dono_veiculo = $1', [cod_dono_veiculo]);
      res.render('donoEdit', { data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.send('Erro ao buscar dados');
    }
  },

  async atualizaDono(req, res) {
    const { cod_dono_veiculo } = req.params;
    const { nome, email, telefone, endereco, cpf } = req.body;
    try {
      await pool.query('UPDATE dono_veiculo SET nome = $1, email = $2, telefone = $3, endereco = $4, cpf = $5 WHERE cod_dono_veiculo = $6', [nome, email, telefone, endereco, cpf, cod_dono_veiculo]);
      res.redirect(`/index/dono`);
    } catch (err) {
      console.error(err);
      res.redirect(`/edit/dono/${cod_dono_veiculo}?msg=Erro ao atualizar dados`);
    }
  },

  async paginaDonoDelete(req,res){
    const { cod_dono_veiculo } = req.params;
    try {
      const result = await pool.query('SELECT * FROM dono_veiculo WHERE cod_dono_veiculo = $1', [cod_dono_veiculo]);
      if (result.rowCount === 0) {
        return res.send('Item não encontrado');
      }
      res.render('donoDelete', { data: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.send('Erro ao buscar dados');
    }
  },

  async deletaDono(req, res) {
    const { cod_dono_veiculo } = req.params;
    try {
      await pool.query('DELETE FROM dono_veiculo WHERE cod_dono_veiculo = $1', [cod_dono_veiculo]);
      res.redirect('/index/dono');
    } catch (err) {
      console.error(err);
      res.send('Erro ao deletar usuário');
    }
  },
}
module.exports = donoController;