const bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task", {
    name: {
      type: Sequelize.STRING,
      required: [true, "Please provide a name"],
    },
    status: {
      type: Sequelize.STRING,
      require: true
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Date.now,
    }
  }, {
    freezeTableName: true,
    hooks: {
      beforeCreate: (task) => {
        task.status = "Pending";
      }    
    }
  });

  return Task;
};
