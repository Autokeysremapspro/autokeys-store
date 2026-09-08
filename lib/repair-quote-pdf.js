function safeText(value) {
  return String(value == null ? '' : value).replace(/[€]/g, 'EUR').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x20-\xFF]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrap(value, width = 78) {
  const words = String(value || '').trim().split(/\s+/).filter(Boolean); const lines = []; let line = '';
  for (const word of words) { if ((line + ' ' + word).trim().length > width && line) { lines.push(line); line = word; } else line = (line + ' ' + word).trim(); }
  if (line) lines.push(line); return lines.length ? lines : [''];
}

function euro(value) { return `${Number(value || 0).toFixed(2).replace('.', ',')} EUR`; }
function pdfText(x, y, size, value, color = '0.92 0.92 0.94') { return `${color} rg BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${safeText(value)}) Tj ET\n`; }

function pageStream(request, lines, page, pages) {
  let out = '0.055 0.055 0.067 rg 0 0 595 842 re f\n0.91 0.08 0.12 rg 0 790 595 52 re f\n';
  out += pdfText(38, 809, 19, 'AUTOKEYS REMAPS PRO', '1 1 1');
  out += pdfText(395, 810, 9, `PRESUPUESTO ${request.numero}`, '1 1 1');
  out += pdfText(38, 758, 11, `Cliente: ${request.nombre}`);
  out += pdfText(38, 741, 10, `Vehiculo: ${request.marca} ${request.modelo}${request.anio ? ` (${request.anio})` : ''}`, '0.68 0.68 0.72');
  out += pdfText(38, 725, 10, `Unidad: ${request.tipo_unidad}  |  Trabajo: ${request.trabajo_solicitado}`, '0.68 0.68 0.72');
  out += '0.18 0.18 0.21 RG 38 704 m 557 704 l S\n';
  out += pdfText(38, 684, 9, 'CONCEPTO', '0.9 0.25 0.29') + pdfText(385, 684, 9, 'CANT.', '0.9 0.25 0.29') + pdfText(440, 684, 9, 'PRECIO', '0.9 0.25 0.29') + pdfText(510, 684, 9, 'TOTAL', '0.9 0.25 0.29');
  let y = 659;
  for (const line of lines) {
    const description = wrap(line.concepto, 48);
    out += pdfText(38, y, 9, description[0]) + pdfText(393, y, 9, Number(line.cantidad || 1).toString(), '0.76 0.76 0.79') + pdfText(436, y, 9, euro(line.precio_unitario), '0.76 0.76 0.79') + pdfText(501, y, 9, euro(line.total), '1 1 1');
    for (const extra of description.slice(1, 3)) { y -= 13; out += pdfText(38, y, 8, extra, '0.68 0.68 0.72'); }
    y -= 24; out += `0.13 0.13 0.16 RG 38 ${y + 10} m 557 ${y + 10} l S\n`;
  }
  if (page === pages) {
    out += pdfText(385, Math.max(y - 8, 190), 10, 'TOTAL IVA INCLUIDO', '0.68 0.68 0.72') + pdfText(455, Math.max(y - 34, 164), 19, euro(request.presupuesto_total), '1 1 1');
    const infoY = Math.max(y - 75, 115);
    if (request.plazo_estimado) out += pdfText(38, infoY, 9, `Plazo estimado: ${request.plazo_estimado}`, '0.78 0.78 0.81');
    out += pdfText(38, infoY - 16, 9, `Validez: ${request.presupuesto_validez_dias || 15} dias`, '0.78 0.78 0.81');
    wrap(request.presupuesto_observaciones || 'Presupuesto sujeto a la comprobacion final de la unidad recibida.', 85).slice(0, 3).forEach((text, i) => { out += pdfText(38, infoY - 43 - i * 13, 8, text, '0.58 0.58 0.62'); });
  }
  out += pdfText(38, 35, 8, 'Av. Andalucia 125, Bajo - Puente de Genave (Jaen)  |  +34 632 98 26 46  |  info@autokeyspro.es', '0.5 0.5 0.54') + pdfText(532, 18, 7, `${page}/${pages}`, '0.45 0.45 0.49');
  return out;
}

function generateRepairQuotePdf(request) {
  const cleanLines = (Array.isArray(request.presupuesto_lineas) ? request.presupuesto_lineas : []).slice(0, 30).map((line) => ({ concepto: String(line.concepto || '').trim().slice(0, 240), cantidad: Math.max(0.01, Number(line.cantidad) || 1), precio_unitario: Math.max(0, Number(line.precio_unitario) || 0), total: Math.max(0, Number(line.total) || (Number(line.cantidad) || 1) * (Number(line.precio_unitario) || 0)) })).filter((line) => line.concepto);
  if (!cleanLines.length) cleanLines.push({ concepto: request.presupuesto_detalle || 'Servicio de diagnostico y reparacion', cantidad: 1, precio_unitario: Number(request.presupuesto_total), total: Number(request.presupuesto_total) });
  const chunks = []; for (let i = 0; i < cleanLines.length; i += 16) chunks.push(cleanLines.slice(i, i + 16));
  const objects = []; const kids = chunks.map((_, i) => `${4 + i * 2} 0 R`).join(' ');
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'; objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${chunks.length} >>`; objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  chunks.forEach((lines, index) => { const pageId = 4 + index * 2; const contentId = pageId + 1; const stream = pageStream(request, lines, index + 1, chunks.length); objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`; objects[contentId] = `<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}endstream`; });
  let output = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; const offsets = [0];
  for (let i = 1; i < objects.length; i += 1) { offsets[i] = Buffer.byteLength(output, 'latin1'); output += `${i} 0 obj\n${objects[i]}\nendobj\n`; }
  const xref = Buffer.byteLength(output, 'latin1'); output += `xref\n0 ${objects.length}\n0000000000 65535 f \n`; for (let i = 1; i < objects.length; i += 1) output += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`; output += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(output, 'latin1');
}

module.exports = { generateRepairQuotePdf };
