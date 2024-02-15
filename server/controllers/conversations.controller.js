require("dotenv").config();
const Conversations = require("../models/Conversations");


const conversations  = async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      const newConversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      res.status(200).send("Conversation created successfully");
    } catch (err) {
      console.log(err, "Error");
    }
};

const getConversation = async (req, res) => {
    try {
      const userId = req.params.userId;
      const conversations = await Conversations.find({
        members: {
          $in: [userId],
        },
      });
      const conversationUserData = Promise.all(
        conversations.map(async (conversation) => {
          const receiverId = conversation.members.find(
            (member) => member !== userId
          );
          const user = await Users.findById(receiverId);
          return {
            user: {
              email: user.email,
              fullName: user.fullName,
            },
            conversationId: conversation._id,
          };
        })
      );
      res.status(200).json(await conversationUserData);
    } catch (err) {
      console.log(err, "Error");
    }
};

module.exports = { conversations, getConversation };
