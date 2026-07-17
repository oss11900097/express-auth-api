
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/authMiddleware');

//apply the authMiddle ware to ALL routes in this file
router.use(requireAuth);

//map the routes
router.get('/', userController.getAll); // GET /api/users
router.get('/profile', userController.getProfile); //GET /api/profile
router.put('/update/:id', userController.update); // PUT /api/users/update/id
router.delete('/delete/:id', userController.remove); // DELETE /api/users/delete/id

module.exports = router