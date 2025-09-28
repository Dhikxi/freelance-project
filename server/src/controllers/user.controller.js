const User = require('../models/user.model.js');
const CustomException = require('../utils/customException.js'); // ✅ match casing and use CommonJS

// GET all freelancers
const getAllUsers = async (req, res) => {
  try {
    const freelancers = await User.find({ isSeller: true }).select('-password');
    return res.send(freelancers);
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: "Failed to fetch freelancers",
    });
  }
};

// GET single freelancer
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).send({ error: true, message: "Freelancer not found" });
    }
    return res.send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: true, message: "Error fetching freelancer" });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await User.findById(_id);

    if (req.userID === user._id.toString()) {
      await User.deleteOne({ _id });
      return res.send({
        error: false,
        message: 'Account successfully deleted!',
      });
    }

    throw new CustomException('Invalid request! Cannot delete other user accounts.', 403);
  } catch (err) {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    return res.status(status).send({
      error: true,
      message,
    });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  deleteUser,
};
