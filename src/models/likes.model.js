const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const likesSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  clothId: {
    type: String,
    required: true,
  },
});

const Likes = model("Likes", likesSchema);

module.exports = Likes;
