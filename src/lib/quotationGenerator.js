import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateQuotationNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `QT-${year}${month}${day}-${random}`;
};

export const downloadPDF = async (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // Create a loading state feedback (can be handled in the component or via cursor)
  document.body.style.cursor = 'wait';
  
  try {
    // Generate canvas
    const canvas = await html2canvas(element, {
      scale: 2, // higher scale for crisp text rendering
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    // Define margins (10mm)
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', margin, margin, usableWidth, (canvas.height * usableWidth) / canvas.width);
    pdf.save(filename || `quotation-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    document.body.style.cursor = 'default';
  }
};

export const printQuotation = () => {
  window.print();
};
