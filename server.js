if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

//BIBLIOTECAS INSTALADAS

const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require ("express-flash")
const session = require ("express-session")
const methodOverride = require ("method-override")
const Sequelize = require ("sequelize")
const Post = require ("./models/Post")
const { ConnectionTimedOutError } = require("sequelize")

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)


const users = []


app.use('/public', express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    is_logged_in: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

//Processo de Login

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/Posts",
    failureRedirect: "/login",
    failureFlash: true
}))

//PROCESSO DE REGISTRO
app.post("/register", async (req, res) =>  {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            insta: req.body.insta,
            atuacao: req.body.atuacao,
            youtube: req.body.youtube,
            twitter: req.body.youtube

        })
        console.log(users)
        res.redirect("/login")
    }catch (e){
        console.log(e);
        res.redirect("/register")
    }
})

//Rota visualização
app.get('/posts', checkAuthenticated, function(req, res){
    Post.findAll({order:[['id', 'DESC']]}).then(function(posts){
        res.render("posts.ejs",{posts:posts, name:req.user.name, insta:req.user.insta, atuacao:req.user.atuacao, youtube:req.user.youtube, twitter:req.user.twitter} )
    })
})
//ROTA HOME PAG NÃO RESTRITA
app.get('/blog', checkAuthenticated, function(req, res){
    Post.findAll({order:[['id', 'DESC']]}).then(function(posts){
        res.render("blog.ejs",{posts:posts})
    })
})

//INICIO DAS ROTAS

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("cadastroinfluencer.ejs")
})

app.get("/regempresa", checkNotAuthenticated, (req, res) => {
    res.render("cadastroempresa.ejs")
})

app.get('/contato',(req, res) => {
    res.render("contato.ejs")
})

app.get('/empresas', checkAuthenticated, (req, res) => {
    res.render("empresas.ejs", {name: req.user.name})
})

app.get('/influencers', checkAuthenticated, (req, res) => {
    res.render("influencers.ejs", {name: req.user.name})
})

app.get('/blog', checkAuthenticated, (req, res) => {
    res.render("blog.ejs", {name: req.user.name})
})
//////////////////////////////////////////////////////////////////////////////////////////////

app.get("/in", (req, res) => {
    res.sendFile(__dirname + "/src/index.html")
})

app.get("/quems", (req, res) => {
    res.sendFile(__dirname + "/src/quems.html")
})

app.get("/planos", (req, res) => {
    res.sendFile(__dirname + "/src/planos.html")
})

app.get("/cadastro", (req, res) => {
    res.sendFile(__dirname + "/src/cadastro.html")
})

app.get("/email", (req, res) => {
    res.sendFile(__dirname + "/src/email.html")
})

//FIM DAS ROTAS

//ISERÇÃO DE DADOS NA TABELA POST
app.post('/add', function(req, res){
    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(function(){
        res.redirect('/blog')
    }).catch(function(){
        res.send("HOUVE UM EQUIVOCO")
    })
})

//DELETAR DADOS DA TABELA
app.get('/deletar/:id', function(req, res){
    Post.destroy({where: {'id': req.params.id}}).then(function(){
        res.redirect('/posts')
    }).catch(function(erro){
        res.send("HOUVE UM EQUIVOCO, A POSTAGEM NÃO EXISTE.")
    })
})


//DESLOG
app.delete("/logout", (req, res) => {
    req.logOut(req.user, err =>{
        if (err) return nex(err)
            res.redirect("/login")
    })
})

//Funções de Autenticação
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/blog")
    }
    next()
}

//LOCAL HOST
app.listen(8081)