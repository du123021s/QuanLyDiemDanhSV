document.addEventListener('DOMContentLoaded', () => {
      const docCheckboxes = document.querySelectorAll(".choose-checkbox");
      const statisticalBtn = document.querySelector("#generateReportBtn");
      const statisticsTable = document.getElementById("statistical-form");
      const tableBody = document.getElementById('statistical-table-body');
      const manageUserLayout = document.querySelector(".manage-user-layout");
      const closeFm = document.querySelector("#closeForm-tb");
      const absentceType = document.getElementById("attendanceType");
      const absenceInputRoot = document.getElementById("absentInputRoot");
      const absenceInput = document.getElementById("numberOfAbsences");
      const absentCol = document.getElementById("absentCol");
      let docId;

      absentceType.addEventListener("change", () => {
            if (absentceType.value === 'absence') {
                  absenceInputRoot.style.display = "block";
                  statisticalBtn.style.marginTop = "10px";
                  statisticalBtn.style.marginLeft = "0px";
            } else {
                  absenceInputRoot.style.display = "none";
                  statisticalBtn.style.marginTop = "-4px";
                  statisticalBtn.style.marginLeft = "15px";
            }
      })
      closeFm.addEventListener("click", () => {
            if (manageUserLayout) { manageUserLayout.classList.remove("statistics-expand"); }
            statisticsTable.style.display = "none";
      });

      docCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", () => {
                  console.log("co sk nay");
                  docCheckboxes.forEach((otherCheckbox) => {
                        if (otherCheckbox !== checkbox) {
                              otherCheckbox.checked = false;
                        }
                  });
                  if (checkbox.checked) {
                        docId = checkbox.value;
                        console.log("value: ", docId);
                  }
            });
      });

      statisticalBtn.addEventListener('click', async () => {
            console.log("valueee: ", docId);
            const numberOfAbsence = absenceInput.value;
            const selectedOption = absentceType.value;
            if (numberOfAbsence < 1) {
                  showMessageAlert("The number of absent students must be greater than 0!", "red");
                  return;
            }

            if (!docId) {
                  showMessageAlert("You haven't chosen a subject yet!", "red");
                  return;
            }

            console.log("number: ", numberOfAbsence);
            if (selectedOption === 'absence') {
                  try {
                        const response = await fetch(`/statistical/details?attendanceType=${selectedOption}&docId=${docId}&numberOfAbsence=${numberOfAbsence}`);
                        const data = await response.json();
                        const students = data.absentStudents;
                        console.log("data", data);
                        if (data.success === true) {
                              showResultTable(students, data.totalAtten);
                              // Show the statistical form
                              if (manageUserLayout) { manageUserLayout.classList.add("statistics-expand"); }
                              statisticsTable.style.display = "block";
                              showMessageAlert(data.message, "green");
                        } else {
                              showMessageAlert(data.message, "red");
                        }

                  } catch (error) {
                        console.error('Error fetching statistical data:', error);
                  }

            } else if (selectedOption === 'percentage25') {

                  try {
                        const response = await fetch(`/statistical/percentage25?docId=${docId}`);
                        const data = await response.json();
                        const students = data.list;
                        console.log("data", data);
                        if (data.success === true) {
                              showResultTablePer(students);
                              // Show the statistical form
                              if (manageUserLayout) { manageUserLayout.classList.add("statistics-expand"); }
                              statisticsTable.style.display = "block";
                              showMessageAlert(data.message, "green");
                        } else {
                              showMessageAlert(data.message, "red");
                        }

                  } catch (error) {
                        console.error('Error fetching statistical data:', error);
                  }
            }

      });

      function showResultTablePer(students) {
            // Clear previous content
            tableBody.innerHTML = '';
            absentCol.textContent = "Attendance Rate";
            // Populate the table with data
            students.forEach(item => {
                  const row = document.createElement('tr');
                  ['Roll Number', 'Portal ID', 'Name', 'AbsenceRate'].forEach(key => {
                        const cell = document.createElement('td');
                        cell.textContent = item[key];
                        row.appendChild(cell);
                  });
                  tableBody.appendChild(row);
            });

      }

      function showResultTable(students, totalAtten) {
            // Clear previous content
            tableBody.innerHTML = '';
            absentCol.textContent = "Number Of Absent Sessions";
            // Populate the table with data
            students.forEach(item => {
                  // Calculate the difference between 'AbsencesCount' and 'totalAtten'
                  const absencesCount = totalAtten - item['SessionOfNumbers'];

                  const row = document.createElement('tr');
                  ['Roll Number', 'Portal ID', 'Name', 'AbsencesCount'].forEach(key => {
                        const cell = document.createElement('td');

                        // Set the content based on the key
                        if (key === 'AbsencesCount') {
                              cell.textContent = absencesCount;
                        } else {
                              cell.textContent = item[key];
                        }

                        row.appendChild(cell);
                  });

                  tableBody.appendChild(row);
            });
      }

      // Hiển thị thông báo thành công
      function showMessageAlert(message, color) {
            const successAlert = document.getElementById('success-alert');
            successAlert.textContent = message;
            successAlert.style.backgroundColor = color; // Thay đổi màu sắc thành đỏ
            successAlert.style.display = 'block';

            // Tự động ẩn thông báo sau 3 giây
            setTimeout(() => {
                  successAlert.style.display = 'none';
            }, 5000);
      }
})