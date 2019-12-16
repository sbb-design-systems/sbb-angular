export interface TableData {
  text: string;
  type: string;
  message: string;
  tooltip: string;
}
const newTableData = (text: string, type: string, message: string, tooltip: string) => ({
  text,
  type,
  message,
  tooltip
});

export const SHOWCASE_STATUS_TABLE_DATA: TableData[] = [
  newTableData('sbb status type text valid', 'valid', 'valid', 'valid status'),
  newTableData('sbb status type text warning', 'warning', 'warning', 'warning status'),
  newTableData('sbb status type text error', 'invalid', 'invalid', 'invalid status'),
  newTableData('sbb status text face', 'happy', 'happy', 'happy status')
];
