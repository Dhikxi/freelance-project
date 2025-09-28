const express = require("express");
const router = express.Router();
const { getFreelancerById } = require("../controllers/freelancer.controller");

router.get("/:id", getFreelancerById);

module.exports = router;
