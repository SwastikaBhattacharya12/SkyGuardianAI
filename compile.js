const docx = require('docx');
const fs = require('fs');
const path = require('path');

console.log('Loading document sections...');
const s1 = require('./02_sections_1to3');
const s2 = require('./03_sections_4to6');
const s3 = require('./04_sections_7to9');
const s4 = require('./05_sections_10to12');
const s5 = require('./06_sections_13to18');

console.log('Combining sections...');
const children = [
  ...s1,
  ...s2,
  ...s3,
  ...s4,
  ...s5
];

console.log(`Loaded ${children.length} elements in total.`);

console.log('Creating document structure...');
const doc = new docx.Document({
  numbering: {
    config: [
      {
        reference: "doc-numbered-list",
        levels: [
          {
            level: 0,
            format: docx.NumberFormat.DECIMAL,
            text: "%1.",
            alignment: docx.AlignmentType.LEFT,
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {},
      children: children
    }
  ]
});

console.log('Packing and writing document...');
docx.Packer.toBuffer(doc).then((buffer) => {
  const outputPath = path.join(__dirname, 'SkyGuardianAI_PRD.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document created successfully at: ${outputPath}`);
}).catch((err) => {
  console.error('Failed to generate document:', err);
});
