type ExportRow = Record<string, unknown>;

const escapeHtml = (value: unknown): string => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const downloadBlob = (filename: string, content: BlobPart, mimeType: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadCsv = (filename: string, rows: ExportRow[]) => {
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const quote = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [columns, ...rows.map(row => columns.map(column => row[column]))]
    .map(row => row.map(quote).join(','))
    .join('\r\n');
  downloadBlob(filename, `\ufeff${csv}`, 'text/csv;charset=utf-8');
};

export const downloadJson = (filename: string, rows: ExportRow[]) => {
  downloadBlob(filename, JSON.stringify(rows, null, 2), 'application/json;charset=utf-8');
};

export const printTableReport = (title: string, rows: ExportRow[]): boolean => {
  const popup = window.open('', '_blank', 'width=900,height=700');
  if (!popup) return false;
  const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
  const header = columns.map(column => `<th>${escapeHtml(column)}</th>`).join('');
  const body = rows.map(row => `<tr>${columns.map(column => `<td>${escapeHtml(row[column])}</td>`).join('')}</tr>`).join('');
  popup.document.open();
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font:14px Arial,sans-serif;color:#172033;padding:32px}h1{font-size:22px}p{color:#64748b}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{border:1px solid #cbd5e1;padding:10px;text-align:left;vertical-align:top}th{background:#f1f5f9}@media print{body{padding:0}}</style></head><body><h1>${escapeHtml(title)}</h1><p>Generado el ${escapeHtml(new Date().toLocaleString())}</p><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table><script>window.addEventListener('load',()=>window.print());</script></body></html>`);
  popup.document.close();
  return true;
};
