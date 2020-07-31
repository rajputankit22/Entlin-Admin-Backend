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
        const studentsCount = await Students.count()
        const mentorsCount = await Mentors.count()
        const coursesCount = await Courses.count()
        const videosCount = await Videos.count()
        const eventsCount = await Events.count()
        const questionsCount = await Questions.count()
        const answersCount = await Answers.count()
        const employeesCount = await Employees.count()
        const registrationsCount = await Registrations.count()

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