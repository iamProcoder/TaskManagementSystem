const Boom = require('@hapi/boom');
const History = require('../models/history.model');

const addHistory = async (taskId, message) => {
    try {
        console.log('addhistory', {taskId, message})
        const history = History.create({taskId, message});
        return history;
    } catch (e) {
        return new Error(Boom.notFound(`history helper -- addHistory >>  ${e}`));
    }
}

const getHistory = async (taskId) => {
    try {
        const histories = History.find({taskId});
        return histories;
    } catch (e) {
        return new Error(Boom.notFound(`history helper -- getHistory >>  ${e}`));
    }
}

module.exports = { addHistory, getHistory };