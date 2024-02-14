const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const io = require("socket.io")(8080, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

// connect db
require("./db/connection");

//import files
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages");

// app uses
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

// socket io
io.on('connection', socket => {
    console.log('User connected', socket.id);
    // socket.on('addUser', userId => {
    //     socket.userId = userId;
    // });
    // io.emit('getUsers', socket.userId);
});

// routes
app.get("/", (res, req) => {
  res.send("Welcome");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).send("All fields required");
    }else {
      const isAlreadyExists = await Users.findOne({ email });
      if (isAlreadyExists) {
        res.status(400).send("User already exists");
      }else {
        const newUser = new Users({ fullName, email });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
            newUser.set('password', hashedPassword);
            newUser.save();
            next();
        })
        return res.status(200).send("User registered successfully");
      }
    }
  } catch (err) {
    console.log(err, "Error");
  }
});

app.post('/api/login', async(req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).send("All fields required");
        }else {
            const user = await Users.findOne({email});
            if(!user){
                res.status(400).send("User email incorrect");
            }else{
                const validateUser = await bcryptjs.compare(password, user.password);
                if(!validateUser){
                    res.status(400).send("User password incorrect")
                }else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY"
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async(err, token) => {
                        await Users.updateOne({_id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        res.status(200).json({
                            user: {
                                id: user._id,
                                email: user.email,
                                fullName: user.fullName
                            },
                            token: token
                        });
                    })
                }
            }
        }
    } catch (err) {
        console.log(err, "Error");
    }
})

app.post('/api/conversations', async(req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new Conversations({members: [senderId, receiverId]});
        await newConversation.save();
        res.status(200).send("Conversation created successfully");
    } catch (err) {
        console.log(err, "Error");
    }
})

app.get('/api/conversations/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({members: {
            $in: [userId]
        }});
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return {
                user: {
                    email: user.email,
                    fullName: user.fullName,   
                },
                conversationId: conversation._id
            }
        }))
        res.status(200).json(await conversationUserData);
    } catch (err) {
        console.log(err, "Error");
    }
})

app.post('/api/message', async(req, res) => {
    try {
        const {conversationId, senderId, message, receiverId = ''} = req.body;

        if(!senderId || !message){
            return res.status(200).send("All fields required");
        }

        if(!conversationId && receiverId){
            const newConversation = new Conversations({member: [senderId, receiverId]});
            await newConversation.save();
            const newMessage = new Messages({
                conversationId: newConversation._id,
                senderId,
                message
            });
            await newMessage.save();
            return res.status(200).send("Message sent successfully");
        }else if(!conversationId && !receiverId) {
            return res.status(400).send("All fields required");
        }
        const newMessage = new Messages({
            conversationId,
            senderId,
            message
        });
        await newMessage.save();
        return res.status(200).send("Message sent successfully");
    } catch (err) {
        console.log(err, "Error");
    }
})

app.get('/api/message/:conversationId', async(req, res) => {
    try {
        const conversationId = req.params.conversationId;

        if(!conversationId){
            return res.status(200).json([]);
        }

        const messages = await Messages.find({conversationId});
        const messageUserData = Promise.all(messages.map(async (message) => {
            const user = await Users.findById(message.senderId);
            return {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,   
                },
                message: message.message
            }
        }));
        res.status(200).json(await messageUserData);
    } catch (err) {
        console.log(err, "Error");
    }
})

app.get('/api/users', async (req, res) => {
    try {
        const users = await Users.find();
        const usersData = Promise.all(users.map((user) => {
            return { 
                users: {
                    email: user.email,
                    fullName: user.fullName
                },
                userId: user._id
            }
        }));
        res.status(200).json(await usersData);
    } catch (err) {
        console.log(err, "Error");
    }
})

app.listen(port, () => {
  console.log("listening on port " + port);
});
