const XLSX = require('xlsx');
const wb = XLSX.readFile('80sample.xls');
const ws = wb.Sheets['FB書式 '];
const data = XLSX.utils.sheet_to_json(ws, {header: 1, defval: ''});

console.log('列J-Mのデータ:');
data.forEach((row, i) => {
    const cols = [row[9], row[10], row[11], row[12]];
    if (cols.some(c => c !== '' && c !== undefined && c !== null)) {
        console.log(`${i}: ${JSON.stringify(cols)}`);
    }
});
