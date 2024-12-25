const fs = require("fs");
const path = require("path");
const { DOMParser, XMLSerializer } = require("xmldom");
const xmlFormat = require("xml-formatter");

if (process.argv.length < 4) {
  console.error("Usage: script.js <input.xlf> <locale.xlf>");
  process.exit(1);
}

const [inputFile, localeFile] = process.argv.slice(2);

// Load XML files
function loadXml(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");
  return new DOMParser().parseFromString(content, "application/xml");
}

// Save XML file
function saveXml(filePath, xmlDoc) {
  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  const formattedXml = xmlFormat(xmlString, {
    indentation: "  ",
    collapseContent: true,
  });
  fs.writeFileSync(filePath, formattedXml, "utf8");
  console.log(`File saved: ${filePath}`);
}

// Extract translation units from an XLF document
function extractTranslationUnits(doc) {
  const units = {};
  const transUnits = doc.getElementsByTagName("trans-unit");

  for (let i = 0; i < transUnits.length; i++) {
    const unit = transUnits[i];
    const id = unit.getAttribute("id");
    const target = unit.getElementsByTagName('target')[0];
    if (id) {
      units[id] = { element: unit, target };
    }
  }

  return units;
}

function mergeTranslations(inputUnits, localeUnits) {
    Object.keys(inputUnits).forEach((id) => {
        const inputUnit = inputUnits[id];
        const sourceElement = inputUnit.element.getElementsByTagName('source')[0];
        let targetElement = inputUnit.element.getElementsByTagName('target')[0];
    
        if (localeUnits[id] && localeUnits[id].target) {
          // Use the target element from the localized file if it exists
          const localeTargetElement = localeUnits[id].target;
          if (targetElement) {
            targetElement.textContent = localeTargetElement.textContent;
          } else {
            targetElement = inputUnit.element.ownerDocument.createElement('target');
            targetElement.textContent = localeTargetElement.textContent;
            sourceElement.parentNode.insertBefore(targetElement, sourceElement.nextSibling);
          }
        } else {
          // No localized target exists, use the source as the target
          if (!targetElement) {
            targetElement = inputUnit.element.ownerDocument.createElement('target');
            targetElement.textContent = sourceElement?.textContent || '';
            sourceElement.parentNode.insertBefore(targetElement, sourceElement.nextSibling);
          } else {
            targetElement.textContent = sourceElement?.textContent || '';
          }
        }
      });
}

// Main execution
const inputDoc = loadXml(inputFile);
const localeDoc = loadXml(localeFile);

const inputUnits = extractTranslationUnits(inputDoc);
const localeUnits = extractTranslationUnits(localeDoc);

mergeTranslations(inputUnits, localeUnits);

// Save the merged result back to the input file
saveXml(localeFile, inputDoc);
