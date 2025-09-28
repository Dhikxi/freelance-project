const express = require("express");
const { getUser } = require("../controllers/user.controller");
const User = require("../models/user.model"); // ⬅️ Also needed for the freelancers route

const router = express.Router();

// ✅ Add specific route BEFORE the dynamic :id route
router.get("/freelancers", async (req, res) => {
  try {
    const freelancers = await User.find({ isSeller: true });

    res.status(200).json(freelancers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch freelancers" });
  }
});

// ✅ Now this won't interfere with "/freelancers"
router.get("/:id", getUser);

module.exports = router;

