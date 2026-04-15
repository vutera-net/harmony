export interface PDFReportData {
  userName: string;
  birthDate: string;
  sections: {
    title: string;
    content: string | string[];
    table?: {
      header: string[];
      body: any[][];
    };
  }[];
}

export const generatePremiumReport = async (data: PDFReportData) => {
  // Use the explicit browser bundle to avoid fflate node.cjs issues during SSR
  const jsPDF = (await import('jspdf/dist/jspdf.es.min.js')).default;
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  
  // Note: Standard jsPDF fonts don't support Vietnamese. 
  // In a real production app, we would load a .ttf font here.
  // For this implementation, we use a compatible font or a simplified version.
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(184, 134, 11); // Gold-ish
  doc.text("AN MENH - PREMIUM REPORT", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`User: ${data.userName} | Birth Date: ${data.birthDate}`, 105, 30, { align: 'center' });
  
  let currentY = 40;
  
  data.sections.forEach((section) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Section Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(section.title, 20, currentY);
    currentY += 10;
    
    // Content
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const text = Array.isArray(section.content) ? section.content.join('\\n') : section.content;
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, currentY);
    currentY += (splitText.length * 7);
    
    // Table if exists
    if (section.table) {
      autoTable(doc, {
        startY: currentY,
        head: [section.table.header],
        body: section.table.body,
        theme: 'striped',
        headStyles: { fillColor: [184, 134, 11] },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }
    
    currentY += 10;
  });
  
  doc.save(`AnMenh_Report_${data.userName}.pdf`);
};
