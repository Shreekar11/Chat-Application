require("dotenv").config();
const Messages = require("../models/Messages");


const message = async (req, res) => {
    try {
      const { conversationId, senderId, message, receiverId = "" } = req.body;
  
      if (!senderId || !message) {
        return res.status(200).send("All fields required");
      }
  
      if (!conversationId && receiverId) {
        const newConversation = new Conversations({
          member: [senderId, receiverId],
        });
        await newConversation.save();
        const newMessage = new Messages({
          conversationId: newConversation._id,
          senderId,
          message,
        });
        await newMessage.save();
        return res.status(200).send("Message sent successfully");
      } else if (!conversationId && !receiverId) {
        return res.status(400).send("All fields required");
      }
      const newMessage = new Messages({
        conversationId,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } catch (err) {
      console.log(err, "Error");
    }
};

const getMessage = async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
  
      if (!conversationId) {
        return res.status(200).json([]);
      }
  
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          return {
            user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
            },
            message: message.message,
          };
        })
      );
      res.status(200).json(await messageUserData);
    } catch (err) {
      console.log(err, "Error");
    }
};

module.exports = { message, getMessage };
