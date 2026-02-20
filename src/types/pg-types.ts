export interface TableData {
  title: string;       // e.g. "Community Management (CM)"
  headers: string[];   // Column headers from row 1
  rows: string[][];    // Each row as array of string cell values
}
