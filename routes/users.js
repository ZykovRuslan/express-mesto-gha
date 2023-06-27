const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserById,
  updateAvatarById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateAvatarById);

module.exports = router;
