const SocketIO = require("socket.io");


function createInitialMsg(query){
  const initialMessage = `안녕하세요!! 당신을 온라인인 가상 점원 서비스 "🙇‍♀️ 뭐 찾으세요?" 입니다. ⭐︎${query}⭐︎를 찾고 계시군요? 사용자님을 위한 최고의 상품들입니다. 더 자세히 알아가고 싶은 상품은 🔎를, 나중에 다시 보고 싶은 상품은 💜를 눌러주세요.`;
  return initialMessage
}


module.exports=(server)=>{
  const io = SocketIO(server);
  io.on("connection",(socket)=>{
    console.log(`New Client socket ID: ${socket.id}`);

  socket.on("initialAsk", (data) => {
    console.log("initialAsk", data, data.query);
    // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함 
    io.sockets.emit("initialAI", createInitialMsg(data.query));
  });

    socket.on("disconnect",()=>{
      console.log(`Client Out socket ID: ${socket.id}`);
    })

    socket.on("error",()=>{
      console.log(`Client Error socket ID: ${socket.id}`);
    })

  })
}