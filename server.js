import express from "express";
import cors from "cors";
import { db, User, Patientdata } from "./db/db.js";
import bcrypt from "bcrypt";
import sessions from "express-session";
import connectSession from "connect-session-sequelize";

const server = express();
server.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3002"],
  })
);
server.use(express.json());
const sequelizeStore = connectSession(sessions.Store);
server.use(
  sessions({
    secret: "mysecretkey",
    store: new sequelizeStore({ db }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  })
);

server.get("/", (req, res) => {
  res.send("Welcome to Login page");
});

server.post("/login", async (req, res) => {
  const user = await User.findOne(
    {
      where: { email: req.body.email },
    },
    { raw: true }
  );

  if (!user) {
    res.send({ error: "email not found" });
  } else {
    const matchingPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!matchingPassword) {
      res.send({ error: "password is incorrect" });
    } else {
      req.session.user = user;
      res.send({ loggedIn: true });
    }
  }
});

server.get("/logout", (req, res) => {
  req.session.destroy();
  res.send({ loggedIn: false });
});

server.get("/authStatus", async (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true });
  } else {
    res.send({ loggedIn: false });
  }
});

const serverStarted = async () => {
  const user = await User.findOne({ where: { email: "kalai@gmail.com" } });
  if (!user) {
    await User.create({
      email: "kalai@gmail.com",
      firstName: "Kalai",
      password: bcrypt.hashSync("qwerty", 10),
    });
  }
};
serverStarted();

//authrequired
server.post("/patientdata", async (req, res) => {
  await Patientdata.create({
    patientname: req.body.patientName,
    // age: req.body.content,
    // patientdateofbirth: req.session?.user?.id,
  });
  res.send({ patient: "created" });
});

server.get("/patientdata", async (req, res) => {
  res.send({ patientsdata: await Patientdata.findAll() });
});

server.put("/patientdata/:id", async (req, res) => {
  await Patientdata.update(req.body, { where: { id: req.params.id } });
  res.send({ update: true });
});

// server.get("/patientdata", async (req, res) => {
//   res.send({
//     patientname: await Post.findAll({
//       order: [["id", "Lastname"]],
//       include: [{ model: User, attributes: ["email"] }],
//     }),
//   });
// });

let port = 3001;
if (process.env.PORT) {
  port = process.env.PORT;
}

//#9 run express API server in background to listen for incoming requests
server.listen(port, () => {
  console.log("Server running.");
});
