const SocketIO = require("socket.io");

module.exports=(server)=>{
  const io = SocketIO(server);
  io.on("connection",(socket)=>{
    console.log(`New Client socket ID: ${socket.id}`);

    socket.on("disconnect",()=>{
      console.log(`Client Out socket ID: ${socket.id}`);
    })

    socket.on("error",()=>{
      console.log(`Client Error socket ID: ${socket.id}`);
    })

  })
}