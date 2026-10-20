import React, { useState, useRef } from 'react';
import { Student } from '../data/pbdData';
import { parseStudentsFromCSV, generateSampleCSV } from '../utils/csvHelper';
import { X, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, ClipboardPaste } from 'lucide-react';

interface UploadStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: Student[], replace: boolean) => void;
  currentStudentsCount: number;
}

export const UploadStudentsModal: React.FC<UploadStudentsModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentStudentsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessText = (content: string, name?: string) => {
    setErrors([]);
    // Check if JSON
    const trimmed = content.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        const list = Array.isArray(parsed) ? parsed : parsed.students || [];
        if (list.length > 0) {
          const validated = list.map((item: any, idx: number) => ({
            id: idx + 1,
            name: String(item.name || `Murid ${idx + 1}`).toUpperCase(),
            ic: String(item.ic || '100000-00-0000'),
            gender: (item.gender === 'P' || item.gender === 'F' ? 'P' : 'L') as 'L' | 'P',
            modules: Array.isArray(item.modules) ? item.modules : [4, 4, 4, 4, 4, 4, 4, 4, 4],
            overall: item.overall || 4,
            attendanceRate: item.attendanceRate || '95%',
            teacherRemarks: item.teacherRemarks || undefined,
          }));
          setParsedStudents(validated);
          if (name) setFileName(name);
          return;
        }
      } catch (e) {
        // Not valid JSON, proceed with CSV parser
      }
    }

    const result = parseStudentsFromCSV(content);
    if (result.errors.length > 0 && result.students.length === 0) {
      setErrors(result.errors);
      setParsedStudents([]);
    } else {
      setParsedStudents(result.students);
      setErrors(result.errors);
      if (name) setFileName(name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessText(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessText(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'templat_murid_pbd.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirmImport = () => {
    if (parsedStudents.length === 0) return;
    onImport(parsedStudents, importMode === 'replace');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-slate-900" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Muat Naik Data Murid (CSV / Excel / JSON)</h3>
              <p className="text-xs text-slate-500">
                Import senarai murid berserta markah modul PBD secara pukal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Method Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'file'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Fail CSV / JSON
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  activeTab === 'paste'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Salin & Tampal (Excel / Sheets)
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3 h-3 text-slate-500" />
              Muat Turun Templat CSV
            </button>
          </div>

          {/* Tab 1: File Dropzone */}
          {activeTab === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-slate-50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">
                Klik untuk memilih fail atau seret fail ke sini
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Menyokong format .CSV (Excel/SAPS/APDM) dan .JSON
              </p>
              {fileName && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Fail dipilih: {fileName}
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Copy & Paste text area */
            <div className="space-y-2">
              <label className="font-semibold text-slate-700">
                Tampal baris dari Microsoft Excel, Google Sheets, atau teks CSV:
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="No  Nama Murid  No KP  Jantina  M1  M2  M3  M4  M5  M6  M7  M8  M9  TP&#10;1   AHMAD DANIAL  100101-14-1234  L  4  4  4  5  5  5  4  4  4  4"
                className="w-full p-3 font-mono text-[11px] border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleProcessText(pastedText, 'Teks Salinan')}
                  disabled={!pastedText.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg disabled:opacity-40 hover:bg-slate-800 transition-colors"
                >
                  Proses Teks
                </button>
              </div>
            </div>
          )}

          {/* Errors banner if any */}
          {errors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Perhatian:</p>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedStudents.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    {parsedStudents.length} murid berjaya dikesan
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-slate-900"
                    />
                    Gantikan Semua ({currentStudentsCount} murid sedia ada)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-slate-900"
                    />
                    Tambah ke Senarai Semasa
                  </label>
                </div>
              </div>

              {/* Preview table snippet */}
              <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-48">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0">
                    <tr>
                      <th className="px-2 py-1.5 text-center w-8">#</th>
                      <th className="px-3 py-1.5 text-left">Nama Murid</th>
                      <th className="px-2 py-1.5 text-center">No. KP</th>
                      <th className="px-1 py-1.5 text-center">J</th>
                      <th className="px-1 py-1.5 text-center">M1-M9</th>
                      <th className="px-2 py-1.5 text-center">TP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {parsedStudents.slice(0, 10).map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-2 py-1 text-center font-medium text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-1 font-semibold text-slate-900">{s.name}</td>
                        <td className="px-2 py-1 text-center font-mono text-[10px] text-slate-600">{s.ic}</td>
                        <td className="px-1 py-1 text-center text-slate-600">{s.gender}</td>
                        <td className="px-1 py-1 text-center text-slate-600">
                          {s.modules.slice(0, 9).join(', ')}
                        </td>
                        <td className="px-2 py-1 text-center font-black text-slate-900 bg-slate-50">
                          {s.overall}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedStudents.length > 10 && (
                <p className="text-[11px] text-slate-400 italic text-right">
                  ... dan {parsedStudents.length - 10} murid lagi
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={parsedStudents.length === 0}
              className="px-5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
            >
              Import {parsedStudents.length > 0 ? `${parsedStudents.length} Murid` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
