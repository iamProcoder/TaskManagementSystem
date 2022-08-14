const express = require('express');

//routers
const user = require('../routes/user.routes');
const task = require('../routes/task.routes');

// /api
const router = express.Router();

router.use("/users", user);
router.use("/task", task);

module.exports = router;