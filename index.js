const express = require('express');
const app = express();
const bd = require('./database');
const autores = require('./autores.js');
const hour = 60*60*1000
const session = require('express-session');
const cors = require('cors');

app.use(express.urlencoded({ 
    extended:false
}));
app.use(express.json({limit:'2mb'}));

const corsI= (req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

app.use(session({
        resave:false,
        saveUninitialized: false,
        secret:'motamota',
        cookie:{
            maxAge: hour*4
            // sameSite: true,
            // secure: true
        }
    }))
const {PORT=3000}= process.env

    app.get('/autor/search', corsI, (req,res)=>{
        if(req.query.id){
            res.json(autores[req.query.id]);
        }else{}
        const result = autores.find(e=> e.nome==req.query.name);
        res.json(result)
    })
    app.get('/bio/search', corsI, (req,res)=>{
        if(req.query.id){
            const {bio, nome, urlFoto}=autores[req.query.id];
            res.json({nome:nome, bio:bio, urlFoto:urlFoto});
        }else{
            const result = autores.find(e=> e.nome==req.query.name);
            const {bio, nome, urlFoto}=result;
            res.json({nome:nome, bio:bio, urlFoto:urlFoto})
        }
    })

    app.get('/autor/rand', corsI, (req,res)=>{
        if(!req.session.rand){
            req.session.rand=-1;
        }
        let sorted=req.session.rand;
        do{
            sorted = Math.floor(Math.random() * autores.length)
        }while(sorted==req.session.rand);

        req.session.rand=sorted;
        const {sucesso, nome, pDescricao, id}=autores[sorted]
        res.json({sucesso:sucesso, nome:nome, pDescricao:pDescricao, id:id});
    })
    app.get('/obras', corsI, (req,res)=>{
        if(!req.session.rand2){
            req.session.rand2=-1;
        }
        let sorted=req.session.rand2;
        do{
            sorted = Math.floor(Math.random() * autores[req.query.id].obras.length)
        }while(sorted==req.session.rand || sorted==req.query.last);
        if(autores[req.query.id].obras[sorted].link){
            res.json({link:autores[req.query.id].obras[sorted].link})
        }
        const{titulo, conteudo}=autores[req.query.id].obras[sorted];
        res.json({titulo:titulo, conteudo:conteudo, nome:autores[req.query.id].nome, idi:sorted});
    })
    app.get('/session', (req, res)=>{
        if(req.session.vew){
            req.session.vew++;
        }else{
            req.session.vew=1;
        }
        res.send(""+req.session.vew)
    })
app.listen(PORT, ()=>{console.log(`Rodando em ${PORT}`)});