const { Conversation } = require('../models');
const { CustomException } = require('../utils');

const createConversation = async (request, response) => {
  const { to, from } = request.body;

  try {
    const sellerID = request.isSeller ? request.userID : to;
    const buyerID = request.isSeller ? from : request.userID;

    const existingConversation = await Conversation.findOne({
      sellerID,
      buyerID
    });
    

    if (existingConversation) {
      return response.send(existingConversation);
    }

    // Create new conversation
    const conversation = new Conversation({
      sellerID,
      buyerID,
      readBySeller: request.isSeller,
      readByBuyer: !request.isSeller,
    });

    await conversation.save();
    return response.status(201).send(conversation);
  } catch ({ message, status = 500 }) {
    return response.status(status).send({
      error: true,
      message,
    });
  }
};

const getConversations = async (request, response) => {
  try {
    const filter = request.isSeller
      ? { sellerID: request.userID }
      : { buyerID: request.userID };

    const conversations = await Conversation.find(filter)
      .populate(request.isSeller ? 'buyerID' : 'sellerID', 'username image email')
      .sort({ updatedAt: -1 });

    return response.send(conversations);
  } catch ({ message, status = 500 }) {
    return response.status(status).send({
      error: true,
      message,
    });
  }
};

const getSingleConversation = async (request, response) => {
  const { sellerID, buyerID } = request.params;
  try {
    const conversations = await Conversation.find(filter)
  .populate('buyerID', 'username image email')
  .populate('sellerID', 'username image email')
  .sort({ updatedAt: -1 });

    if (!conversation) {
      throw CustomException('No such conversation found!', 404);
    }
    return response.send(conversation);
  } catch ({ message, status = 500 }) {
    return response.status(status).send({
      error: true,
      message,
    });
  }
};

const updateConversation = async (request, response) => {
  const { conversationID } = request.params;

  try {
    const updateFields = request.isSeller
      ? { readBySeller: true }
      : { readByBuyer: true };

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationID },
      { $set: updateFields },
      { new: true }
    );

    return response.send(conversation);
  } catch ({ message, status = 500 }) {
    return response.status(status).send({
      error: true,
      message,
    });
  }
};



module.exports = {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
};
