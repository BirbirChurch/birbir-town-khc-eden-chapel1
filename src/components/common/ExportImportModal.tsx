import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  X,
  FileCode
} from 'lucide-react';
import { useChapel } from '../../context/ChapelContext';
import { exportMembersToExcel, downloadSampleTemplate, parseExcelMembers } from '../../utils/excelHelper';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { members, bulkImportMembers, resetAllData } = useChapel();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExcelExport = () => {
    exportMembersToExcel(members, `ብርብር_ኤዴን_ቻፕል_የአባላት_ዝርዝር_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(null);

    try {
      const parsed = await parseExcelMembers(file);
      if (parsed.length === 0) {
        setImportStatus('ስህተት፡ በፋይሉ ውስጥ ትክክለኛ የአባላት መረጃ አልተገኘም።');
      } else {
        bulkImportMembers(parsed);
        setImportStatus(`ተሳክቷል! ${parsed.length} አባላት በተሳካ ሁኔታ ተጭነዋል።`);
      }
    } catch (err) {
      console.error(err);
      setImportStatus('ስህተት፡ ፋይሉን ማንበብ አልተቻለም። እባክዎ የተዘጋጀውን የExcel ናሙና ቅጽ ይጠቀሙ።');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleJsonBackupDownload = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      members
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ኤዴን_ቻፕል_ምትኬ_ዳታ_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">ኤክሴል እና የውሂብ መቆጣጠሪያ</h3>
              <p className="text-xs text-slate-300 mt-0.5">የአባላት መረጃን ወደ ኤክሴል ማውረድና መጫን</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Status Message */}
          {importStatus && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
              importStatus.includes('ተሳክቷል') 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {importStatus.includes('ተሳክቷል') ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{importStatus}</span>
            </div>
          )}

          {/* Section 1: Excel Export */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>የአባላት ዝርዝር ኤክሴል ማውረድ (.xlsx)</span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              በአሁኑ ሰዓት የተመዘገቡትን {members.length} አባላት ሙሉ መረጃ (የትምህርት ደረጃ፣ ሥራ፣ ጥምቀት፣ አስራት፣ ጸላያን፣ ቡድን ወዘተ.) ወደ ኤክሴል ፋይል ያወርዳል።
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleExcelExport}
                className="px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ኤክሴል አውርድ ({members.length} አባላት)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Excel Import */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>የኤክሴል ፋይል መጫን (Import .xlsx / .csv)</span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              ከኮምፒውተርዎ ወይም ከስልክዎ የተዘጋጀ የአባላት ዝርዝር የያዘ ኤክሴል ፋይል ይጫኑ።
            </p>
            
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                className="hidden"
                id="excel-file-input"
              />
              <label
                htmlFor="excel-file-input"
                className={`px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'በመጫን ላይ...' : 'የኤክሴል ፋይል ምረጥና ጫን'}</span>
              </label>

              <button
                type="button"
                onClick={downloadSampleTemplate}
                className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>የቅጽ ናሙና አውርድ (Template)</span>
              </button>
            </div>
          </div>

          {/* Section 3: Backup & Reset */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-slate-600" />
              <span>ዳታ ምትኬና መልሶ ማዘጋጃ</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleJsonBackupDownload}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>የዳታ ምትኬ አውርድ (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('እርግጠኛ ነዎት? ሁሉንም መረጃዎች ወደ መጀመሪያው የቤተክርስቲያኑ ነባሪ ዳታ ይመልሳል?')) {
                    resetAllData();
                    setImportStatus('ተሳክቷል! መረጃዎች ወደ ነባሪው ሁኔታ ተመልሰዋል።');
                  }
                }}
                className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>ወደ ነባሪ ዳታ መልስ (Reset)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ዝጋ
          </button>
        </div>
      </div>
    </div>
  );
};
