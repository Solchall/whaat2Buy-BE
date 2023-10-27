const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const chatSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  clothId: [String],
  type:{
    type:String,
    required:true,
  },
  message:{
type:String
  }
});

const Chat = model("chat", chatSchema);

module.exports = Chat;
