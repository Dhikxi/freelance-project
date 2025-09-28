const { Message, Conversation } = require('../models');

const createMessage = async (request, response) => {
  const { conversationID, description } = request.body;

  try {
    const message = new Message({
      conversationID,
      userID: request.userID,
      description
    });

    await message.save();

    // ✅ Fixed `req` to `request`
    await Conversation.findOneAndUpdate(
      { _id: conversationID },
      { $set: { readBySeller: true, readByBuyer: true } },
      { new: true }
    );

    return response.status(201).send(message);
  } catch ({ message, status = 500 }) {
    return response.status(status).send({
      error: true,
      message
    });
  }
};

const getMessages = async (request, response) => {
  const { conversationID } = request.params;

  try {
    // ✅ Fixed `req` to `request`
    const messages = await Message.find({ conversationID: request.params.conversationID })
      .populate('userID', 'username image email')
      .sort({ createdAt: 1 });

    return response.send(messages);
  } catch ({ message, status = 500 }) {
    return response.status(status).send({
      error: true,
      message
    });
  }
};

module.exports = {
  createMessage,
  getMessages
};
