const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.all('*', (req, res) => {
  res.status(404).send('Неверный путь');
});

module.exports = router;
