document.addEventListener("DOMContentLoaded", () => {
      const addUsers = document.getElementById("addUsers");
      const updateUsrBtn = document.getElementById("updateUsers");
      const updateUsrFmBtn = document.getElementById("updateUsrFmBtn");
      const addUrsform = document.querySelector(".manageForm");
      const updateUsrform = document.querySelector(".update-Usr-Fm");
      const closeAddUsrFm = document.getElementById("closeForm");
      const closeUpdateUsrFm = document.getElementById("closeUpdateUsrForm");
      const submitUsersForm = document.getElementById("submitUsersForm");
      const manageUserLayout = document.querySelector(".manage-user-layout");

      const roleCheckboxes = document.querySelectorAll('input.form-check-input[type="checkbox"]');
      const permissionCheckboxes = document.querySelectorAll('input.custom-control-input[type="checkbox"]');
      const pmsUpdateFm = document.querySelectorAll(".pms-chbs");
      const table = document.querySelector(".table-group-divider");
      const deleteUserBtns = document.querySelectorAll(".delete-users-link");
      const userSearchFm = document.querySelector(".user-search");
      const usrInput = document.querySelector("#usr-searchInput");
      const usrChbxs = document.querySelectorAll("#usr-chboxes");
      const roleChbxs = document.querySelectorAll(".role-updateFm");

      let roleValue;
      let permissionValue = [];
      let updateCheckValue;
      let pmsUpdateChbValue = [];

      updateSTTValues();

      roleCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", () => {
                  roleCheckboxes.forEach((otherCheckbox) => {
                        if (otherCheckbox !== checkbox) {
                              otherCheckbox.checked = false;
                        }
                  });
                  if (checkbox.checked) {
                        roleValue = checkbox.value;
                  }
            })
      });

      permissionCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                  if (checkbox.checked) {
                        const value = checkbox.value;
                        permissionValue.push(value);
                  }
            })
      });

      usrChbxs.forEach((checkbox) => {
            checkbox.addEventListener("click", () => {
                  usrChbxs.forEach((otherCheckbox) => {
                        if (otherCheckbox !== checkbox) {
                              otherCheckbox.checked = false;
                        }
                  });
                  if (checkbox.checked) {
                        updateCheckValue = checkbox.value;
                  }
            });
      });

      roleChbxs.forEach((checkbox) => {
            checkbox.addEventListener("click", () => {
                  roleChbxs.forEach((otherCheckbox) => {
                        if (otherCheckbox !== checkbox) {
                              otherCheckbox.checked = false;
                        }
                  });
            });
      });

      // ================================================
      addUsers.addEventListener("click", () => {
            console.log("CLICK NHA");
            if (manageUserLayout) { manageUserLayout.classList.add("manage-user-expand"); }
            addUrsform.style.display = "block";
      });

      closeAddUsrFm.addEventListener("click", () => {
            if (manageUserLayout) { manageUserLayout.classList.remove("manage-user-expand"); }
            addUrsform.style.display = "none";
      });

      // ============= Update User ===================================
      updateUsrBtn.addEventListener('click', async () => {
            if (!updateCheckValue) {
                  showMessageAlert("Please select the user you want to update!", "red");
            }
            const data = await requestGetInforUser(updateCheckValue);
            populateForm(data);
            if (manageUserLayout) { manageUserLayout.classList.add("manage-user-expand"); }
            updateUsrform.style.display = "block";
      });

      updateUsrFmBtn.addEventListener('click', () => {
            // Lấy giá trị của các ô checkbox có class "role-updateFm"
            const selectedRoles = Array.from(document.querySelectorAll('.role-updateFm:checked'))
                  .map(checkbox => checkbox.value);

            // Lấy giá trị của các ô checkbox có class "pms-chbs"
            const selectedPermissions = Array.from(document.querySelectorAll('.pms-chbs:checked'))
                  .map(checkbox => checkbox.value);

            console.log("UPDATE FORM");
            const role = selectedRoles[0];
            const id = document.getElementById("submitUsersForm").value;
            const userID = document.getElementById('update-userID').value;
            const username = document.getElementById('update-username').value;
            const email = document.getElementById('update-email').value;
            const userData = {
                  id,
                  userID,
                  username,
                  email,
                  role,
                  selectedPermissions,
            };


            requestUpdateUser(userData);
            // clearForm();
      })

      closeUpdateUsrFm.addEventListener("click", () => {
            if (manageUserLayout) { manageUserLayout.classList.remove("manage-user-expand"); }
            updateUsrform.style.display = "none";
            clearForm();
      });

      // ================================================
      submitUsersForm.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("Tao user moi");
            // Xử lý logic tạo người dùng và thêm người dùng và thêm người dùng vào table
            const userID = document.getElementById("userID").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const email = document.getElementById("email").value;
            const roleCheckbox = document.querySelectorAll('input[name="role"]:checked');
            const permissionCheckbox = document.querySelectorAll('input[name="permission"]:checked');


            // Kiểm tra và xử lý ô trống
            if (!userID.trim()) {
                  showMessageAlert("Please enter ID!", "red");
                  console.log("user: ", userID.value);
                  document.getElementById("userID").focus();
            } else if (!username.trim()) {
                  showMessageAlert("Please enter username!", "red");
                  document.getElementById("username").focus();
            } else if (!password.trim()) {
                  showMessageAlert("Please enter password!", "red");
                  document.getElementById("password").focus();
            } else if (!email.trim()) {
                  showMessageAlert("Please enter email!", "red");
                  document.getElementById("email").focus();
            } else if (!isValidEmail(email)) {
                  showMessageAlert("Please enter a valid email address!", "red");
                  document.getElementById("email").focus();
            } else if (roleCheckbox.length === 0) {
                  showMessageAlert("Please select at least one role!", "red");
            } else if (permissionCheckbox.length === 0) {
                  showMessageAlert("Please select at least one permission!", "red");
            } else {
                  const formData = {
                        userID,
                        username,
                        password,
                        email,
                        roleValue,
                        permissionValue,
                  };
                  requestCreateNewUser(formData);
            }
      });

      deleteUserBtns.forEach(deleteUser => {
            deleteUser.addEventListener("click", async () => {
                  console.log("hello ^_^");
                  const confirmDelete = confirm("Are you sure you want to delete this user?");
                  if (!confirmDelete) {
                        return;
                  }

                  const userId = deleteUser.value;
                  console.log("id: ", userId);
                  const option = {
                        method: 'DELETE',
                        body: JSON.stringify({ userId }),
                        headers: { 'Content-Type': 'application/json' }
                  };

                  fetch('/manage-users', option)
                        .then((response) => {
                              return response.json();
                        })
                        .then((data) => {
                              console.log("data", data);
                              const deleteRow = document.querySelector(`[data-id="${data.docId}"]`);
                              if (deleteRow) {
                                    deleteRow.remove();
                              } else {
                                    console.log(`"Row with _id ${docId} not found."`);
                              }

                        })
                        .catch(error => {
                              console.error("Fetch erorr: ", error);
                        });
            });
      });

      userSearchFm.addEventListener('input', (event) => {
            const searchKey = event.target.value.toLowerCase();

            // Lặp qua các dòng của bảng dữ liệu và kiểm tra xem dòng nào có chứa keyword cần tìm
            const tableRows = document.querySelectorAll('tbody tr');
            tableRows.forEach(row => {
                  const rowData = row.textContent.toLowerCase();
                  if (rowData.includes(searchKey)) {
                        // Hiển thị dòng chứa keywork
                        row.style.display = 'table-row';
                  } else {
                        // Ẩn dòng không chứa từ khóa
                        row.style.display = 'none';
                  }
            })
      });

      async function requestUpdateUser(userData) {
            console.log("Từ fetch gửi yêu cầu info user lên server");
            const option = {
                  method: 'POST',
                  body: JSON.stringify({ updateUser: userData }),
                  headers: { 'Content-Type': 'application/json' },
            };

            try {
                  await fetch('/manage-users/update', option)
                        .then(response => response.json())
                        .then(data => {
                              if (data.success === true) {
                                    updateTable(data.userData);
                                    showMessageAlert(data.message, "green");
                              } else {
                                    showMessageAlert(data.message, "red");
                              }
                        })
                        .catch(error => console.error("Error updating user: ", error));
            } catch (error) {
                  console.error("Error updating user: ", error);
                  throw error; // Ném lỗi để bắt ở nơi gọi hàm nếu cần
            }
      }

      function updateTable(userData) {
            // Lấy reference đến bảng
            const table = document.getElementById('userTable');

            // Lặp qua từng hàng (tr) trong tbody của bảng
            const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                  // Lấy reference đến ô (td) chứa User ID trong từng hàng
                  const userIdCell = rows[i].getElementsByTagName('td')[1];

                  // Kiểm tra xem User ID trong hàng có trùng với User ID mới không
                  if (userIdCell.textContent === userData.userID.toString()) {
                        // Cập nhật nội dung của các ô khác trong hàng
                        rows[i].getElementsByTagName('td')[2].textContent = userData.username;
                        rows[i].getElementsByTagName('td')[3].textContent = userData.email;
                        rows[i].getElementsByTagName('td')[4].textContent = userData.role;
                        console.log("Cập nhật bảng thành công.");
                        break;
                  }
            }
      }

      function populateForm(userData) {
            document.getElementById('update-userID').value = userData.userID;
            document.getElementById('update-username').value = userData.username;
            document.getElementById('update-email').value = userData.email;
            // Lặp qua tất cả các ô checkbox
            document.querySelectorAll('.form-group.usr-fm-g input[type="checkbox"]').forEach(checkbox => {
                  if (userData.role === checkbox.value) {
                        checkbox.checked = true; // Đặt trạng thái checked nếu có
                  }
            });

            const permissions = userData.permissions;
            // Lặp qua tất cả các ô checkbox có thuộc tính name="permission"
            document.querySelectorAll('.form-group-block input[name="permission"]').forEach(checkbox => {
                  const permissionName = checkbox.value;

                  // Kiểm tra xem giá trị của permission có là true hay không
                  if (permissions[permissionName]) {
                        checkbox.checked = true; // Đặt trạng thái checked nếu có
                  }
            });
            document.getElementById("submitUsersForm").value = updateCheckValue;
      }

      function clearForm() {
            document.getElementById('update-userID').value = '';
            document.getElementById('update-username').value = '';
            document.getElementById('update-email').value = '';

            // Lặp qua tất cả các ô checkbox và hủy chọn (uncheck) chúng
            document.querySelectorAll('.form-group.usr-fm-g input[type="checkbox"]').forEach(checkbox => {
                  checkbox.checked = false;
            });

            // Lặp qua tất cả các ô checkbox có thuộc tính name="permission" và hủy chọn (uncheck) chúng
            document.querySelectorAll('.form-group-block input[name="permission"]').forEach(checkbox => {
                  checkbox.checked = false;
            });
      }

      async function requestGetInforUser(userId) {
            let userData;
            console.log("Từ fetch gửi yêu cầu info user lên server");
            const option = {
                  method: 'PUT',
                  body: JSON.stringify({ userId }),
                  headers: { 'Content-Type': 'application/json' },
            };

            console.log("Từ fetch gửi yêu cầu lên server 222");

            try {
                  // Trả về một Promise
                  const response = await fetch('/manage-users/update', option);
                  const data = await response.json();
                  console.log("Dữ liệu nhận được từ hàm @@@: ", data);
                  userData = data.data; // Trả về dữ liệu từ phản hồi
                  console.log("Type of data.data: ", typeof data.data);
            } catch (error) {
                  console.error("Error while retrieving user: ", error);
                  throw error; // Ném lỗi để bắt ở nơi gọi hàm nếu cần
            }

            console.log("userData: ", userData);
            return userData;
      }


      function requestCreateNewUser(formData) {
            console.log("từ fetch gửi request lên server");
            console.log("create : ", formData);
            const option = {
                  method: 'POST',
                  body: JSON.stringify({ formData }),
                  headers: { 'Content-Type': 'application/json' },
            }
            console.log("từ fetch gửi request lên server 222");
            fetch('/manage-users/create', option)
                  .then(response => response.json())
                  .then((data) => {
                        if (data.success === true) {
                              handleAddUser(data.newUser);
                              showMessageAlert(data.message, "green");
                        } else {
                              showMessageAlert(data.message, "red");
                        }

                  })
                  .catch((error) => {
                        console.error("Error when adding new user: ", error);
                  });
      }

      function handleAddUser(newUser) {
            console.log("vào NEW USEr: ", newUser.username);
            try {
                  if (newUser) {

                        // while (table.rows.length > 0) {
                        //       table.deleteRow(0);
                        // }
                        // Xử lý phản hồi từ máy chủ và cập nhật bảng
                        const newRow = document.createElement('tr');
                        const sttCell = document.createElement('td');
                        const idCell = document.createElement('td');
                        const usernameCell = document.createElement('td');
                        const emailCell = document.createElement('td');
                        const roleCell = document.createElement('td');
                        const activeCell = document.createElement('td');
                        const deletedCell = document.createElement('td');
                        const checkCell = document.createElement('td');

                        // Set the content of each cell based on newUser data
                        sttCell.textContent = '';
                        idCell.textContent = newUser.userID;
                        usernameCell.textContent = newUser.username;
                        emailCell.textContent = newUser.email;
                        roleCell.textContent = newUser.role;
                        activeCell.textContent = 'true';
                        deletedCell.innerHTML = `<button class="btn btn-danger delete-users-link" value="${newUser._id}">
                                                      <i class="fa-solid fa-trash" id="trash-icons"></i>
                                                </button>`;

                        checkCell.innerHTML = `<input type="checkbox" id="usr-chboxes" class="checkboxRow" name="userIds" value="${newUser._id}">`;


                        newRow.append(sttCell);
                        newRow.append(idCell);
                        newRow.append(usernameCell);
                        newRow.append(emailCell);
                        newRow.append(roleCell);
                        newRow.append(activeCell);
                        newRow.append(deletedCell);
                        newRow.append(checkCell);
                        // Append the new row to the table body
                        updateSTTValues();
                        table.appendChild(newRow);
                        console.log("DA XU LY");

                  } else { console.log("Cannot add newline because new data is null! Please check it!") }
            } catch (error) {
                  console.error("Error when add new line: ", error);
            }
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

      // Hàm kiểm tra định dạng email
      function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
      }

      function updateSTTValues() {
            const tableBody = document.querySelector('#userTable tbody');
            const sttCells = tableBody.querySelectorAll('td.usr-stt');

            // Duyệt qua tất cả các ô có class "stt"
            sttCells.forEach((sttCell, index) => {
                  // Cập nhật giá trị STT
                  sttCell.textContent = index + 1;
            });
      }


      // ======== Pagination =====================================================
      // Lấy danh sách các hàng trong tbody
      const rows = document.querySelectorAll('#userTable tbody tr');
      // Số mục trên mỗi trang
      const itemsPerPage = 7;

      // Tính toán số lượng trang
      const pageCount = Math.ceil(rows.length / itemsPerPage);

      // Hiển thị trang đầu tiên khi tải trang
      showPage(1);

      // Tạo các nút trang
      createPaginationButtons(pageCount);

      function showPage(page) {
            // Ẩn tất cả các hàng
            rows.forEach(row => row.style.display = 'none');

            // Hiển thị các hàng cho trang hiện tại
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            for (let i = startIndex; i < endIndex; i++) {
                  if (rows[i]) {
                        rows[i].style.display = '';
                  }
            }
      }

      function createPaginationButtons(pageCount) {
            const paginationContainer = document.getElementById('pagination-container');
            const paginationList = paginationContainer.querySelector('.pagination');

            for (let i = 1; i <= pageCount; i++) {
                  const li = document.createElement('li');
                  const a = document.createElement('a');
                  a.href = '#';
                  a.textContent = i;

                  a.addEventListener('click', function () {
                        showPage(i);
                  });

                  li.appendChild(a);
                  paginationList.appendChild(li);
            }
      }

})