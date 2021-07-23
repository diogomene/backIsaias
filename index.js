const express = require('express');
const app = express();
const bd = require('./database');
const autores = bd.getData();
const autores2 = require('./autores')
const hour = 60*60*1000
const names =[];
const {PORT=3000}= process.env

autores.forEach(element => {
    names.push({id:element.id, nome:element.nome});
});

app.use(express.urlencoded({ 
    extended:false
}));
app.use(express.json({limit:'2mb'}));

const corsI= (req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

    app.get('/autor/search', corsI, (req,res)=>{
        if(req.query.id){
            res.json(autores[req.query.id]);
        }else{
        const result = autores.find(e=> e.nome==req.query.name);
        return res.json(result)
        }
    })
    app.get('/bio/search', corsI, (req,res)=>{
        bd.save(autores2)
        if(req.query.id){
            const {bio, nome, urlFoto}=autores[req.query.id];
            return res.json({nome:nome, bio:bio, urlFoto:urlFoto});
        }else{
            const result = autores.find(e=> e.nome==req.query.name);
            const {bio, nome, urlFoto}=result;
            return res.json({nome:nome, bio:bio, urlFoto:urlFoto})
        }
    })

    app.get('/autor/rand', corsI, (req,res)=>{
        let sorted = -1;
        const last =req.query.last
        do{
            sorted = Math.floor(Math.random() * autores.length)
        }while(sorted==last);
        const {sucesso, nome, pDescricao, id}=autores[sorted]
        return res.json({sucesso:sucesso, nome:nome, pDescricao:pDescricao, id:id});
    })
    app.get('/obras', corsI, (req,res)=>{
        let sorted=-1;
        if(autores[req.query.id].obras.length==1){
            const{titulo, conteudo}=autores[req.query.id].obras[0];
            return res.json({titulo:titulo, conteudo:conteudo, nome:autores[req.query.id].nome, idi:0});
        }
        do{
            sorted = Math.floor(Math.random() * autores[req.query.id].obras.length)
        }while(sorted==req.query.last);
        if(autores[req.query.id].obras[sorted].link){
            return res.json({nome:autores[req.query.id].nome,
                titulo:autores[req.query.id].obras[sorted].titulo,
                conteudo:autores[req.query.id].obras[sorted].conteudo,
                link:autores[req.query.id].obras[sorted].link,
                idi:sorted})
        }
        const{titulo, conteudo}=autores[req.query.id].obras[sorted];
        return res.json({titulo:titulo, conteudo:conteudo, nome:autores[req.query.id].nome, idi:sorted});
    })
    app.get('/names', (req,res)=>{
        res.json(names)
    })
    app.get('/archive', (req, res)=>{
        res.download('./data.json')
    })
    app.post('/new/autor', (req,res)=>{
        const {nome,pDescricao,urlFoto,bio,sucesso} = req.body;
        autores.push({id:autores.length, nome:nome, pDescricao:pDescricao, urlFoto:urlFoto, bio:bio, sucesso: sucesso, obras:[]});
        bd.save(autores);
        names.push({id:autores.length-1,nome:nome})
        res.json({err:false, msg:"Deu boa!"})
    })
    app.post('/remove/autor',(req, res)=>{
        console.log(autores)
        const {nome, password} = req.body
        if(password!="motacorno"){
            return res.json({error:true, msg:"Senha incorreta"});
        }
        
        let indice = autores.findIndex(e=>e.nome==nome);
        if(indice==-1){
            return res.json({error:true, msg:"Não encontrado"});
        }
        autores.splice(indice,1);
        names.splice(indice,1);
        bd.save(autores);
        res.json({err:false, msg:"Deu boa!"})
    })
    app.post('/new/obra', (req,res)=>{
        const {idAutor, titulo, conteudo, link} = req.body
        autores[idAutor].obras.push({titulo:titulo, conteudo:conteudo})
        if(link){
            autores[idAutor].obras[autores[idAutor].obras.length-1].link=link;
        }
        res.json({err:false, msg:"Deu boa!"})
        bd.save(autores)
    })

app.listen(PORT, ()=>{console.log(`Rodando em ${PORT}`)});