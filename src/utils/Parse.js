import * as ExcelJS from "exceljs";

const ReadExcel = async (file) => {
    let fileR = new FileReader();
    fileR.readAsArrayBuffer(file)
    return new Promise((resolve, reject) => {
        fileR.onload = async function (e) {
            const workbook = new ExcelJS.Workbook();
            resolve(await workbook.xlsx.load(e.target.result))
        };
        fileR.onerror = function (e) {
            reject(e);
        };
    });
}
export default ReadExcel;
