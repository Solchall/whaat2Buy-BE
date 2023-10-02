const models = require("../models");
const SocketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const axios = require("axios");

function createInitialMsg(query) {
  const initialMessage = `안녕하세요!! 당신을 위한 온라인 가상 점원 서비스 "🙇‍♀️ 뭐 찾으세요?" 입니다. ⭐︎${query}⭐︎를 찾고 계시군요? 사용자님을 위한 최고의 상품들입니다. 더 자세히 알아가고 싶은 상품은 🔎를, 나중에 다시 보고 싶은 상품은 💜를 눌러주세요.`;
  return initialMessage;
}

function createRequestInfo(name){
const requestMessage = `${name}에 대해 설명해줘`;
return requestMessage;
}

module.exports = (server) => {
  const io = SocketIO(server);
  //console.log(io);
  io.use((socket, next)=>{
    const userId = socket.handshake.auth.userId;
    const accessToken = socket.handshake.auth.accessToken;
    console.log("io use", accessToken, userId);
    if (accessToken) {
      /*const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const userId = decodedToken.userId;*/
      socket.userId=userId;
    }
next()
  })
  .on("connection", (socket) => {
    console.log(
      `New Client socket: ${socket.id} ${socket.userId}`
    );


    socket.on("initialAsk", async (data) => {
      // console.log("initialAsk", data, socket.userId);

      // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
      io.sockets.emit("initialAI", createInitialMsg(data.query));


      // 유저 요청한 옷 스타일 DB 저장
      const userMessageDoc = models.Chat({
        owner: socket.userId,
        type:"initial Demand",
        /*clothId: req.body.clothId,*/
        message: data.query,
      });

      await userMessageDoc.save();
      // console.log("데이터 저장")
    });

    socket.on("req:basicInfo",({item})=>{
      // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
      io.sockets.emit("req:basicInfo", createRequestInfo(item.name));
    });

    socket.on("req:HTML", ( parsedData ) => {
      // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함

      /*axios
        .post(process.env.TEMP_BASIC_HTML, parsedData)
        .then((response) => {
          console.log("post 성공");

          io.sockets.emit("res:basicInfo", "기본 정보를 알려드릴게용~~~");
        })
        .catch((error) => {
          console.error(error);
        });*/
        axios.get("https://dummyjson.com/comments").then(()=>{
          console.log("axios 요청",)
        })
        io.sockets.emit("res:basicInfo", "기본 정보를 알려드릴게용~~~");

    });



    socket.on("disconnect", () => {
      console.log(`Client Out socket ID: ${socket.id}`);
    });

    socket.on("error", () => {
      console.log(`Client Error socket ID: ${socket.id}`);
    });
  });
};
