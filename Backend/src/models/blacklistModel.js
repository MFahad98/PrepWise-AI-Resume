const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required:[ true, "token is required to be add in blacklist "], 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const blacklistTokenModel = mongoose.model("blacklistToken", blacklistTokenSchema);
module.exports = blacklistTokenModel;