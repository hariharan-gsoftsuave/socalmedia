const router = require("express").Router()

const {registerUser,loginUser,getUser,getUsers,editUser,followUnfollowUser,changeUserAvatar} = require('../controller/userControllers');
const authMiddelware = require("../middleware/authMiddleware");

//USER ROUTER
router.post('/users/register',registerUser)
router.post('/users/login',loginUser)
router.get('/users/:id',authMiddelware,getUser)
router.get('/users',authMiddelware,getUsers)
router.patch('/users/:id',authMiddelware,editUser)
router.patch('/users/:id/follow-unfollow',authMiddelware,followUnfollowUser)
router.post('/users/avatar',authMiddelware,changeUserAvatar)

module.exports = router;



