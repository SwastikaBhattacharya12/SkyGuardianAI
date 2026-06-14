const docx = require('docx');
const fs = require('fs');
const path = require('path');

// Constants
const COLORS = {
  primary: "003366",    // Deep Navy
  secondary: "4682B4",  // Steel Blue
  accent: "FFBF00",     // Amber
  text: "333333",       // Charcoal
  muted: "666666",      // Muted Gray
  light: "F5F5F5"       // Soft Gray
};
const FULL_WIDTH = 9360; // Standard layout width in DXA

// Wrapped filesystem utility
const wrappedFs = {
  ...fs,
  writeFileSync: (filePath, data, options) => {
    let targetPath = filePath;
    // Map Unix-style paths like '/home/claude/prd/...' to a local 'prd' folder
    if (filePath.startsWith('/home/claude/prd/')) {
      const fileName = path.basename(filePath);
      const prdDir = path.join(__dirname, 'prd');
      if (!fs.existsSync(prdDir)) {
        fs.mkdirSync(prdDir, { recursive: true });
      }
      targetPath = path.join(prdDir, fileName);
    } else {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
    return fs.writeFileSync(targetPath, data, options);
  }
};

// Document construction helpers
const h1 = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, bold: true, size: 32, color: COLORS.primary })],
  spacing: { before: 360, after: 180 },
  heading: docx.HeadingLevel.HEADING_1,
  keepWithNext: true
});

const h2 = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, bold: true, size: 26, color: COLORS.primary })],
  spacing: { before: 280, after: 140 },
  heading: docx.HeadingLevel.HEADING_2,
  keepWithNext: true
});

const h3 = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, bold: true, size: 22, color: COLORS.secondary })],
  spacing: { before: 200, after: 100 },
  heading: docx.HeadingLevel.HEADING_3,
  keepWithNext: true
});

const p = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, size: 21, color: COLORS.text })],
  spacing: { after: 120, line: 276 }, // 1.15 line spacing
});

const pBold = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, bold: true, size: 21, color: COLORS.text })],
  spacing: { after: 120, line: 276 },
});

const bullet = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, size: 21, color: COLORS.text })],
  bullet: { level: 0 },
  spacing: { after: 80, line: 276 },
});

const bulletRich = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, size: 21, color: COLORS.text })],
  bullet: { level: 0 },
  spacing: { after: 80, line: 276 },
});

const numbered = (text) => new docx.Paragraph({
  children: [new docx.TextRun({ text: text, size: 21, color: COLORS.text })],
  numbering: {
    reference: "doc-numbered-list",
    level: 0
  },
  spacing: { after: 80, line: 276 }
});

const pageBreak = () => new docx.Paragraph({
  children: [new docx.PageBreak()]
});

const divider = () => new docx.Paragraph({
  border: {
    bottom: {
      color: "CCCCCC",
      space: 1,
      value: "single",
      size: 6,
    },
  },
  spacing: { before: 180, after: 180 },
});

const makeTable = (widths, headers, rowsData) => {
  const tableRows = [];

  // Create Header Row
  if (headers && headers.length > 0) {
    tableRows.push(
      new docx.TableRow({
        children: headers.map((headerText, index) => {
          return new docx.TableCell({
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: headerText,
                    bold: true,
                    color: "FFFFFF",
                    size: 20
                  }),
                ],
              }),
            ],
            width: {
              size: widths[index] || 2000,
              type: docx.WidthType.DXA,
            },
            shading: {
              fill: COLORS.primary,
            },
            margins: {
              top: 120,
              bottom: 120,
              left: 150,
              right: 150,
            },
          });
        }),
      })
    );
  }

  // Create Data Rows
  rowsData.forEach((rowData) => {
    tableRows.push(
      new docx.TableRow({
        children: rowData.map((cellText, index) => {
          return new docx.TableCell({
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({ 
                    text: String(cellText),
                    size: 19
                  })
                ],
              }),
            ],
            width: {
              size: widths[index] || 2000,
              type: docx.WidthType.DXA,
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 150,
              right: 150,
            },
          });
        }),
      })
    );
  });

  return new docx.Table({
    rows: tableRows,
  });
};

module.exports = {
  // docx Exports
  Paragraph: docx.Paragraph,
  TextRun: docx.TextRun,
  AlignmentType: docx.AlignmentType,
  BorderStyle: docx.BorderStyle,
  WidthType: docx.WidthType,

  // Custom helpers
  h1,
  h2,
  h3,
  p,
  pBold,
  bullet,
  bulletRich,
  numbered,
  pageBreak,
  divider,
  makeTable,

  // Constants
  COLORS,
  FULL_WIDTH,

  // Utilities
  fs: wrappedFs
};
