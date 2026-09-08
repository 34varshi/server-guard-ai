export function downloadCsv(filename: string, rows: Array<Record<string, string | number | null>>) {
  const first = rows[0];
  if (!first) return;
  const headers = Object.keys(first);
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => {
    const value = String(row[header] ?? "").replaceAll('"', '""');
    return `"${value}"`;
  }).join(","))].join("\n");
  downloadBlob(filename, csv, "text/csv;charset=utf-8");
}

export function downloadPdf(filename: string, title: string, lines: string[]) {
  const escapePdf = (value: string) => value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
  const content = [`BT`, `/F1 18 Tf`, `50 760 Td`, `(${escapePdf(title)}) Tj`, `/F1 10 Tf`, ...lines.flatMap((line) => [`0 -18 Td`, `(${escapePdf(line.slice(0, 110))}) Tj`]), `ET`].join("\n");
  const objects = [`1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj`, `2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj`, `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj`, `4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj`, `5 0 obj<</Length ${content.length}>>stream\n${content}\nendstream endobj`];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) { offsets.push(pdf.length); pdf += `${object}\n`; }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`;
  downloadBlob(filename, pdf, "application/pdf");
}

function downloadBlob(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}