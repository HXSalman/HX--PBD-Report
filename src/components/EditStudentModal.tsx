import React, { useState } from 'react';
import { Student, ModuleDefinition, getDefaultTeacherRemark, calculateAttendanceRate } from '../data/pbdData';
import { X, Trash2, Calculator, Percent } from 'lucide-react';

interface EditStudentModalProps {
  student: Student;
  modules: ModuleDefinition[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
  onDelete?: (id: number) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  modules,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Student>({ ...student });

  if (!isOpen) return null;

  const handleScoreChange = (moduleIndex: number, val: string) => {
    const updatedModules = [...formData.modules];
    if (val === '-' || val === '') {
      updatedModules[moduleIndex] = '-';
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 1 && num <= 6) {
        updatedModules[moduleIndex] = num;
      }
    }
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleAutoCalculateOverall = () => {
    // Standard Malaysian PBD overall TP calculation based on prevailing median/mode of valid modules
    const validScores = formData.modules
      .map((m) => Number(m))
      .filter((n) => !isNaN(n) && n > 0);

    if (validScores.length === 0) {
      setFormData({ ...formData, overall: 3 });
      return;
    }

    const sum = validScores.reduce((acc, curr) => acc + curr, 0);
    const avg = Math.round(sum / validScores.length);
    const calculatedTP = Math.min(6, Math.max(1, avg));

    setFormData({
      ...formData,
      overall: calculatedTP,
      teacherRemarks: getDefaultTeacherRemark(calculatedTP),
    });
  };

  const handleAutoCalculateAttendance = () => {
    const rate = calculateAttendanceRate(formData.modules, formData.overall);
    setFormData((prev) => ({ ...prev, attendanceRate: rate }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Kemaskini Maklumat & Markah Murid</h3>
            <p className="text-xs text-slate-500">ID #{student.id} • {student.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nama Penuh Murid</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Jantina</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                <option value="L">Lelaki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">No. Kad Pengenalan / MyKid</label>
              <input
                type="text"
                required
                placeholder="100719-14-0951"
                value={formData.ic}
                onChange={(e) => setFormData({ ...formData, ic: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Peratus Kehadiran</label>
                <button
                  type="button"
                  onClick={handleAutoCalculateAttendance}
                  className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  title="Kira automatik kehadiran berasaskan rekod modul murid"
                >
                  <Calculator className="w-3 h-3" />
                  Kira Auto
                </button>
              </div>
              <input
                type="text"
                placeholder="96%"
                value={formData.attendanceRate || ''}
                onChange={(e) => setFormData({ ...formData, attendanceRate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Module Assessment Scores */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Tahap Penguasaan Mengikut Modul (TP 1 - 6)
              </label>
              <button
                type="button"
                onClick={handleAutoCalculateOverall}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                Kira Purata TP Automatik
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {modules.map((mod, idx) => (
                <div key={mod.id} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                    <span>{mod.code}</span>
                    <select
                      value={formData.modules[idx] !== undefined ? formData.modules[idx] : '-'}
                      onChange={(e) => handleScoreChange(idx, e.target.value)}
                      className="px-2 py-0.5 text-xs font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="-">- (Tiada)</option>
                      <option value="1">TP 1</option>
                      <option value="2">TP 2</option>
                      <option value="3">TP 3</option>
                      <option value="4">TP 4</option>
                      <option value="5">TP 5</option>
                      <option value="6">TP 6</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate" title={mod.title}>
                    {mod.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Overall TP Selection & Teacher Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">TP Keseluruhan (Overall)</label>
              <select
                value={formData.overall}
                onChange={(e) => {
                  const newOverall = e.target.value === '-' ? '-' : Number(e.target.value);
                  setFormData({
                    ...formData,
                    overall: newOverall,
                    teacherRemarks: getDefaultTeacherRemark(newOverall),
                  });
                }}
                className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              >
                <option value="-">-</option>
                <option value="1">TP 1 (Tahu)</option>
                <option value="2">TP 2 (Tahu & Faham)</option>
                <option value="3">TP 3 (Tahu, Faham, Boleh Buat)</option>
                <option value="4">TP 4 (Beradab)</option>
                <option value="5">TP 5 (Beradab Terpuji)</option>
                <option value="6">TP 6 (Beradab Mithali)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ulasan Guru Mata Pelajaran</label>
              <textarea
                rows={2}
                value={formData.teacherRemarks || getDefaultTeacherRemark(formData.overall)}
                onChange={(e) => setFormData({ ...formData, teacherRemarks: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                placeholder="Ulasan peribadi mengenai pencapaian dan kemajuan murid..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Adakah anda pasti mahu memadam murid ${formData.name}?`)) {
                    onDelete(formData.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Padam Murid
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
