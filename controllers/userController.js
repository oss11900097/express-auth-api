//the manager - it checks if id in url matches the id in jwt - are they authorized to edit their email.
const userService = require('../services/userServices');

exports.getAll = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        //req.user from middleware is user here, the decoded jwt is used here.
        res.status(200).json({ total_registrated: users.length, users, currentUserId: req.user.id});
    } catch (error) {
        res.status(500).json({ error: 'Failed to Fetch users', details: error.message});
    }
};

exports.getProfile = async (req, res) => {
    try {
        //fetch the user using the ID stored n their jwt token
        const user = await userService.getUserById(req.user.id)
        res.status(200).json({user});
    } catch (error) {
        res.status(404).json({ error: error.message});
    }
};

exports.update = async (req, res) => {
    try{
        const targetId = parseInt(req.params.id, 10);
    //SECURITY: ensure the user updates their own profile/ req.user from middleware
        if(targetId !==req.user.id) {
          return res.status(403).json({error: 'Forbidden: you can only update your own profile '});
        }
        const updatedUser = await userService.updateUser(targetId, req.body);
        res.status(200).json({ message: 'Updated Successfully!', user: updatedUser});
    } catch (error) {
        res.status(500).json({ error: 'Update Failed', details: error.message});
    }   
};

exports.remove = async (req, res) => {
    try {
        const targetId = parseInt(req.params.id, 10);
        //security: ensure the user deleting is deleting their own profile only
        if(targetId !== req.user.id) {
            return res.status(403).json({error: 'Forbidden: you can only delete your own profile'})
        }
        await userService.deleteUser(targetId);
        res.status(200).json({message: 'Deleted successfully!'});
    } catch (error) {
        res.status(500).json({ error: 'Delete Failed', details: error.message});
    }
};