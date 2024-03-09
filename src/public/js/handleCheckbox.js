document.addEventListener("DOMContentLoaded", function () {
      const deleteBtn = document.getElementById('deleteFileBtn');
      const exportBtn = document.getElementById('exportFileBtn');
      const closeBtn = document.getElementById('closeFileBtn');

      const actionBtns = document.getElementById('actionBtns');

      const selectAllCheckbox = document.getElementById('selectAll');
      const checkboxes = document.querySelectorAll("tbody input[type='checkbox']");

      // delete, close, export, checkAll, checkRow, actionbtns

      // Function to toggle action buttons visibility
      function toggleActionButtons(visible) {
            if (visible) {
                  actionBtns.classList.remove('hidden');
            } else {
                  actionBtns.classList.add('hidden');
            }
      }

      // Event listener for "Select All" checkbox
      selectAllCheckbox.addEventListener("change", function () {
            checkboxes.forEach((checkbox) => {
                  checkbox.checked = selectAllCheckbox.checked;
            });
            toggleActionButtons(selectAllCheckbox.checked);
      });

      // Event listener for individual checkboxes
      handleClickCheckBox();

      // Event listener for Close button
      closeBtn.addEventListener('click', function () {
            checkboxes.forEach(checkbox => {
                  checkbox.checked = false;
            });
            selectAllCheckbox.checked = false;
            toggleActionButtons(false);
      });

      // Event listener for Delete button (replace with you delete logic)
      deleteBtn.addEventListener('click', function () {
            const deleteConfirm = confirm("Are you sure you want to delete this file?");
            if (!deleteConfirm) { return };

            const checkedValues = [];
            const checkedList = Array.from(checkboxes).filter(check => check.checked);
            checkedList.forEach(check => {
                  if (check.checked) {
                        const value = check.value;
                        console.log("_iD : ", check.value);
                        checkedValues.push(value);
                  }
            });
            deleteDocument(checkedValues);
      })

      function deleteDocument(checkedValues) {
            const option = {
                  method: 'DELETE',
                  body: JSON.stringify({ documentIDs: checkedValues }),
                  headers: { 'Content-Type': 'application/json' }
            };

            fetch('/importFile', option)
                  .then(function (response) {
                        return response.json();
                  })
                  .then(function (data) {
                        const docIDs = data.documentIDs;
                        docIDs.forEach(docID => {
                              const selector = document.querySelector('.docID-' + docID);
                              if (selector) selector.remove();
                        });
                        showSuccessAlert("Deleted successfully");

                  })
                  .catch(error => {
                        console.error("Fetch erorr: ", error);
                  });
      }

      exportBtn.addEventListener('click', exportToExcel);



      function exportToExcel() {
            const selectedDocuments = Array.from(checkboxes).filter(checkbox => checkbox.checked)
                  .map(checkbox => checkbox.value);
            console.log("=== Checkbox đã chọn: ", selectedDocuments);

            if (selectedDocuments.length > 1) {
                  alert('Vui lòng chỉ chọn một tài liệu.');
                  return;
            }

            // Gửi yêu cầu Fetch đến máy chủ để tạo file Excel
            fetch('/exportFile', {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ selectedDocuments }),
            })
                  .then(response => {
                        if (response.ok) {
                              return response.blob(); // Chuyển đổi dữ liệu nhận được thành Blob
                        } else {
                              console.error('Lỗi khi tạo file Excel');
                        }
                  })
                  .then(blob => {
                        const url = window.URL.createObjectURL(blob);

                        // Tạo một thẻ <a> ẩn để tạo hộp thoại lưu trữ và tải về
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'exported_documents.xlsx';

                        // Tự động kích hoạt sự kiện click trên thẻ <a>
                        a.click();

                        window.URL.revokeObjectURL(url);
                  })
                  .catch(error => {
                        console.error('Lỗi Fetch:', error);
                  });
      }

      function handleClickCheckBox() {
            checkboxes.forEach((checkbox) => {
                  checkbox.addEventListener("change", (event) => {
                        const target = event.target;
                        if (target.type === 'checkbox') {
                              const checkedList = Array.from(checkboxes).filter(check => check.checked);
                              toggleActionButtons(checkedList.length > 0);
                        }
                  });
            });
      }

      // Hiển thị thông báo thành công
      function showSuccessAlert(message) {
            const successAlert = document.getElementById('success-alert');
            successAlert.textContent = message;
            // successAlert.style.backgroundColor = 'red'; // Thay đổi màu sắc thành đỏ
            successAlert.style.display = 'block';

            // Tự động ẩn thông báo sau 3 giây
            setTimeout(() => {
                  successAlert.style.display = 'none';
            }, 5000);
      }

})


