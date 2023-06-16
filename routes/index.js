const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.all('*', (req, res) => {
  res.status(404).send('Неверный путь');
});
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
