import { generatePremiumReport, PDFReportData } from '../pdf-service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

jest.mock('jspdf');
jest.mock('jspdf-autotable');

describe('pdf-service', () => {
  let mockDoc: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockDoc = {
      setFontSize: jest.fn(),
      setTextColor: jest.fn(),
      text: jest.fn(),
      addPage: jest.fn(),
      splitTextToSize: jest.fn().mockReturnValue(['line 1', 'line 2']),
      save: jest.fn(),
      lastAutoTable: { finalY: 100 },
    };

    (jsPDF as any).mockImplementation(() => mockDoc);
  });

  it('should call jsPDF methods to create a report', async () => {
    const data: PDFReportData = {
      userName: 'Test User',
      birthDate: '1990-01-01',
      sections: [
        {
          title: 'Section 1',
          content: 'Some content',
          table: {
            header: ['H1', 'H2'],
            body: [['V1', 'V2']],
          },
        },
      ],
    };

    await generatePremiumReport(data);

    expect(jsPDF).toHaveBeenCalled();
    expect(mockDoc.text).toHaveBeenCalledWith('AN MENH - PREMIUM REPORT', 105, 20, { align: 'center' });
    expect(mockDoc.text).toHaveBeenCalledWith('Section 1', 20, expect.any(Number));
    expect(autoTable).toHaveBeenCalled();
    expect(mockDoc.save).toHaveBeenCalledWith('AnMenh_Report_Test User.pdf');
  });
});
