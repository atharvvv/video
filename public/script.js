const socket = io('/')
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted = true;


var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3001' //
})

let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on('call', call =>{
    call.answer(stream);
    const video = document.createElement('video')
    call.on('stream', (userVideoStream)=>{
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
  // user is joining
  setTimeout(() => {
    // user joined
    connectToNewUser(userId, stream)
  }, 1000)
})





})




const connectToNewUser=(userId, stream)=> {
  //send my own stream to other user
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  //receive remotestream from someone else
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  // peers[userId] = call
}

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)

})


const addVideoStream = (video, stream)=>{
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () =>{
    video.play();
    videoGrid.append(video);
  });

};
