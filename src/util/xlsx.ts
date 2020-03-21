import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function exportExcel(headers: any[], datas: any[], fileName: string) {
  const output: any = {};

  headers = headers.filter(item => item.dataIndex);

  let has_header = false;
  for (let index = 0; index < headers.length; index++) {
    const header = headers[index];
    if (header.title) {
      has_header = true;
      output[`${String.fromCharCode(65 + index)}1`] = {
        key: header.dataIndex,
        v: header.title,
      };
    }
  }

  for (let line = 0; line < datas.length; line++) {
    const data = datas[line];
    let index = 0;
    for (const header of headers) {
      if (data[header.dataIndex]) {
        output[`${String.fromCharCode(65 + index)}${line + (has_header ? 2 : 1)}`] = {
          v: data[header.dataIndex],
        };
      }
      index++;
    }
  }

  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['Sheet'],
    Sheets: {
      Sheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': headers.map(i => {
          if (i.width) {
            return { wpx: i.width };
          }
          return {};
        }),
      }),
    },
  };

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'array',
  });

  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
}
export default exportExcel;
