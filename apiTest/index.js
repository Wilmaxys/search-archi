const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

let port = process.argv.slice(1)[1];
 
app.get('/test', function(req, res) { // création de la route sous le verbe get
    res.send('coucou depuis le port : '+port) // envoi de hello world a l'utilisateur
})
 
 
app.listen(port, () =>  { // ecoute du serveur sur le port 8080
    console.log('le serveur fonctionne sur le port '+port)
})