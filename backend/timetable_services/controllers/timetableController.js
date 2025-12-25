import axios from "axios";
import mongoose from "mongoose";

export const getStudentTimetable = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Incoming request for student:", studentId);
    console.log("Enrollment Service URL:", process.env.ENROLLMENT_SERVICE_URL);
    console.log("Schedule Service URL:", process.env.SCHEDULE_SERVICE_URL);

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId" });
    }

    // 1️. Get all courses student is enrolled in
    const enrollUrl = `${process.env.ENROLLMENT_SERVICE_URL}/api/enrollments/student/${studentId}`;
    console.log("Fetching enrollments from:", enrollUrl);

    const enrollRes = await axios.get(enrollUrl, {
      headers: { Authorization: req.headers.authorization }
    });
    console.log("Enrollments fetched:", enrollRes.data);

    const enrollments = enrollRes.data;
    if (!enrollments.length) return res.status(404).json({ message: "No courses found for this student" });

    const courseIds = enrollments.map(e => e.courseId);
    console.log("Courses found:", courseIds);

    // 2️. Get schedule for each course
    const schedulePromises = courseIds.map(async (courseId) => {
      const scheduleUrl = `${process.env.SCHEDULE_SERVICE_URL}/api/schedules/course/${courseId}`;
      console.log("Fetching schedule from:", scheduleUrl);
      const r = await axios.get(scheduleUrl, {
        headers: { Authorization: req.headers.authorization }
      });
      return r.data;
    });

    const schedulesRes = await Promise.all(schedulePromises);
    const schedules = schedulesRes.flat();

    // 3️. Sort by date
    schedules.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ studentId, timetable: schedules });
  } catch (err) {
    console.error("Get Timetable Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



