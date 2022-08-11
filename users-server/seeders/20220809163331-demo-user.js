'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {

		await queryInterface.bulkInsert(
			"users",
			[
				{
					login: "happy-mama",
					password: "A*S(Fnafy8csd8h",
					email: "someemail@gmail.com",
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					login: "unhappy-mama",
					password: "ASFYb98yhaf9&*y9fash",
					email: "yetanotheremail@mail.ru",
					createdAt: new Date(),
					updatedAt: new Date()
				}
			]
		);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
