const redis = require('../redis/redisConfig');
const Boom = require('@hapi/boom');
const { addHistory, getHistory } = require('../helpers/historyHelper');
const model = require("../models");

const Task = model.task;
const User = model.user;

const create = async (req, res) => {
  try {
      if (!req.body) {
        res.json(Boom.badRequest("Content can not be empty!"));
        return;
      }

      const { name, userId } = req.body;
      const task = await Task.create({ name, userId });
      await redis.del('task-list');
      let taskJson = JSON.parse(JSON.stringify(task));
      const user = await User.findOne({ where: {id: taskJson.userId}})
      taskMessage = `Task named [${taskJson.name}] is assigned to person [${user.name}], Status is set to [${taskJson.status}]`

      await addHistory(task.id, taskMessage);
      return res.status(201).json({message: 'Success', task});

  } catch (error) {
    return res.json(Boom.badRequest(`Task Create failed..! >> ${error}`));
  }
};

const getAll = async (req, res) => {
  try {
    let tasks = [];
    let redis_tasks = await redis.get('task-list');
    if (!redis_tasks) {
      const TaskList = await Task.findAll({ include: ["user"] });
      let taskObject = {};
      for await (const t of TaskList) {
        const hst = await getHistory(t.id);
  
        if (hst.length > 0) taskObject = { taskName: t.name, userName: t.user.name, taskHistory: hst.map(h => h.message) };
        else taskObject = { taskName: t.name, userName: t.user.name, taskHistory: [] };
  
        tasks.push(taskObject);
      }
      await redis.set('task-list', JSON.stringify(tasks));
    }
    else tasks = JSON.parse(redis_tasks)
    return res.status(200).json({ message: "Success", tasks });
  } catch (error) {
    return res.json(Boom.badRequest(`Task Get List failed..! >> ${error}`));
  }
};

const getTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({where: { id }, include: ["user"]});
    if (!task) return next(Boom.notFound('Task Not Found'));
    
    return res.status(200).json({ message: "Success", task });
  } catch (error) {
    return res.json(Boom.badRequest(`Task Get failed..! >> ${error}`));
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id; 
    const result = await Task.update(req.body, { where: { id } });
    
    if (result[0] === 1) { 
      await redis.del('task-list');
      const task = await Task.findOne({where: { id }, include: ["user"]});
      let taskJson = JSON.parse(JSON.stringify(task));
      taskMessage = `Task named [${taskJson.name}] is assigned to person [${taskJson.user.name}], Status changed to [${taskJson.status}]`;
      await addHistory(id, taskMessage);
      return res.status(200).json({message: "Task was updated successfully" })
    }
    else return res.json(Boom.badRequest('Task was updated failed'));
  } catch (error) {
    return res.json(Boom.badRequest(`Task Update failed..! >> ${error}`));
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {userId} = req.body;
    const {user} = req.activeUser;
  
    if (userId != user.id){
      return res.json(Boom.unauthorized('this task does not belong to you'));
    }
  
    const deleteTask = await Task.destroy({where: { id } });
    if (deleteTask === 1){ 
      return res.status(200).json({message: "Task was deleted"})}
      else return res.status(Boom.badRequest()).json({message: "Task was deleted failed"})
  } catch (error) {
    return res.json(Boom.badRequest(`Task Delete failed..! >> ${error}`));
  }
};

module.exports = {
  create,
  getAll,
  getTask,
  updateTask,
  deleteTask
}

