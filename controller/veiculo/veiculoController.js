const pool = require('../../db');

const veiculoController = {

    async obterModelos(req, res) {
        try {
            const marcaSelecionada = req.query.marca;

            // Consulta ao banco de dados para obter o cod_marca da marca selecionada
            const marcaResult = await pool.query('SELECT cod_marca FROM marca WHERE nome = $1', [marcaSelecionada]);
            const codMarca = marcaResult.rows[0].cod_marca;

            // Consulta ao banco de dados para obter os modelos com base no cod_marca
            const modeloResult = await pool.query('SELECT * FROM modelo WHERE cod_marca = $1', [codMarca]);
            const modelos = modeloResult.rows.map(row => row.nome); // Obtem apenas o nome dos modelos

            res.json({ modelos: modelos });
        } catch (error) {
            console.error('Erro ao obter modelos:', error);
            res.status(500).json({ error: 'Erro ao obter modelos' });
        }

    },



    async veiculoIndex(req, res) {
        try {
            const result = await pool.query(
                'SELECT v.cod_veiculo, v.placa, v.preco, v.cor, v.ano, v.descricao, v.status, ' +
                'mo.nome AS nomeModelo, m.nome AS nomeMarca, d.nome AS nomeDono, u.nome AS nomeUsuario ' +
                'FROM veiculo v, modelo mo, marca m, dono_veiculo d, usuario u ' +
                'WHERE v.cod_modelo = mo.cod_modelo ' +
                'AND mo.cod_marca = m.cod_marca ' +
                'AND v.cod_dono_veiculo = d.cod_dono_veiculo ' +
                'AND v.cod_usuario = u.cod_usuario ' 
             
              );



            res.render('veiculoIndex', { data: result.rows });
        } catch (err) {
            console.error(err);
            res.send('Erro ao buscar dados');
        }
    },

    async paginaVeiculoAdd(req, res) {
        const statusOptions = ['D', 'V', 'M', 'I'];
        const marcas = await pool.query('SELECT * FROM marca');
        const usuario_nome = req.session.username;
        const dono_nome = await pool.query('SELECT * FROM dono_veiculo');

        res.render('veiculoAdd', { statusOptions, dono_nome: dono_nome.rows, marcas: marcas.rows, usuario_nome: usuario_nome });
    },

    async adicionaVeiculo(req, res) {
        try {
            const { placa, preco, cor, ano, descricao, status, modelo, dono_nome, usuario_nome } = req.body;

            // Obter o código do modelo com base no nome selecionado
            const modeloSelecionado = await pool.query('SELECT cod_modelo FROM modelo WHERE nome = $1', [modelo]);
            if (modeloSelecionado.rowCount === 0) {
                return res.send('Modelo não encontrado');
            }
            const codModelo = modeloSelecionado.rows[0].cod_modelo;



            // Obter o código do dono com base no nome
            const dono = await pool.query('SELECT cod_dono_veiculo FROM dono_veiculo WHERE nome = $1', [dono_nome]);
            if (dono.rowCount === 0) {
                return res.send('Dono não encontrado');
            }
            const codDonoVeiculo = dono.rows[0].cod_dono_veiculo;

            // Obter o código do usuário com base no nome
            const usuario = await pool.query('SELECT cod_usuario FROM usuario WHERE nome = $1', [usuario_nome]);
            if (usuario.rowCount === 0) {
                return res.send('Usuário não encontrado');
            }
            const codUsuario = usuario.rows[0].cod_usuario;

            const result = await pool.query(
                'INSERT INTO veiculo (placa,  preco, cor, ano, descricao, status, cod_modelo, cod_dono_veiculo, cod_usuario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [placa, preco, cor, ano, descricao, status, codModelo, codDonoVeiculo, codUsuario]
            );

            res.redirect('/index/veiculo');
        } catch (err) {
            console.error(err);
            res.send('Erro ao adicionar dados');
        }
    },

    async paginaVeiculoEdit(req, res) {
        const statusOptions = ['D', 'V', 'M', 'I'];
        const { cod_veiculo } = req.params;
        const marcas = await pool.query('SELECT * FROM marca');
        const dono_nome = await pool.query('SELECT nome AS nomedono FROM dono_veiculo');
        const usuario_nome = req.session.username;
       
     

        try {
        
            const result = await pool.query(
                'SELECT v.*, m.nome AS nomeModelo, d.nome AS nomedono ' +
                'FROM veiculo v, modelo m, dono_veiculo d ' +
                'WHERE v.cod_modelo = m.cod_modelo ' +
                'AND v.cod_dono_veiculo = d.cod_dono_veiculo ' +
                'AND v.cod_veiculo = $1',
                [cod_veiculo]
            );
              
            res.render('veiculoEdit', { data: result.rows[0], marcas:marcas.rows, statusOptions, dono_nome:dono_nome.rows, usuario_nome:usuario_nome });
        } catch (err) {
            console.error(err);
            res.send('Erro ao buscar dados');
        }
    },
      
      

    async atualizaVeiculo(req, res) {
        const { cod_veiculo } = req.params;
        const { placa, preco, cor, ano, descricao, status, modelo, dono_nome, usuario_nome } = req.body;

            // Obter o código do modelo com base no nome selecionado
            const modeloSelecionado = await pool.query('SELECT cod_modelo FROM modelo WHERE nome = $1', [modelo]);
            if (modeloSelecionado.rowCount === 0) {
                return res.send('Modelo não encontrado');
            }
            const codModelo = modeloSelecionado.rows[0].cod_modelo;



            // Obter o código do dono com base no nome
            const dono = await pool.query('SELECT cod_dono_veiculo FROM dono_veiculo WHERE nome = $1', [dono_nome]);
            if (dono.rowCount === 0) {
                return res.send('Dono não encontrado');
            }
            const codDonoVeiculo = dono.rows[0].cod_dono_veiculo;

            // Obter o código do usuário com base no nome
            const usuario = await pool.query('SELECT cod_usuario FROM usuario WHERE nome = $1', [usuario_nome]);
            if (usuario.rowCount === 0) {
                return res.send('Usuário não encontrado');
            }
            const codUsuario = usuario.rows[0].cod_usuario;

        try {
            await pool.query(
                'UPDATE veiculo SET placa = $1, preco = $2, cor = $3, ano = $4, descricao = $5, status = $6, cod_modelo = $7, cod_dono_veiculo = $8, cod_usuario = $9 WHERE cod_veiculo = $10',
                [placa, preco, cor, ano, descricao, status, codModelo,  codDonoVeiculo, codUsuario, cod_veiculo]
            );

            res.redirect(`/index/veiculo`);
        } catch (err) {
            console.error(err);
            res.redirect(`/edit/veiculo/${cod_veiculo}?msg=Erro ao atualizar dados`);
        }
    },

    async paginaVeiculoDelete(req, res) {
        const { cod_veiculo } = req.params;
        const nomeDoModelo =  await pool.query(
            'SELECT v.*, m.nome AS nomeModelo ' +
            'FROM veiculo v, modelo m ' +
            'WHERE v.cod_modelo = m.cod_modelo ' +
            'AND v.cod_veiculo = $1',
            [cod_veiculo]
        );


        try {
            const result = await pool.query('SELECT * FROM veiculo WHERE cod_veiculo = $1', [cod_veiculo]);

            if (result.rowCount === 0) {
                return res.send('Veículo não encontrado');
            }

            res.render('veiculoDelete', { data: result.rows[0], nomeDoModelo:nomeDoModelo.rows[0] });
        } catch (err) {
            console.error(err);
            res.send('Erro ao buscar dados');
        }
    },

    async deletaVeiculo(req, res) {
        const { cod_veiculo } = req.params;

        try {
            await pool.query('DELETE FROM veiculo WHERE cod_veiculo = $1', [cod_veiculo]);
            res.redirect('/index/veiculo');
        } catch (err) {
            console.error(err);
            res.send('Erro ao deletar veículo');
        }
    }
};

module.exports = veiculoController;
