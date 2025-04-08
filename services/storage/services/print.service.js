"use strict";
const { jsPDF } = require("jspdf"); // Use require instead of import
/**
 * Generates a dynamic PDF report with customizable column widths, data types, and formatters.
 *
 * @param {object} company - Information about the company.
 * @param {string} title - The title of the report.
 * @param {Array} columnDefinitions - An array of column definitions.
 * @param {Array} data - An array of objects, where each object represents a row of data in the table.
 * @param {string} orientation -  page orientation of the report.
 * @returns {string} The data URI of the generated PDF.
 * @throws {Error} If there is an error during report generation.
 */
const generateDynamicReport = (company, title, columnDefinitions, data, orientation) => {
    const doc = new jsPDF({
        orientation: orientation || "l", // Landscape orientation
        unit: "mm",
        format: "a4",
    });
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let startY = 70;
    const fontSize = 8;
    if (!columnDefinitions || columnDefinitions.length === 0) {
        throw new Error("Column definitions must be provided.");
    }
    try {
        // Company Info
        doc.setFontSize(10).setFont("helvetica", "bold");
        const entrepriseName = doc.splitTextToSize(company.name || "", (pageWidth - 2 * margin) * 0.8);
        doc.text(entrepriseName, margin + 30 + 5, margin + 10, { align: "left" });
        const columnSpacing = pageWidth / 2;
        doc.setFontSize(9).setFont("helvetica", "normal");
        const leftInfo = [
            "Téléphone: " + (company.phone || ""),
            "Email: " + (company.email || ""),
            ...doc.splitTextToSize("Adresse: " + (company.adresse || ""), columnSpacing - margin),
        ];
        const rightInfo = [
            "N° Impôt: " + (company.numero_impot || ""),
            "N° AG: " + (company.agrement || ""),
            "ID NAT:" + company.id_nat,
            "RCCM: " + (company.rccm || ""),
        ];
        doc.text(leftInfo, margin, margin + 25);
        doc.text(rightInfo, columnSpacing, margin + 25);
        // Report Title
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text(title, pageWidth / 2, margin + 45, { align: "center" });
        doc.line(margin, margin + 40, pageWidth - margin, margin + 40);
        // Table Setup
        const availableWidth = pageWidth - 2 * margin;
        const columnWidths = columnDefinitions.map((col) => (col.widthPercentage / 100) * availableWidth);
        const headerHeight = 10;
        // Function to draw table headers
        const drawTableHeader = (y) => {
            doc.setFontSize(fontSize).setFont("helvetica", "bold");
            doc.setLineWidth(0.1);
            doc.setDrawColor(0);
            let currentX = margin;
            for (let i = 0; i < columnDefinitions.length; i++) {
                const colDef = columnDefinitions[i];
                doc.rect(currentX, y, columnWidths[i], headerHeight);
                doc.text(colDef.header, currentX + 1, y + 5, {
                    maxWidth: columnWidths[i],
                    align: "left",
                });
                currentX += columnWidths[i];
            }
        };
        // Function to add a new page and header
        const addNewPage = () => {
            doc.addPage(orientation);
            drawTableHeader(5);
            startY = 15; // Reset Y position after new page
        };
        drawTableHeader(60); // Initial header draw
        // Table Data
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            let maxHeight = 9;
            // Prepare text for each data cell and measure the height needed
            let cellContents = [];
            for (let j = 0; j < columnDefinitions.length; j++) {
                const colDef = columnDefinitions[j];
                let formattedValue1 = "";
                let formattedValue2 = "";
                // Format the first value
                if (item[colDef.dataKey] !== undefined) {
                    let value = item[colDef.dataKey];
                    switch (colDef.dataType) {
                        case "date":
                            formattedValue1 = colDef.formatter
                                ? colDef.formatter(value)
                                : String(value);
                            break;
                        case "number":
                            formattedValue1 = colDef.formatter
                                ? colDef.formatter(value)
                                : String(value);
                            break;
                        default:
                            formattedValue1 = String(value);
                    }
                }
                // Format the second value if provided
                if (colDef.secondDataKey && item[colDef.secondDataKey] !== undefined) {
                    let value = item[colDef.secondDataKey];
                    switch (colDef.dataType) {
                        case "date":
                            formattedValue2 = colDef.secondFormatter
                                ? colDef.secondFormatter(value)
                                : String(value);
                            break;
                        case "number":
                            formattedValue2 = colDef.secondFormatter
                                ? colDef.secondFormatter(value)
                                : String(value);
                            break;
                        default:
                            formattedValue2 = String(value);
                    }
                }
                doc.setFontSize(fontSize);
                const textLines1 = doc.splitTextToSize(" " + formattedValue1, columnWidths[j]);
                const textLines2 = doc.splitTextToSize(" " + formattedValue2, columnWidths[j]); // For the second data key, add some value.
                let linesCount = textLines1.length;
                if (formattedValue2) {
                    linesCount += textLines2.length; // Add the lines from the second value.
                }
                maxHeight = Math.max(maxHeight, linesCount * (fontSize - 2)); // Reduced value to 6,7,8 depends
                cellContents.push({ textLines: textLines1, yOffset: 0 });
                if (formattedValue2) {
                    // cellContents.push({ textLines: textLines2, yOffset: textLines1.length * (fontSize - 2) }); // Offset for second value
                }
            }
            if (startY + maxHeight > pageHeight - 20 - margin) {
                addNewPage();
            }
            let currentX = margin;
            doc.setLineWidth(0.1);
            doc.setDrawColor(0);
            doc.rect(margin, startY, pageWidth - 2 * margin, maxHeight); // Full row rectangle
            // Render each data cell
            for (let j = 0; j < columnDefinitions.length; j++) {
                doc.setFontSize(fontSize);
                const colDef = columnDefinitions[j];
                const textLines = cellContents[j].textLines;
                doc.rect(currentX, startY, columnWidths[j], maxHeight);
                let yPos = startY + 4;
                textLines.forEach((line) => {
                    doc.text(line, currentX + 1, yPos, {
                        maxWidth: columnWidths[j],
                        align: "left",
                    });
                    yPos += fontSize - 2;
                });
                currentX += columnWidths[j];
            }
            startY += maxHeight;
        }
        //return doc.output('datauristring');
        return doc.output();
    }
    catch (error) {
        console.error("Error generating dynamic report:", error);
        throw error;
    }
};
module.exports = generateDynamicReport; // Use module.exports instead of export default
