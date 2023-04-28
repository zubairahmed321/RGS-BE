const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/userRoutes");
const tabRoutes = require("./routes/tabRoutes");
const cardRoutes = require("./routes/cardRoutes");
const orderRoutes = require("./routes/orderRoutes");
const commentRoutes = require("./routes/commentRoutes");
const mailRoutes = require("./routes/mailRoutes");

const app = express();

app.use(express.json({ limit: "100mb" }));

app.use(cors());

app.use("/api/users", adminRoutes);
app.use("/api/tabs", tabRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/mails", mailRoutes);

module.exports = app;
