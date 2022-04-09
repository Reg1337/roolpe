require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { db } = require('./firebaseConfig');
const { getNumberUsersRoom, updateRoom } = require('./services/firebaseAPI');

app.set('view engine', 'ejs');
app.use(express.static('public'));

let freeRooms = [];

db.collection('rooms').onSnapshot((snapshot) => {
    freeRooms = [];
    snapshot.forEach((doc) => {
        const room = doc.data();
        if(room.nbUsers < 2 && !freeRooms.includes(room)){
            freeRooms.push(room);
        }
        if(freeRooms.length > 2 && room.nbUsers <= 0){
            doc.ref.delete();
        }
    });

    if(freeRooms.length === 0){
        const dateTime = String(Date.now());
        db.collection('rooms').doc(dateTime).set({
            nbUsers: 0,
            roomID: dateTime,
        });
    }
    console.log('freeRooms', freeRooms);
});

const roomRoute = require('./routes/room');

app.get('/', (req, res) => {
    const randomNumber = Math.floor(Math.random() * freeRooms.length);
    const randomRoom = freeRooms[randomNumber].roomID;
    updateRoom(randomRoom, 'add');
    res.redirect(`/${randomRoom}`);
});

app.use('/', roomRoute);

io.on('connection', (socket) => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID);
        socket.broadcast.to(roomID).emit('user-connected', userID);

        socket.on('disconnect', async () => {
            await updateRoom(roomID, 'delete');
            socket.broadcast.to(roomID).emit('user-disconnected', userID);
        })
    });
});

server.listen(process.env.PORT, () => console.log(`Server is up and listening to port ${process.env.PORT}`));