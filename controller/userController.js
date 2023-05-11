// const app = require('../app');

// function User(){
//     function addUsuario(){
//         app.post('/add', async (req, res) => {
//             try {
//                 const {nome,telefone,cpf,senha,email} = req.body;
          
//               const result = await pool.query(
//                 'INSERT INTO usuario (nome, telefone, cpf, senha, email) VALUES ($1, $2, $3, $4, $5)',
//                 [nome, telefone, cpf, senha, email]
//               );
//               res.redirect('/index');
//             } catch (err) {
//               console.error(err);
//               res.send('Erro ao adicionar dados');
//             }
//           });
//     }
   
// }
// module.exports = User;