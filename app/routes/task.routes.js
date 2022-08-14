const express = require('express');
const router = express.Router();

//middlewares - jwt check
const { verifyToken } = require('../helpers/jwt');

//auth controller
const { create, getAll, getTask, updateTask, deleteTask } = require('../controllers/task.controller');

router.get('/getAll', verifyToken, getAll);
router.get('/get/:id', verifyToken, getTask);
router.post('/create', verifyToken, create);
router.put('/update/:id', verifyToken, updateTask);
router.delete('/delete/:id', verifyToken, deleteTask);

module.exports = router;