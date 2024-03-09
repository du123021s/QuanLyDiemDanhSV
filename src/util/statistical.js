export function countAttendanceForClass(students) {
      const maxAttendance = {};
      const studentList = students.students;
      for (const studentId in studentList) {
            // console.log("da vao for 1", studentId);
            if (Object.hasOwnProperty.call(studentList, studentId)) {
                  const student = studentList[studentId];
                  let maxTL = 0;
                  console.log("STUDENT: ", student);
                  for (const key in student) {
                        // console.log("key ", key.includes('TL'));
                        // console.log("keyyyy ", key);
                        if (Object.hasOwnProperty.call(student, key) && key.includes('T')) {
                              if (student[key] === 'x') {
                                    const currentTL = parseInt(key.slice(2));
                                    maxTL = Math.max(maxTL, currentTL);
                                    // console.log("có ");
                              }
                        }
                  }
                  maxAttendance[studentId] = maxTL;
            }
      }

      console.log("ds buoi: ", maxAttendance);
      const maxTL = Math.max(...Object.values(maxAttendance));

      return maxTL;
}

export function absentStudentList(students, totalAttendance, numberOfAbsence) {
      const excessiveAbsencesList = [];
      const maxTL = totalAttendance;
      // Duyệt qua danh sách sinh viên
      const studentList = students.students;
      for (const studentId in studentList) {
            if (Object.hasOwnProperty.call(studentList, studentId)) {
                  const student = studentList[studentId];

                  // Tìm TL đầu tiên và TL cuối cùng có đánh dấu 'x'
                  const attendedTLs = Object.keys(student).filter(key => key.startsWith('T') && student[key] === 'x');
                  const lastAttendedTL = attendedTLs.length > 0 ? Math.max(...attendedTLs.map(tl => parseInt(tl.slice(2)))) : 0;

                  // Kiểm tra nếu sinh viên có T01 or TL1 từ đầu đến T.. or TL.. có chỉ số = tổng số buổi
                  if (lastAttendedTL <= maxTL && attendedTLs.length < maxTL - numberOfAbsence) {
                        const sessionOfNumbers = attendedTLs.length;
                        // console.log("vang: ", sessionOfNumbers);
                        if (sessionOfNumbers > numberOfAbsence) {
                              // Lưu tổng số buổi điểm danh của sinh viên
                              student.SessionOfNumbers = sessionOfNumbers;   // số buổi sinh viên có điểm danh
                              // Nếu số buổi vắng lớn hơn numberOfAbsence, thêm sinh viên vào danh sách vắng quá numberOfAbsence buổi
                              excessiveAbsencesList.push(student);
                        }
                  }
            }
      }
      return excessiveAbsencesList;
}

export function getStudentsWithHighAbsence(students, totalClasses) {
      const threshold = 0.75; // 25%

      const highAbsenceList = [];

      for (const studentId in students) {
            if (Object.hasOwnProperty.call(students, studentId)) {
                  const student = students[studentId];

                  if (!student['Roll Number'].startsWith('A')) {
                        continue;
                  }
                  // Đếm số buổi có đánh dấu x
                  const attendedClasses = Object.keys(student).filter(key => key.startsWith('T') && student[key] === 'x').length;

                  // Tính tỷ lệ vắng
                  const absenceRate = attendedClasses / totalClasses;
                  console.log("rate: ", absenceRate);

                  // Kiểm tra xem tỷ lệ vắng có lớn hơn 25% không
                  if (absenceRate <= threshold) {
                        // Ghi nhận thông tin sinh viên
                        const studentInfo = {
                              'Roll Number': student['Roll Number'],
                              'Portal ID': student['Portal ID'],
                              Name: student.Name,
                              AbsenceRate: (absenceRate * 100).toFixed(2) + '%',
                        };

                        // Thêm vào danh sách sinh viên vắng quá 25%
                        highAbsenceList.push(studentInfo);
                  }
            }
      }

      return highAbsenceList;
}

