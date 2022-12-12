
const  Sequelize  = require('sequelize')
const sequelize = new Sequelize('teste2', 'root', '000000',{
    host: "localhost",
    dialect: 'mysql'
})

//then vai puxar uma função que dirá que estou conectado
sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso.")
}).catch(function(erro){
    console.log("Falha ao se conectar: " + erro)
})

const Postagem = sequelize.define('postagens', {
    titulo:{
        type: Sequelize.STRING
    },
    texto:{
        type: Sequelize.TEXT
    },
    mail: {
        type: Sequelize.TEXT
    }
})

