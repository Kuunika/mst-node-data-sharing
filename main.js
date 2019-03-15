const express = require('express')
const bodyParser = require('body-parser')

const dataRoutes = require('./routes/data')
const app = express()

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
});

app.use('/data', dataRoutes)

app.get('/', function (req, res) {
    res.send('Running Kugawa Server from MST')
})

const server = app.listen(3000)
const io = require('./util/socket').init(server)

io.sockets.on('connection', onConnect)

function onConnect(socket) {
    console.log('client connected: ' + socket.id)

    io.sockets.emit("start", { "message" : socket.id})

    socket.on('disconnect', function(){
        console.log('the client has left')
        socket.broadcast.emit("userdisconnect", 'user has left')
    })
}







