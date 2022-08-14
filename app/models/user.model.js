const bcrypt = require("bcryptjs");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    name: {
      type: Sequelize.STRING,
      required: [true, "Please provide a name"],
    },
    email: {
      type: Sequelize.STRING,
      required: [true, "Please provide a email"],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: Sequelize.STRING,
      require: [true, "Please provide a password"]
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Date.now,
    }
  }, {
    freezeTableName: true,
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
      }    
    }
  });

  User.prototype.validPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };

  return User;
};
