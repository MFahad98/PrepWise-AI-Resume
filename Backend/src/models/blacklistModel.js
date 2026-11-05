const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required:[ true, "token is required to be add in blacklist "], 
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24, // JWT 1 din mein expire hota hai, is ke baad blacklist entry auto-delete
  },
});

const blacklistTokenModel = mongoose.model("blacklistToken", blacklistTokenSchema);
module.exports = blacklistTokenModel;