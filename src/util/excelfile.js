import moment from 'moment';
import { parseISO, format } from 'date-fns';

export function findRowByValue(worksheet, targetValue) {
      // Step 1. Remove special characters
      const escapedTargetValue = targetValue.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      /** Step 2. Create simple dynamic patterns
       * not distinguish between spaces, \\s*
       * not lower case, flag i
       * not other special characters
       * */                       
      const targetRegex = new RegExp(escapedTargetValue.replace(/ /g, "\\s*"), "i");
    
      for (const cellAddress in worksheet) {
        if (worksheet[cellAddress].v && targetRegex.test(worksheet[cellAddress].v)) {
          
          const rowNumber = parseInt(cellAddress.replace(/[A-Z]/g, ''), 10); 
          const rows = worksheet['!ref'].split(':');  
          const firstRowNumber = parseInt(rows[0].match(/\d+/)[0], 10);
          const lastRowNumber = parseInt(rows[1].match(/\d+/)[0], 10);
      
          // ensure the returned results are within the range of interest
          if (rowNumber >= firstRowNumber && rowNumber <= lastRowNumber) {
            return cellAddress;
          }
        }
      }
      return null;
    }

/*** XỬ LÝ NGÀY CHUẨN JAVASCRIPT
 * Ngày chuyền vào là ngày javascript chuẩn (UTC+0)
 * Ngày chuẩn của VN là (UTC+7)
 * Nếu chuyển trực tiếp ngày jascript chuẩn thành định dạng "dd/MM/YYYY" thì sẽ cho ra date không chính xác
 * Điều chỉnh lại bằng cách cộng thêm +7 cho giờ javascript chuẩn (UTC+0) sẽ thành (UTC+7)
 **/
export function changeStandardJSDate(standardDateJS) {
  // Chuyển giờ từ (UTC+0) thành giờ VN (UTC+7)
  // const dateFormat = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if(standardDateJS.length < 11){
    return standardDateJS;
  }
  const vnDate = new Date(standardDateJS); 
  vnDate.setHours(vnDate.getHours() + 7);

  //Chuyển sang định dạng "dd/MM/YYYY" với toLocaleDateString
  const formattedDate = vnDate.toLocaleDateString('en-GB', {timeZone: 'Asia/Ho_Chi_Minh'});
  return formattedDate;
}



// === Get value at cell address 
export function getValueByAddress(worksheet, stringAddress){
  var data = "";
  try{
    const colValue = stringAddress.match(/[A-Za-z]+/)[0];                // column  (string)
    const rowValue = parseInt(stringAddress.match(/\d+/)[0], 10);         // row     (int)
    
    
    var asciiCode = (colValue.charCodeAt(0))+1;                          // get ascii code  (int)
    for (asciiCode; asciiCode <= 'Z'.charCodeAt(0); asciiCode++) {          
      var col = String.fromCharCode(asciiCode);                            // get unicode UTF-16  (string)
      var cellAddress = `${col}${rowValue}`;                          
  
      if (worksheet[cellAddress] && worksheet[cellAddress].v) {
        data += `${worksheet[cellAddress].v}`;
        break;
      }
    }
  }catch(error){
    console.error("Error: ", error);
  }

   console.log("Data: ", data);
   return data.trim();
}

export function getAllValueOfRow(sheet, stringAddress){
  const values = [];
  let colName = stringAddress.match(/[A-Za-z]+/)[0];                // tên cột
  const rowIndex = parseInt(stringAddress.match(/\d+/)[0], 10);        // chỉ số hàng                 


  while(true){
    const cellAddress = colName + rowIndex;
    const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : null;

    if(!cellValue){
      break;
    }

    values.push(cellValue);
    colName = incrementColumn(colName);
  }
  return values;
}

export function incrementColumn(colName){
  if(colName == 'Z'){
    return 'AA';
  }

  let flag = true;
  let result = '';
  for(let i=colName.length-1; i>=0; i--){
    let char = colName[i];
    if(flag){
        if(char === 'Z'){
            char = 'A';
        }else{
          char = String.fromCharCode(char.charCodeAt(0) + 1);
            flag = false;
        }
    }
    result = char + result;
  }
  return result;
}



export function createJsonObjList(sheet, stringAddress, endRowNum, columnNames){
  const dataList = [];
  
  const colValue = stringAddress.match(/[A-Za-z]+/)[0];                // column  (string) VD: B (stringAddress='B8')
  const rowValue = parseInt(stringAddress.match(/\d+/)[0], 10);        // row vd: 8    => B8
  const asciiCode = colValue.charCodeAt(0);                            // vd : ascii 'B' = 66

    // Duyệt theo hàng từ trên xuống
    for(let rowIndex = rowValue; rowIndex < endRowNum; rowIndex++){   // hàng 
      const rowData = {};   
      // Duyệt theo từng cột của hàng để lấy giá trị
      for(let colIndex=0; colIndex < columnNames.length; colIndex++){  // cột
        let cellValue;
        const columnName = columnNames[colIndex];
        const cellAddress = String.fromCharCode(asciiCode + colIndex) + (rowIndex+1); // Don't get column names +1= 'B9'
        
        if(sheet[cellAddress] && sheet[cellAddress].t === 'd'){
            cellValue = changeStandardJSDate(sheet[cellAddress].v);
        }else{
            cellValue = sheet[cellAddress] ? sheet[cellAddress].v : '';
        }    
          if(cellValue !== null){
            rowData[columnName] = cellValue;
          }
      }
      dataList.push(rowData);
    }
    console.log(dataList);
  return dataList;
}


export function setCellStyle(cell, fontOptions, alignmentOptions, mergeCells) {
  cell.font = fontOptions;
  cell.alignment = alignmentOptions;
  if (mergeCells) {
      cell.master = mergeCells;
  }
}

export function addValuesToRow(sheet, rowIndex, values) {
  let columnIndex = 1; //  the first column

  for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const cell = sheet.getCell(rowIndex, columnIndex); // Dòng n , cột hiện tại

      if (i % 2 === 0) {
          // Nếu là giá trị A, B, C (chiếm 2 cell)
          cell.value = value;
          sheet.mergeCells(rowIndex, columnIndex, rowIndex, columnIndex + 1); // Gộp 2 ô
          columnIndex += 2; // Bỏ qua ô trống
      } else {
          // Nếu là giá trị AA, BB, CC (1 cell)
          cell.value = value;
          columnIndex += 2;
      }
  }
}


export function setTableCellStyle(sheet, startRow, startColumn, numRows, numColumns, fontOptions, alignmentOptions) {
  for (let row = startRow; row <= startRow + numRows; row++) {
    for (let col = startColumn; col <= startColumn + numColumns; col++) {
      const cell = sheet.getCell(row, col);
      
      // Định kiểu font cho ô
      if (fontOptions) {
        cell.font = fontOptions;
      }

      // Định kiểu căn lề cho ô
      if (alignmentOptions) {
        cell.alignment = alignmentOptions;
      }
    }
  }
}


