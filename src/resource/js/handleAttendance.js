// try {
//       var documentDataString = JSON.stringify(documentData);
//       console.log("Dữ liệu đã parse: ", documentDataString);
// } catch (error) {
//       console.error("Lỗi khi parse JSON:", error);
// }


document.addEventListener('DOMContentLoaded', () => {
  var hot;
  console.log("dữ liệu lấy tu js: ", documentData);
  console.log("Gọi dom bat đầu handsontable");
  const attendanceLink = document.querySelector('attendance-link');

  const batchData = documentData.batch;
  const courseData = documentData.course;
  const curriculumData = documentData.curriculumData;
  const startdateDate = documentData.startdate;

  const studentData = Object.values(documentData.students);

  const attendanceTable = document.getElementById("attendance-data-table");
  const searchField = document.querySelector('#search_field');

  const configuraction = {
    data: studentData,
    rowHeaders: true, // Hiển thị tiêu đề hàng cố định
    colHeaders: Object.keys(studentData[0]), // Hiển thị tiêu đề cột cố định
    manualRowResize: true, // Cho phép điều chỉnh kích thước hàng bằng cách kéo nối
    manualColumnResize: true, // Cho phép điều chỉnh kích thước cột bằng cách kéo nối
    manualColumnMove: true, // Cho phép kéo thả cột
    allowInsertColumn: true,
    allowRemoveColumn: true,
    fixedRowsTop: 1, // Số hàng cố định ở đầu (để hiển thị tiêu đề)
    fixedColumnsLeft: 3, // Số cột cố định ở đầu (để hiển thị tiêu đề)

    contextMenu: true,

    search: true,
    stretchH: "all",
    autoColumnSize: true,
    colWidths: [100, 130, 250, 90,],
    rowHeights: 32,
    width: "100%", // Thiết lập bảng 100% theo chiều ngang
    height: "550px", // Thiết lập chiều cao cố định
    licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
  };

  console.log("câu hình handson xong.");
  if (attendanceTable) {
    hot = new Handsontable(attendanceTable, configuraction);
    console.log("tạo xong handson.");
    // var txtsearchKey = document.getElementById('searchKey');
    searchField.addEventListener('keyup', (event) => {
      const search = hot.getPlugin('search');
      const queryResult = search.query(event.target.value);
      console.log(queryResult);
      hot.render();
    })
    // hot.render('attendance',  {attendanceNavbar: true, headerLogin:false, footerLogin:false});
  } else {
    console.error('Element does not exist.');
  }

  console.log("END");

  const saveDocumentBtn = document.getElementById('saveDocumentBtn');
  saveDocumentBtn.addEventListener('click', () => {
    handleSaveClick(hot);
  });

});


function handleSaveClick(hot) {
  // Lấy đường dẫn URL hiện tại
  const currentURL = window.location.href;
  // Tách chuỗi URL thành mảng các phần tử dựa trên dấu '/'
  const urlParts = currentURL.split('/');
  // Lấy giá trị _id từ đường dẫn URL
  const documentId = urlParts[urlParts.length - 1];
  // console.log(documentId);

  const colNames = hot.getColHeader();
  const rowData = hot.getData();
  const updateData = [colNames, ...rowData];  // Kết hợp cả tên cột và dữ liệu


  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ updateData: updateData })
  }
  fetch(`/attendance/${documentId}`, option)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        const msg = document.querySelector('.msg_hidden');
        msg.textContent = result.message;
        msg.classList.remove('.msg_hidden');
        setTimeout(() => {
          msg.classList.add('.msg_hidden');
        }, 5000);
        alert("Success!");
        console.log("RESULT: ", result);
        const studentData = Object.values(result.jsonData);
        hot.loadData(studentData);
      } else {
        alert('Đã xảy ra lỗi khi lưu dữ liệu.');
      }
    });

}

