export interface TableData {
  text: string;
  status: string;
  message: string;
  tooltip: string;
}
const newTableData = (text: string, status: string, message: string, tooltip: string) => ({
  text,
  status,
  message,
  tooltip
});

export const SHOWCASE_STATUS_TABLE_DATA: TableData[] = [
  newTableData('sbb status text valid', 'valid', 'valid', 'valid entry'),
  newTableData('sbb status text warning', 'warning', 'warning', 'warning status'),
  newTableData('sbb status text error', 'error', 'error', 'error status'),
  newTableData('sbb status text face', 'happy', 'happy', 'happy status')
];
