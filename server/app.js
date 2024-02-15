const express = require("express");
const cors = require("cors");
const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// connect db
require("./db/connection");

// app uses
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

// socket io
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ( message ) => {
    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


// routes
app.get("/", (res, req) => {
  res.send("Welcome");
});

app.use("/api/user", require('./routes/users.routes'));
app.use("/api/conversations", require('./routes/conversations.routes'));
app.use("/api/messages", require('./routes/messages.routes') );


app.listen(port, () => {
  console.log("listening on port " + port);
});
