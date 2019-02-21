require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next){
    const bearerToken = req.get('Authorization')
    const apiToken = bearerToken.slice(bearerToken.indexOf(' ') +1);
    const password = process.env.API_TOKEN
    console.log('apiToken', apiToken);
    console.log('password', password);

    if (!apiToken || apiToken !== password){
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next();
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychich`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res){
  res.send(validTypes);
}

function handleGetPokemon(req, res){
    let search = POKEDEX.pokemon;
     
    if(req.query.name){
        search = search.filter(pokemon => pokemon.name.toLowerCase().includes(req.query.name.toLowerCase()) );
    }

    if(req.query.type){
        search = search.filter(pokemon => pokemon.type.includes(req.query.type));
    } 

    res.send(search);
}
    

app.get("/types", handleGetTypes)

app.get('/pokemon', handleGetPokemon)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})