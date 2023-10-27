const models = require("../models");
const SocketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const axios = require("axios");

function createInitialMsg(query) {
  const initialMessage = `안녕하세요!! 당신을 위한 온라인 가상 점원 서비스 "🙇‍♀️ 뭐 찾으세요?" 입니다. ⭐︎${query}⭐︎를 찾고 계시군요? 사용자님을 위한 최고의 상품들입니다. 더 자세히 알아가고 싶은 상품은 🔎를, 나중에 다시 보고 싶은 상품은 💜를 눌러주세요.`;
  return initialMessage;
}

function createRequestInfo(name, type){
  let requestMessage;
  if (type==="basic"){
    requestMessage = `${name}이 어떤 상품인지 설명해줘`;
  }
  else if (type==="size"){
   requestMessage = `${name}의 사이즈에 대해 설명해줘`; 
  }

  else if (type==="review"){
    requestMessage=`${name}에 대한 다른 사람의 의견은 어때?`
  }
  else{
    requestMessage="기타 설명";
  }
  console.log(requestMessage);
return requestMessage;
}

async function createFakeResponse(productNo, type){
  const apiURL = `http://localhost:4000/clothes?no=${productNo}`;
  const {data} = await axios.get(apiURL);
  console.log(data)
  const {simple_detail,size_reco, review_summ} = data[0];

  console.log(simple_detail, size_reco, review_summ)

  if (type==="basic"){
    return simple_detail
  }
  else if (type==="size"){
    return size_reco
  }
  else if (type==="review"){
    return review_summ;
  }
  else{
    return "기타 질문"
  }
}

async function createBasicInfo(productUrl, apikey) {
  const fakeAPI = ""
  const apiURL =
    "https://mighty-ridge-39909-c47917ae1ce7.herokuapp.com/items/details";
  const body = {
    productUrl,
    apikey,
  };
  console.log("body", body);
 const response =  axios
    .post(apiURL, body)
    .then(({ data: { simple_detail } }) => {
     console.log(simple_detail)
      return simple_detail
    })
    .catch((error) => {
      console.error(error.data);
    });
console.log(response);
    return response
}
async function createSizeInfo(productUrl, apikey) {
  const apiURL =
    "https://mighty-ridge-39909-c47917ae1ce7.herokuapp.com/items/details/size";
  const body = {
    productUrl,
    apikey,
  };
  console.log("body", body);
  const response = axios
    .post(apiURL, body)
    .then(({ data: { size_reco } }) => {
      console.log(size_reco)
      return size_reco;
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(response);
  return response;
}

async function createReviewInfo(productUrl, apikey) {
  const apiURL =
    "https://mighty-ridge-39909-c47917ae1ce7.herokuapp.com/items/details/review";
  const body = {
    productUrl,
    apikey,
  };
  console.log("body", body);
  const response = axios
    .post(apiURL, body)
    .then(({ data: { review_summ } }) => {
      console.log(review_summ)
      return review_summ;
    })
    .catch((error) => {
      console.error(error.data);
    });
  console.log(response);
  return response;
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

      /* 유저 요청한 옷 스타일 DB 저장
      const chatDoc = models.Chat({
        owner: socket.userId,
        type:"initial Demand",
        clothId: req.body.clothId,
        message: data.query,
      });

      await chatDoc.save();*/
      // console.log("데이터 저장")
    });


    socket.on("req:basicInfo", async ({ productNo, productName }) => {
      console.log(productNo, productName);
      // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
      io.sockets.emit("req:basicInfo", createRequestInfo(productName, "basic"));
      const simpleDetail = await createFakeResponse(productNo, "basic"); //

      console.log(simpleDetail);
      io.sockets.emit("res:basicInfo", simpleDetail);
    });

    socket.on("req:sizeInfo", async ({ productNo, productName }) => {
      console.log(productNo, productName);
      // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
      io.sockets.emit("req:sizeInfo", createRequestInfo(productName, "size"));
      const sizeReco = await createFakeResponse(productNo, "size");
      console.log(sizeReco);
      io.sockets.emit("res:sizeInfo", sizeReco);
    });


      socket.on(
        "req:reviewInfo",
        async ({ productNo, productName }) => {
          console.log(productNo, productName);
          // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
          io.sockets.emit(
            "req:reviewInfo",
            createRequestInfo(productName, "review")
          );
          const reviewSumm = await createFakeResponse(productNo, "review");
          console.log(reviewSumm);
          io.sockets.emit("res:reviewInfo", reviewSumm);
        }
      );
    /*
    socket.on("req:basicInfo", async ({ productUrl, productName, apikey }) => {
      console.log(productUrl, productName, apikey);
      // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
      io.sockets.emit("req:basicInfo", createRequestInfo(productName,"basic"));
      const simpleDetail = await createBasicInfo(productUrl, apikey) //
    
      console.log(simpleDetail)
      io.sockets.emit("res:basicInfo", simpleDetail);
    });



    socket.on(
      "req:sizeInfo",
      async ({ productUrl, productName, apikey }) => {
        console.log(productUrl, productName, apikey);
        // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
        io.sockets.emit("req:sizeInfo", createRequestInfo(productName,"size"));
        const sizeReco = await createSizeInfo(productUrl, apikey);
        console.log(sizeReco);
        io.sockets.emit("res:sizeInfo", sizeReco);
      }
    );

    socket.on(
      "req:reviewInfo",
      async ({ productUrl, productName, apikey }) => {
        console.log(productUrl, productName, apikey);
        // ⭐︎ 우선은 전체로 내보내도록 설정함 => 추후에 해당 유저에게만 내보내도록 설정해야 함
        io.sockets.emit(
          "req:reviewInfo",
          createRequestInfo(productName, "review")
        );
        const reviewSumm = await createReviewInfo(productUrl, apikey);
        console.log(reviewSumm);
        io.sockets.emit("res:reviewInfo", reviewSumm);
      }
    );
*/


    socket.on("disconnect", () => {
      console.log(`Client Out socket ID: ${socket.id}`);
    });

    socket.on("error", () => {
      console.log(`Client Error socket ID: ${socket.id}`);
    });
  });
};
