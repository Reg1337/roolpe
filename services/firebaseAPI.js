const { db } = require('../firebaseConfig');

const getNumberUsersRoom = (roomID) => {
    return db
        .collection('rooms')
        .get()
        .then((res) => {
            let roomNbUsers;
            res.forEach((element) => {
                const room = element.data();
                if(roomID == room.roomID) roomNbUsers = room.nbUsers;
                console.log('room getNumber', roomNbUsers);
            });
            return roomNbUsers;
        });
};

const updateRoom = async(roomID, operator) => {
    try{
        let nbUsers = await getNumberUsersRoom(roomID);
        const newNbUsers = operator === 'add' ? nbUsers + 1 : nbUsers - 1;
        db.collection('rooms').doc(roomID).set({
            nbUsers: newNbUsers,
        }, {merge: true});
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    getNumberUsersRoom,
    updateRoom,
};