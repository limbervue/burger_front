import jsPDF from "jspdf";
import "jspdf-autotable";
import { useImperativeHandle, forwardRef } from "react";

const PdfExpenses = forwardRef(({ data }, ref) => {
    /////////////////////////////////////////////////
    const apiUrl = import.meta.env.VITE_API_URL;
    //////////////////////////////////////////////////
    console.log(apiUrl);

    const generatePDF = (data, selectedDate, selectedTime) => {
        const dateWithTime = `${selectedDate} ${selectedTime}`;
        console.log(
            `La fecha de PDF es: ${selectedDate} y la hora de PDF es: ${selectedTime}`
        );

        const doc = new jsPDF();

        // Añadir la fecha y hora al PDF
        doc.setFontSize(12);
        doc.text(dateWithTime, 14, 10);

        // Añadir el título "Registro de Gastos"
        doc.setFontSize(16);
        doc.text("Registro de Gastos", 14, 20);

        // Usar todos los datos en lugar de filtrar
        const allData = data;

        // Añadir tabla con datos de gastos, incluyendo un ID
        doc.autoTable({
            head: [["ID", "Producto", "Paquetes", "Unidades", "Total"]],
            body: allData.map((row, index) => [
                index + 1, // ID empieza en 1
                row.producto,
                `# ${row.stock_paquetes}`,
                `# ${row.stock_unidades}`,
                isNaN(row.total) || row.total === undefined
                    ? "N/A"
                    : `$${Number(row.total).toFixed(2)}`,
            ]),
            margin: { top: 30 },
            didParseCell: (data) => {
                if (data.section === "body") {
                    const row = data.row.raw;
                    const paquetes = parseInt(row[2].substring(2), 10); //no toma en cuenta # y el espacio
                    const unidades = parseInt(row[3].substring(2), 10); //no toma en cuenta # y el espacio
                    const total =
                        row[4] === "N/A" ? 0 : parseFloat(row[4].substring(1)); //no toma en cuenta $

                    if (paquetes !== 0 || unidades !== 0 || total !== 0) {
                        data.cell.styles.fillColor = [173, 216, 230]; // Color celeste
                    }
                }
            },
        });

        // Calcular el total de los gastos incluyendo todos los datos
        const totalGastos = allData
            .reduce((total, row) => {
                const validTotal =
                    isNaN(row.total) || row.total === undefined
                        ? 0
                        : Number(row.total);
                return total + validTotal;
            }, 0)
            .toFixed(2);

        // Añadir el total de los gastos al PDF
        doc.autoTable({
            body: [[`Gastos totales:  $${totalGastos}`]],
            margin: { top: 10 },
            theme: "plain", // Sin bordes ni estilos
        });

        return doc.output("blob");
    };

    const handleGeneratePDF = async (selectedDate, selectedTime) => {
        if (!data || data.length === 0) {
            console.error("No data to generate PDF");
            return;
        }

        const pdfBlob = generatePDF(data, selectedDate, selectedTime);

        // Preparar datos para enviar al servidor
        const formData = new FormData();
        const pdfFilename = `gasto_${selectedDate}.pdf`;
        formData.append("file", pdfBlob, pdfFilename);
        formData.append("hora", selectedTime);

        console.log(
            `La fecha 2 de PDF es: ${selectedDate} y la hora 2 de PDF es: ${selectedTime}`
        );

        try {
            const response = await fetch(`${apiUrl}/pdf-expense`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error uploading PDF file");
            }
            const jsonResponse = await response.json();
            console.log("PDF uploaded successfully:", jsonResponse.url);
        } catch (error) {
            console.error("Error uploading PDF file:", error);
        }
    };

    useImperativeHandle(ref, () => ({
        handleGeneratePDF,
    }));

    return null;
});

export default PdfExpenses;
