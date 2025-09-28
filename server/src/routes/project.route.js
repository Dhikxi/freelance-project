const express = require('express');
const {
  createProject,
  getMyProjects,
  getProjectById,
  getProjectsByFreelancerId
} = require('../controllers/project.controller');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// POST /api/projects
router.post('/', authenticate, createProject);

// GET /api/projects/my
router.get('/my', authenticate, getMyProjects);

// ✅ GET /api/projects/freelancer/:id - For dropdown in ProjectPopup.jsx
router.get('/freelancer/:id', getProjectsByFreelancerId);

// ✅ GET /api/projects/:id - Optional, useful for detail view
router.get('/:id', authenticate, getProjectById);

module.exports = router;
