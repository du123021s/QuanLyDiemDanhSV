document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.querySelector('.form-search input[type="search"]');
      searchInput.addEventListener('input', () => {
            // Lấy giá trị nhập từ trường tìm kiếm
            console.log("click search");
            const searchTerm = searchInput.value.toLowerCase(); // chuyển hết giá trị sang thường

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

      })
})