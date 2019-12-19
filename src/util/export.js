import XLSX from 'xlsx';

function exportExcel(headers, data, fileName) {
  const _headers = headers
    .filter(item => item._width)
    .map((item, i) =>
      Object.assign(
        {},
        { key: item.key, title: item.title, position: String.fromCharCode(65 + i) + 1 },
      ),
    )
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }),
      {},
    );

  const _data = data
    .map((item, i) =>
      headers
        .filter(item => item._width)
        .map((key, j) => {
          let content;
          if (key.renderStr) {
            content = key.renderStr(item[key.dataIndex], item);
          } else if (key.render) {
            content = key.render(item[key.dataIndex], item);
          } else if (key.dataIndex) {
            content = item[key.dataIndex];
          }

          return Object.assign({}, { content, position: String.fromCharCode(65 + j) + (i + 2) });
        }),
    )
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, {
          [next.position]: { v: next.content },
        }),
      {},
    );

  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data);

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
        '!cols': headers.map(i => ({ wpx: i._width })),
      }),
    },
  };

  XLSX.writeFile(wb, fileName, {
    type: 'string',
  });
  // 导出 Excel
}
export default exportExcel;
