import AttendanceModel from "../model/AttendanceModel.js";
import { countAttendanceForClass, absentStudentList, getStudentsWithHighAbsence } from "../../util/statistical.js";

class StatisticalController {
      show(req, res) {
            const userId = req.session.userId;
            const role = req.session.role;
            if (role === 'Teacher') {
                  AttendanceModel.find({ permission: { $in: [userId] } })
                        .select('course').lean()
                        .then(data => {
                              res.render('statistical', {
                                    attendanceNavbar: true,
                                    headerLogin: false,
                                    footerLogin: false,
                                    permissions: req.session.permissions,
                                    documents: data
                              });
                        })
                        .catch((error) => {
                              console.error("Error get data:", error);
                        });
            } else {
                  AttendanceModel.find()
                        .select('course').lean()
                        .then(data => {
                              res.render('statistical', {
                                    attendanceNavbar: true,
                                    headerLogin: false,
                                    footerLogin: false,
                                    permissions: req.session.permissions,
                                    documents: data
                              });
                        })
                        .catch((error) => {
                              console.error("Error get data:", error);
                        });
            }

      }

      async absentMoreThanNumber(req, res) {
            const numberOfAbsence = req.query.numberOfAbsence;
            const docId = req.query.docId;
            let msg = "Statistics of students absent more than " + numberOfAbsence + " classes.";

            const students = await AttendanceModel.findOne({ _id: docId }).select('students').lean();

            // console.log('=== DANH SAH SINH VIEN ===\n', students);
            const countAllAttendance = countAttendanceForClass(students);
            console.log('Tong buoi: ', countAllAttendance);

            if (countAllAttendance > numberOfAbsence) {
                  const absentStudents = absentStudentList(students, countAllAttendance, numberOfAbsence);
                  // console.log("DS SV > " + numberOfAbsence, absentStudents);
                  if (absentStudents.length == 0) {
                        msg = "No student missed more than " + numberOfAbsence + " sessions!";
                  }
                  res.json({
                        success: true,
                        message: msg,
                        absentStudents,
                        totalAtten: countAllAttendance
                  });
            } else {
                  res.json({
                        success: false,
                        message: 'No absent student found <= ' + numberOfAbsence,
                  });
            }
      }


      async absentMoreThanPer25(req, res) {
            let msg = "Success";
            const docId = req.query.docId;
            const students = await AttendanceModel.findOne({ _id: docId }).select('students').lean();

            // console.log('=== DANH SAH SINH VIEN ===\n', students);
            const countAllAttendance = countAttendanceForClass(students);
            console.log('Tong buoi: ', countAllAttendance);

            const studentList = students.students;
            const list = getStudentsWithHighAbsence(studentList, countAllAttendance);
            console.log("list: ", list);

            if (list.length == 0) {
                  msg = "No absent students >= 25%.";
            }

            res.json({
                  success: true,
                  message: msg,
                  list,
            });

      }
}

export default new StatisticalController;
