const Project = require('../models/project.model');
const { CustomException } = require('../utils');

// POST /projects - Create new project
const createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, freelancerId, gigID } = req.body;

    const payload = {
      title,
      description,
      budget,
      deadline,
      buyerID: req.userID,
      freelancerID: freelancerId,
    };

    // ✅ Only add gigID if it exists and is not an empty string
    if (gigID && gigID.trim() !== "") {
      payload.gigID = gigID;
    }

    const newProject = new Project(payload);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Project creation error:", error.message);
    res.status(500).json({ error: "Failed to create project" });
  }
};



// GET /projects/my-projects - Get projects created by logged-in buyer
const getMyProjects = async (req, res) => {
  try {
    const myProjects = await Project.find({ buyerID: req.userID })
      .populate('freelancerID', 'username email image')
      .populate('gigID', 'title');

    res.status(200).json(myProjects);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch projects' });
  }
};

// GET /projects/freelancer/:id - Get projects created by freelancer
const getProjectsByFreelancerId = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerID: req.params.id })
      .select('_id title budget');

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch freelancer projects' });
  }
};

// GET /projects/:id - Get a single project with freelancer and gig details
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('freelancerID', 'username email image')
      .populate('gigID', 'title');

    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    res.status(200).json({
      ...project.toObject(),
      freelancerName: project.freelancerID?.username || 'Unknown',
      gigTitle: project.gigID?.title || 'Not specified',
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch project details' });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  getProjectsByFreelancerId, // Added new function
};
