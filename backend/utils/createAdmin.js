/** @format */

const User = require("../models/User");

const createDefaultAdmin = async () => {
	try {
		// Check if admin already exists
		const adminExists = await User.findOne({
			username: "admindbu12",
		});

		if (!adminExists) {
			const admin = await User.create({
				name: "System Administrator",
				username: "admindbu12",
				password: "Admin123#",
				role: "admin",
				isAdmin: true,
				department: "Administration",
				year: "Staff",
			});

			console.log("Default admin user created:", admin.username);
		}



		// Create some sample students for testing
		const sampleStudents = [
			{
				name: "John Doe",
				username: "dbu10304058",
				password: "Student123#",
				role: "student",
				isAdmin: false,
				department: "Computer Science",
				year: "4th Year",
			},
			{
				name: "Jane Smith",
				username: "dbu10304059",
				password: "Student123#",
				role: "student",
				isAdmin: false,
				department: "Engineering",
				year: "3rd Year",
			},
		];

		for (const studentData of sampleStudents) {
			const existingStudent = await User.findOne({ username: studentData.username });
			if (!existingStudent) {
				await User.create(studentData);
				console.log(`Sample student created: ${studentData.username}`);
			}
		}
	} catch (error) {
		console.error("Error creating default users:", error);
	}
};

module.exports = { createDefaultAdmin };
