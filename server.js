const env = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === "development") {
  env.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`) });
} else {
  env.config();
}

const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
