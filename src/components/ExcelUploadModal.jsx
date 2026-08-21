import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  X, 
  Download, 
  ArrowRight,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ExcelUploadModal({ isOpen, onClose }) {
  const { bulkImportStudents, schools } = useAuth();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [previewRows, setPreviewRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (uploadedFile) => {
    if (!uploadedFile) return;
    setErrorMsg('');
    setIsSuccess(false);

    const validExtensions = ['xlsx', 'xls', 'csv'];
    const fileExt = uploadedFile.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      setErrorMsg('Please upload a valid Excel file (.xlsx, .xls) or .csv');
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (json.length === 0) {
          setErrorMsg('The selected spreadsheet is empty.');
          setIsProcessing(false);
          return;
        }

        const formattedStudents = json.map((row, index) => {
          const name = row['Student Name'] || row['StudentName'] || row['Name'] || `Student ${index + 1}`;
          const parent = row['Parent Name'] || row['ParentName'] || row['Father Name'] || 'Parent';
          const phone = String(row['Parent Phone'] || row['Phone'] || row['Mobile'] || '9876543210').replace(/\D/g, '').slice(-10);
          const school = row['School Name'] || row['School'] || schools[0]?.name || 'Fravashi International Academy';
          const grade = row['Grade'] || row['Class'] || 'Grade 5';
          const bus = row['Bus No'] || row['Bus'] || 'Bus #1';
          const route = row['Route Name'] || row['Route'] || 'Route 1: Gangapur Road - College Road';
          const stop = row['Stop Name'] || row['Pickup Stop'] || 'Main Road Stop';
          const pickup = row['Pickup Time'] || '07:15 AM';
          const drop = row['Drop Time'] || '02:30 PM';
          const totalFee = Number(row['Total Fee'] || row['TotalFee'] || row['Annual Fee'] || 32000);
          const paidFee = Number(row['Paid Fee'] || row['PaidFee'] || 0);

          return {
            id: `STU-IMP-${Date.now()}-${index}`,
            rollNo: row['Roll No'] || `NSK-${index + 101}`,
            studentName: name,
            parentName: parent,
            parentPhone: phone || '9876543210',
            alternatePhone: '',
            email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
            schoolName: school,
            schoolId: 'SCH-IMP',
            grade: grade,
            busNo: bus,
            busPlate: 'MH-15-RN-4501',
            routeId: 'R1',
            routeName: route,
            stopName: stop,
            pickupTime: pickup,
            dropTime: drop,
            liveStatus: {
              morningStatus: 'Scheduled',
              eveningStatus: 'Scheduled',
              isLiveOnBus: false
            },
            feeDetails: (() => {
              const due = Math.max(0, totalFee - paidFee);
              const p1Target = Math.round(totalFee / 2);
              const p2Target = totalFee - p1Target;
              const p1Paid = Math.min(paidFee, p1Target);
              const p2Paid = Math.max(0, paidFee - p1Target);
              const p1Due = Math.max(0, p1Target - p1Paid);
              const p2Due = Math.max(0, p2Target - p2Paid);

              return {
                totalAnnualFee: totalFee,
                paidAmount: paidFee,
                dueAmount: due,
                phase1Amount: p1Target,
                phase1Paid: p1Paid,
                phase1Status: p1Due === 0 ? 'PAID' : (p1Paid > 0 ? 'PARTIAL' : 'DUE'),
                phase2Amount: p2Target,
                phase2Paid: p2Paid,
                phase2Status: p2Due === 0 ? 'PAID' : (p2Paid > 0 ? 'PARTIAL' : 'DUE'),
                status: paidFee >= totalFee ? 'PAID' : (paidFee > 0 ? 'PARTIAL' : 'DUE'),
                lastPaymentDate: paidFee > 0 ? new Date().toISOString().split('T')[0] : 'N/A',
                lastReceiptNo: `REC-IMP-${100 + index}`,
                nextDueDate: p2Due > 0 ? '2026-10-15 (Phase 2 Due)' : 'Fully Paid for 2026-27',
                paymentMode: 'Excel Import',
                paymentsHistory: paidFee > 0 ? [
                  {
                    receiptNo: `REC-IMP-${100 + index}`,
                    amount: paidFee,
                    date: new Date().toISOString().split('T')[0],
                    mode: 'Excel Import',
                    term: 'Initial Balance'
                  }
                ] : []
              };
            })()
          };
        });

        setParsedData(formattedStudents);
        setPreviewRows(formattedStudents.slice(0, 5));
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to parse Excel file. Please ensure valid format.');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    bulkImportStudents(parsedData);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setFile(null);
      setParsedData([]);
    }, 1500);
  };

  const downloadSampleTemplate = () => {
    const templateData = [
      {
        "Roll No": "FIA-8A-01",
        "Student Name": "Arjun Deshmukh",
        "Parent Name": "Rajendra Deshmukh",
        "Parent Phone": "9823123456",
        "School Name": "Fravashi International Academy",
        "Grade": "Grade 8-A",
        "Bus No": "Bus #1",
        "Route Name": "Route 1: Gangapur Road - College Road",
        "Stop Name": "Jehan Circle",
        "Pickup Time": "07:15 AM",
        "Drop Time": "02:45 PM",
        "Total Fee": 32000,
        "Paid Fee": 16000
      },
      {
        "Roll No": "WHIS-5B-12",
        "Student Name": "Pooja Hegde",
        "Parent Name": "Suresh Hegde",
        "Parent Phone": "9890123789",
        "School Name": "Wisdom High International School",
        "Grade": "Grade 5-B",
        "Bus No": "Bus #2",
        "Route Name": "Route 2: Indira Nagar - Mumbai Naka",
        "Stop Name": "Indira Nagar Jogging Track",
        "Pickup Time": "07:00 AM",
        "Drop Time": "03:00 PM",
        "Total Fee": 36000,
        "Paid Fee": 36000
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students_Template");
    XLSX.writeFile(workbook, "Siddharth_Bus_Students_Template_Nashik.xlsx");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231A12]/60 backdrop-blur-xs animate-in fade-in duration-200 text-left">
      <div className="bg-white border-2 border-[#B08D57] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col text-[#231A12]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F5E8D3]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#FFF4E8] text-[#D97B29] border border-[#B08D57]/40">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#231A12] font-heading">
                Import Students from Excel / CSV
              </h2>
              <p className="text-xs text-[#7A6A5C]">
                Bulk register students, route stops, and fee structures in seconds
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A6A5C] hover:text-[#231A12] hover:bg-[#FBF3E7] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          
          {/* Dropzone */}
          {!file && (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#B08D57] hover:border-[#D97B29] bg-[#FBF3E7]/50 hover:bg-[#FBF3E7] rounded-2xl p-8 text-center cursor-pointer transition-all group"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={(e) => handleFile(e.target.files[0])}
                accept=".xlsx, .xls, .csv"
                className="hidden" 
              />
              <div className="w-16 h-16 rounded-full bg-white text-[#D97B29] border border-[#B08D57]/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-[#231A12] mb-1">
                Drag and drop your Excel (.xlsx, .xls) or .csv file here
              </h4>
              <p className="text-xs text-[#7A6A5C] max-w-sm mx-auto mb-4">
                Upload student rosters with phone numbers, school names, bus routes, and fee structures.
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97B29] to-[#C4621C] hover:from-[#C4621C] hover:to-[#B55515] text-white text-xs font-black shadow-md shadow-[#D97B29]/30">
                Browse Files
              </div>
            </div>
          )}

          {/* Download Sample Template */}
          <div className="flex items-center justify-between bg-[#FBF3E7]/70 border border-[#B08D57]/40 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[#D97B29] flex-shrink-0" />
              <div>
                <div className="text-xs font-black text-[#231A12]">Need the correct column format?</div>
                <div className="text-[11px] text-[#7A6A5C]">Download our pre-formatted spreadsheet template with sample Nashik student records.</div>
              </div>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FBF3E7] text-[#231A12] text-xs font-bold border border-[#B08D57] transition-colors flex-shrink-0 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#D97B29]" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-bold">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="p-6 bg-[#EAF2EC] border border-[#6B8F71] rounded-2xl text-center space-y-2 animate-in fade-in">
              <Check className="w-12 h-12 text-[#6B8F71] mx-auto animate-bounce" />
              <h3 className="text-lg font-black text-[#231A12]">Import Successful!</h3>
              <p className="text-xs text-[#2F4F35]">
                {parsedData.length} students have been successfully registered into the directory.
              </p>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedData.length > 0 && !isSuccess && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black text-[#231A12]">
                  Parsed <span className="text-[#D97B29]">{parsedData.length}</span> Student Records (Showing First {previewRows.length})
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setParsedData([]);
                  }}
                  className="flex items-center gap-1 text-xs text-red-600 hover:underline font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear &amp; Upload Another</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#B08D57]/40 bg-white">
                <table className="w-full text-left text-xs text-[#231A12]">
                  <thead className="bg-[#FBF3E7] text-[#3B2314] uppercase text-[10px] font-black">
                    <tr>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Parent Phone</th>
                      <th className="p-3">School</th>
                      <th className="p-3">Bus Route</th>
                      <th className="p-3">Total Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5E8D3]">
                    {previewRows.map((r, i) => (
                      <tr key={i}>
                        <td className="p-3 font-mono font-bold">{r.rollNo}</td>
                        <td className="p-3 font-bold text-[#231A12]">{r.studentName}</td>
                        <td className="p-3 font-mono text-[#7A6A5C]">{r.parentPhone}</td>
                        <td className="p-3">{r.schoolName} ({r.grade})</td>
                        <td className="p-3 text-[#D97B29] font-semibold">{r.busNo}</td>
                        <td className="p-3 font-mono font-black text-[#2F4F35]">₹{r.feeDetails.totalAnnualFee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#F5E8D3] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#F5E8D3] hover:bg-[#B08D57]/30 text-[#231A12] text-xs font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {parsedData.length > 0 && !isSuccess && (
            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D97B29] to-[#C4621C] hover:from-[#C4621C] hover:to-[#B55515] text-white text-xs font-black shadow-md shadow-[#D97B29]/30 cursor-pointer"
            >
              <span>Confirm &amp; Import {parsedData.length} Students</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
