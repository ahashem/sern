const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		username: {
			type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      caseSensitive: false,
		},
    email: {
      type: 'citext',
      allowNull: false,
      unique: true,
      caseSensitive: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		roles: {
			type: DataTypes.ARRAY,
      defaultValue: ['user'],
		}
	});

	// Create user relations and associate with other models
  // example
	/*User.associate = (models) => {
		User.hasMany(models.Order, {
			as: 'orders',
			foreignKey: 'userId',
		})
	};*/

	// User methods. TODO: move to methods folder?
	User.generateHash = (password) => {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};
	User.validPassword = (user, password) => {
		return bcrypt.compareSync(password, user.password);
	};
	return User
}
