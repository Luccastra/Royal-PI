const db = require('./db')
const Post = db.sequelize.define('royalpostagens', {
    titulo:{
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.STRING
    },
})

//cria a tabela
//Post.sync({force:true})

//insere os dados
module.exports = Post