const Histories = require("../../../models/histories");
const Students = require("../../../models/students");
const { check, validationResult } = require("express-validator");
const Mentors = require("../../../models/mentors");
const Courses = require("../../../models/courses");
const Videos = require("../../../models/videos");
const Events = require("../../../models/events");
const Questions = require("../../../models/questions");
const Answers = require("../../../models/answers");
const Employees = require("../../../models/employees");
const Registrations = require("../../../models/registrations");


/* Fetch all home page's details */
module.exports.fetchHomeDetails = async (req, res, next) => {
    try {
        const studentsCount = await Students.countDocuments()
        const mentorsCount = await Mentors.countDocuments()
        const coursesCount = await Courses.countDocuments()
        const videosCount = await Videos.countDocuments()
        const eventsCount = await Events.countDocuments()
        const questionsCount = await Questions.countDocuments()
        const answersCount = await Answers.countDocuments()
        const employeesCount = await Employees.countDocuments()
        const registrationsCount = await Registrations.countDocuments()

        res.status(200).send({
            success: true,
            counts: {
                studentsCount: studentsCount,
                mentorsCount: mentorsCount,
                coursesCount: coursesCount,
                videosCount: videosCount,
                eventsCount: eventsCount,
                questionsCount: questionsCount,
                answersCount: answersCount,
                employeesCount: employeesCount,
                registrationsCount: registrationsCount
            },
        });
    } catch (error) {
        console.log(error);
        res.status(501).send({
            success: false,
            error: "Internal Server Error!"
        });
    }
}