const videoContainer = document.getElementById('video-container');
const myVideo = document.createElement('video');
const socket = io('/');
const myPeer = new Peer(undefined, {
    host: 'peerjs-server.herokuapp.com',
    secure: true,
    port: 443,
});
let peers = [];

myVideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
}).then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })

    socket.on('user-connected', (userID) => {
        console.log('userId', userID);
        connectToNewUser(userID, stream);
    });
});

myPeer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
});

socket.on('user-disconnected', userID => {
    if (peers[userID]) peers[userID].close();
})

function connectToNewUser(userID, stream) {
    const call = myPeer.call(userID, stream);
    const video = document.createElement(video);
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userID] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoContainer.append(video);
}