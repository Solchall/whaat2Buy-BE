const express = require("express");
const SocketIO = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const logger = require("./logger");
const routes = require("./routes");
const connectToDatabase = require("./database");
// const webSocket = require("./socket");



// App use
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credential: true,
  })
);

// 요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어 
// request 객체에 cookies 속성 부여
app.use(cookieParser());

app.use("/api", routes);


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).send({ error: err.message });
});



async function startServer() {
  await connectToDatabase();

  const expressServer = app.listen(port, () => {
    logger.info(`Server listening at http://localhost:${port}`);
  });

  // webSocket(expressServer);

}

module.exports = startServer;
