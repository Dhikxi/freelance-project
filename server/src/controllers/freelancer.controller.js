const User = require("../models/user.model");

exports.getFreelancerById = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select("-password");
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.status(200).json(freelancer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
