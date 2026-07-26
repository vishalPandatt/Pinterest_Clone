const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postText: String,
  },
  { timestamps: true },
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
