const router = require("express").Router();

const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
} = require("../controller/userControllers");

const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getUserPosts,
  likeDislikePost,
  getFollowing,
  getUserBookmarks,
  createBookmark,
} = require("../controller/postControllers");

const {
  createComment,
  getCommentsOfPost,
  deleteComment,
} = require("../controller/commentControllers");

const {
  createMessage,
  getMessagesOfConversation,
} = require("../controller/messagecontrollers");    

const authMiddleware = require("../middleware/authMiddleware");

// ============================ USER ROUTES ============================
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:id", authMiddleware, getUser);
router.get("/users", authMiddleware, getUsers);
router.patch("/users/:id", authMiddleware, editUser);
router.patch("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.post("/users/avatar", authMiddleware, changeUserAvatar);
router.get("/users/:id/posts", authMiddleware, getUserPosts);
router.get("/users/bookmarks", authMiddleware, getUserBookmarks);

// ============================ POST ROUTES ============================
router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getPosts);
router.get("/posts/following", authMiddleware, getFollowing);
router.get("/posts/:id", authMiddleware, getPost);
router.patch("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.patch("/posts/:id/like", authMiddleware, likeDislikePost);
router.post("/posts/:id/bookmark", authMiddleware, createBookmark);

// ============================ COMMENT ROUTES ============================
router.post("/comments/:id", authMiddleware, createComment);
router.get("/comments/:id", authMiddleware, getCommentsOfPost);
router.delete("/comments/:id", authMiddleware, deleteComment);

// ============================ MESSAGE ROUTES ============================

router.post("/messages", authMiddleware, createMessage);
router.get("/messages/:conversationId", authMiddleware, getMessagesOfConversation); 


module.exports = router;
