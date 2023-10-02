const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userMessageSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  clothId: {
    type: String,
  },
  type:{
    type:String,
    required:true,
  },
  message:{
type:String
  }
});

const userMessage = model("userMessage", userMessageSchema);

module.exports = userMessage;
