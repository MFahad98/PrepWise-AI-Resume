
require("dotenv").config();

const app = require("./src/app");

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
  });
}

module.exports = app;
