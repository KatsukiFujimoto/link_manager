function convertToCSV(objArray) {
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let index in array[i]) {
      if (line != '') line += ','

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  let jsonObject = JSON.stringify(items);

  let csv = this.convertToCSV(jsonObject);

  let exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  let bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  let blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = 'hidden';
      $("#csvExport").append(link);
      // link.click();
      $("#csvExport").find("a")[0].click();
      $("#csvExport").find("a").remove();
    }
  }
}

function browserSupportFileUpload() {
  let isCompatible = false;
  if (window.File && window.FileReader && window.FileList && window.Blob) {
  isCompatible = true;
  }
  return isCompatible;
}

// Method that reads and processes the selected file
function upload(evt) {
  let linkObjs;
  if (!browserSupportFileUpload()) {
    alert('The File APIs are not fully supported in this browser!');
  } else {
    let file = evt.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      let csvData = event.target.result;
      //convert to JS array
      linkObjs = $.csv.toObjects(csvData);
      linkAry = [];
      for (let i = 0; i < linkObjs.length; i++) {
        let unformattedObj = linkObjs[i];
        if (isEmpty(unformattedObj["linkUrl"]) && isEmpty(unformattedObj["linkName"]) && isEmpty(unformattedObj["linkTab"]) && isEmpty(unformattedObj["favorite"])) {
          linkObj = null;
        } else {
          linkObj = {
            linkUrl: unformattedObj["linkUrl"],
            linkName: unformattedObj["linkName"],
            linkTab: unformattedObj["linkTab"],
            favorite: unformattedObj["favorite"] == "" ? "" : JSON.parse(unformattedObj["favorite"].toLowerCase())
          }
        }
        linkAry.push(linkObj);
      }
      localStorage.setItem("linkObj", JSON.stringify(linkAry));
    };
    reader.onerror = function() {
      alert('Unable to read ' + file.fileName);
    };
  }
}

function isEmpty(obj) {
  return obj == "" || obj == undefined || obj == null;
}