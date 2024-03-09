
document.addEventListener('DOMContentLoaded', function () {
    const inputFile = document.getElementById('inputFile');
    const importBtn = document.getElementById('importBtn');
    const table = document.getElementById('documentTableBody');

    const tableBody = document.getElementById("filePms-Table");   // tbody 

    const btnOpenModalList = document.querySelectorAll(".btn-open-modal");   // button permission 
    const modal = document.getElementById("permissionModal");     // all table permission 
    const closeBtn = document.querySelector(".close-btn");                   // button dấu x 
    const assignBtn = document.getElementById("btnAssignPermission");
    const manageFileLayout = document.querySelector(".manage-file-layout");

    console.log("user: ", userRole);
    if (userRole != 'Teacher') {
        importBtn.addEventListener('click', function () {
            inputFile.click();
        });

        inputFile.addEventListener('change', async function () {
            console.log("Có thực thi ======");


            try {
                const file = inputFile.files[0];
                if (file) {
                    // === Create FormDate. It’s the object to represent HTML form data.
                    const formData = new FormData();
                    formData.append("importFile", file);
                    const option = {
                        method: 'POST',
                        body: formData,
                    };

                    // === Use Fetch to send HTTP request
                    await fetch('/importFile', option)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success === true) {
                                handleImportSuccess(data.listDocument);
                                window.location.reload();
                                showMessageAlert("Success", "green");
                            } else {
                                showMessageAlert(data.message, "red");
                            }

                        })
                        .catch(() => {
                            console.error('Import failed:', data.message);
                        })
                        .catch(error => {
                            console.error('Import failed, error: ', error);
                        })

                }
                else {
                    console.log("File don't find!");
                }
            } catch (error) {
                console.error("Error when import file: ", error);
            }
        });

    }

    function handleImportSuccess(listDocument) {
        try {
            if (listDocument) {

                while (table.rows.length > 0) {
                    table.deleteRow(0);
                }

                // === Create new line for data table
                listDocument.forEach(element => {
                    const row = table.insertRow();
                    const chbox = row.insertCell(0);
                    const batch = row.insertCell(1);
                    const course = row.insertCell(2);
                    const curriculum = row.insertCell(3);
                    const startdate = row.insertCell(4);
                    const attenIcon = row.insertCell(5);

                    chbox.innerHTML = '<input type="checkbox" name="docCheck" value=" ' + element._id + '">';
                    batch.textContent = element.batch;
                    course.textContent = element.course;
                    curriculum.textContent = element.curriculum;
                    startdate.textContent = element.startdate;
                    attenIcon.innerHTML =
                        `<td>
                            <button class="btn btn-success btn-open-modal" data-file-id="${element._id}">Permission</button>
                        </td>`;
                });

            } else { console.log("Cannot add newline because new data is null! Please check it!") }
        } catch (error) {
            console.error("Error when add new line: ", error);
        }
    }

    // ========= FILE  PERMISSION ==========================
    handlePermissionBtn();

    function handlePermissionBtn() {
        console.log("Handle permission button clicked! aaa");
        btnOpenModalList.forEach(function (btn) {
            console.log("Handle permission button clicked! bbb");
            btn.addEventListener("click", function () {
                // Lấy file ID từ thuộc tính data
                const fileId = btn.getAttribute("data-file-id");

                // Hiển thị modal và gán ID của file
                if (manageFileLayout) { manageFileLayout.classList.add("file-expand"); }
                modal.style.display = "block";
                modal.setAttribute("data-file-id", fileId);

                console.log("Chuẩn bị fetch teachers");

                const option = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                // Gửi request đến server lấy danh sách giáo viên
                fetch('/importFile/all-users', option)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json(); // Chuyển đổi response thành JSON
                    })
                    .then(data => {
                        console.log(data.teachers); // Dữ liệu từ server
                        updateTeachersTable(data.teachers);
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });
            });
        });
    }

    // Bắt sự kiện khi click vào nút đóng modal
    closeBtn.addEventListener("click", function () {
        if (manageFileLayout) { manageFileLayout.classList.remove("file-expand"); }
        modal.style.display = "none";
    });

    // Bắt sự kiện khi click vào nút phân quyền
    assignBtn.addEventListener("click", async () => {
        const checkboxes = document.querySelectorAll('.table-fpms .checkbox:checked');
        const selectedIds = Array.from(checkboxes).map(checkbox => {
            const row = checkbox.closest('tr');
            const id = row.querySelector('input[data-id]').getAttribute('data-id');
            return id;
        })
        // Log or use the selected IDs as needed
        console.log('Selected IDs:', selectedIds);
        const docId = modal.getAttribute('data-file-id');
        const option = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedIds, docId }),
        }

        try {
            const data = await fetch('/importFile/assign-permission', option)
                .then(response => response.json());
            if (data.success) {
                console.log("Success");
                showMessageAlert(data.message, "green");
            } else {
                showMessageAlert("An error occurred while granting file permissions.", "red");
            }

        } catch (error) {
            console.error('Error processing permission assignment:', error);
        }

        // Sau khi xử lý, đóng modal
        if (manageFileLayout) { manageFileLayout.classList.remove("file-expand"); }
        modal.style.display = "none";

    });

    const searchFpms = document.querySelector('#search-fpms');
    searchFpms.addEventListener('input', () => {
        // Lấy giá trị nhập từ trường tìm kiếm
        const searchTerm = searchFpms.value.toLowerCase(); // chuyển hết giá trị sang thường

        // Lặp qua các dòng của bảng dữ liệu và kiểm tra xem dòng nào có chứa keyword cần tìm
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            const rowData = row.textContent.toLowerCase();
            if (rowData.includes(searchTerm)) {
                // Hiển thị dòng chứa keywork
                row.style.display = 'table-row';
            } else {
                // Ẩn dòng không chứa từ khóa
                row.style.display = 'none';
            }
        })

    });

    // Tạo một biến global để lưu trữ dữ liệu của bảng 2
    let tablePms = [];
    function updateTeachersTable(data) {
        // Xóa nội dung hiện tại của bảng
        tableBody.innerHTML = " ";
        tablePms = data;
        // Tạo các dòng mới cho bảng từ dữ liệu nhận được
        data.forEach((teacher) => {
            const newRow = document.createElement("tr");      //dòng
            const idCell = document.createElement("td");  // ô
            const nameCell = document.createElement("td");  // ô
            const chboxCell = document.createElement("td");

            const checkbox = `<input type="checkbox" class="checkbox" id="checkbox" data-id="${teacher.userID}">`;
            chboxCell.innerHTML = checkbox;
            idCell.textContent = teacher.userID;
            nameCell.textContent = teacher.username;  // Thay thế bằng tên trường dữ liệu thích hợp


            newRow.appendChild(idCell);
            newRow.appendChild(nameCell);
            newRow.appendChild(chboxCell);


            // Add new line into tbody of data table
            tableBody.appendChild(newRow);

        })

        initPaginationForTablePms();
    }

    // ===== Pagination cho Permission Table =============
    const itemsPerPage = 5;
    // Hàm khởi chạy chân trang cho bảng 2
    function initPaginationForTablePms() {
        console.log("initPaginationForTablePms");
        const totalPages = Math.ceil(tablePms.length / itemsPerPage);
        displayItems(1, tablePms);
        console.log("Tổng trang: ", totalPages);
        createPaginationButtonsPms(totalPages);
    }

    // Hàm hiển thị dữ liệu trên từng trang của bảng 2
    function displayItems(pageNumber, data) {
        console.log("displayItems");
        tableBody.innerHTML = "";

        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        for (let i = startIndex; i < endIndex && i < data.length; i++) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${data[i].userID}</td><td>${data[i].username}</td><td><input type="checkbox" class="checkbox" id="checkbox" data-id="${data[i].userID}"></td>`;
            tableBody.appendChild(row);
        }
    }

    // Hàm tạo nút chuyển trang cho bảng 2
    function createPaginationButtonsPms(totalPages) {
        console.log("createPaginationButtons");
        const paginationContainer = document.getElementById("pagination-container-pms");
        paginationContainer.innerHTML = "";
        console.log("Tổng trang: ", totalPages);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            // Sử dụng hàm gọi lại để bắt giữ giá trị của i
            button.addEventListener("click", function (event) {
                displayItems(event.target.textContent, tablePms);
            });
            paginationContainer.appendChild(button);
        }
    }

    // ======== Pagination cho File Table =====================================================
    // Lấy danh sách các hàng trong tbody
    const rows = document.querySelectorAll('#file-table tbody tr');
    // Số mục trên mỗi trang
    const itemsPerPageFileTable = 7;

    // Tính toán số lượng trang
    const pageCount = Math.ceil(rows.length / itemsPerPageFileTable);

    // Hiển thị trang đầu tiên khi tải trang
    showPage(1);

    // Tạo các nút trang
    createPaginationButtons(pageCount);

    function showPage(page) {
        console.log("showPage");
        // Ẩn tất cả các hàng
        rows.forEach(row => row.style.display = 'none');

        // Hiển thị các hàng cho trang hiện tại
        const startIndex = (page - 1) * itemsPerPageFileTable;
        const endIndex = startIndex + itemsPerPageFileTable;
        for (let i = startIndex; i < endIndex; i++) {
            if (rows[i]) {
                rows[i].style.display = '';
            }
        }
    }

    function createPaginationButtons(pageCount) {
        console.log("createPaginationButtons");
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

    // Hiển thị thông báo thành công
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

});
