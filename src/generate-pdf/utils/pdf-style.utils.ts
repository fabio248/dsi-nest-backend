/* eslint-disable prettier/prettier */
import { MerriweatherBlack } from './fonts/fonts.style';

// Paleta de la clinica para dar consistencia visual a los PDF
export const pdfColors = {
  primary: '#1F5F5B', // verde/teal principal
  text: '#1A1A1A',
  muted: '#6B7280',
  bandText: '#FFFFFF',
};

// Devuelve el ancho util (entre margenes) de la pagina actual
function contentWidth(doc: any): number {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

// Distancia disponible hasta el fondo util de la pagina
function spaceLeft(doc: any): number {
  return doc.page.height - doc.page.margins.bottom - doc.y;
}

/**
 * Agrega una nueva pagina SOLO cuando no queda espacio suficiente para el
 * siguiente bloque. Reemplaza los `doc.addPage()` forzados que dejaban
 * paginas casi en blanco. Usa el tamano/margen por defecto del documento
 * (Carta 612x792), evitando la inconsistencia con A4.
 */
export function ensureSpace(doc: any, needed = 100): void {
  if (spaceLeft(doc) < needed) {
    doc.addPage();
  }
}

/**
 * Titulo de seccion con banda de color de fondo y texto centrado.
 * Da separacion visual clara y consistente entre secciones.
 */
export function sectionTitle(doc: any, text: string): void {
  const paddingY = 7;
  const fontSize = 12;

  doc.font(MerriweatherBlack).fontSize(fontSize);
  const bandHeight = doc.currentLineHeight() + paddingY * 2;

  // Evita que la banda quede sola al final de la pagina
  ensureSpace(doc, bandHeight + 40);

  doc.moveDown(1);
  const x = doc.page.margins.left;
  const y = doc.y;
  const width = contentWidth(doc);

  doc.save();
  doc.rect(x, y, width, bandHeight).fill(pdfColors.primary);
  doc.restore();

  doc
    .fillColor(pdfColors.bandText)
    .text(text.toUpperCase(), x, y + paddingY, { width, align: 'center' });

  doc.fillColor(pdfColors.text);
  doc.y = y + bandHeight;
  doc.moveDown(1);
}

/**
 * Numera todas las paginas al pie ("Pagina X de Y"). Requiere que el
 * documento se haya creado con `bufferPages: true`.
 */
export function addPageNumbers(doc: any): void {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    const oldBottom = doc.page.margins.bottom;
    // Permite escribir en el area del margen inferior sin crear otra pagina
    doc.page.margins.bottom = 0;

    doc
      .font(MerriweatherBlack)
      .fontSize(9)
      .fillColor(pdfColors.muted)
      .text(
        `Página ${i + 1} de ${range.count}`,
        doc.page.margins.left,
        doc.page.height - 35,
        {
          width: contentWidth(doc),
          align: 'center',
          lineBreak: false,
        },
      );

    doc.page.margins.bottom = oldBottom;
  }
  doc.fillColor(pdfColors.text);
}
