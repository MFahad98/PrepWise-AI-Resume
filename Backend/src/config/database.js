const mongoose = require("mongoose"); 

mongoose
 .connect(`${process.env.MONGO_URI}/resume`)
  .then(function () {
    console.log("connected db");
  })
  .catch(function (err) {
    console.log(err);
  });

module.exports = mongoose.connection;