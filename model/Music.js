const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    linkImage: {
      type: String,
      required: true,
      trim: true
    },
    linkMusic: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Music", musicSchema);