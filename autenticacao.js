// autentificação

function protecao(req, res, next) {
    if (req.session.userID) {
      // O usuário está autenticado, permita o acesso à próxima rota
      next();
    } else {
      req.session.message = 'Faça o login para acessar esta página.';
      // O usuário não está autenticado, redirecione para a página de login
      res.redirect('/');
      
    }
  }
  
  module.exports = protecao;
  