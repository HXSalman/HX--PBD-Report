import React, { useState } from 'react';
import { Student, ModuleDefinition, getDefaultTeacherRemark, calculateAttendanceRate } from '../data/pbdData';
import { X, UserPlus, Calculator } from 'lucide-react';

interface AddStudentModalProps {
  modules: ModuleDefinition[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newStudent: Student) => void;
  nextId: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  modules,
  isOpen,
  onClose,
  onAdd,
  nextId,
}) => {
  const [name, setName] = useState('');
  const [ic, setIc] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [overall, setOverall] = useState<number>(4);
  const [moduleScores, setModuleScores] = useState<(number | string)[]>([4, 4, 4, 4, 4, 4, 4, 4, 4]);
  const [attendanceRate, setAttendanceRate] = useState<string>('95%');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: nextId,
      name: name.trim().toUpperCase(),
      ic: ic.trim(),
      gender,
      modules: [...moduleScores],
      overall,
      attendanceRate: attendanceRate.trim() || '95%',
      teacherRemarks: getDefaultTeacherRemark(overall),
    };
    onAdd(newStudent);
    onClose();
  };

  const handleAutoCalculateAttendance = () => {
    setAttendanceRate(calculateAttendanceRate(moduleScores, overall));
  };

  const handleScoreChange = (idx: number, val: string) => {
    const updated = [...moduleScores];
    updated[idx] = val === '-' ? '-' : Number(val);
    setModuleScores(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-slate-900" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Tambah Murid Baharu</h3>
              <p className="text-xs text-slate-500">Daftar murid baharu ke dalam sistem PBD kelas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Penuh Murid</label>
            <input
              type="text"
              required
              placeholder="CONTOH: AHMAD DANIAL BIN ZAINAL"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">No. Kad Pengenalan / MyKid</label>
              <input
                type="text"
                required
                placeholder="100512-14-1234"
                value={ic}
                onChange={(e) => setIc(e.target.value)}
                className="w-full px-3 py-2 font-mono border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Jantina</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              >
                <option value="L">Lelaki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="font-bold text-slate-900 uppercase tracking-wide">
              Markah Modul Awal (TP 1 - 6)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {modules.map((m, idx) => (
                <div key={m.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>{m.code}</span>
                    <select
                      value={moduleScores[idx]}
                      onChange={(e) => handleScoreChange(idx, e.target.value)}
                      className="px-1 py-0.5 border border-slate-300 rounded bg-white text-xs"
                    >
                      <option value="1">TP 1</option>
                      <option value="2">TP 2</option>
                      <option value="3">TP 3</option>
                      <option value="4">TP 4</option>
                      <option value="5">TP 5</option>
                      <option value="6">TP 6</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-200">
            <label className="font-semibold text-slate-700">Tahap Penguasaan Keseluruhan (Overall TP)</label>
            <select
              value={overall}
              onChange={(e) => setOverall(Number(e.target.value))}
              className="w-full px-3 py-2 font-bold border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
            >
              <option value="1">TP 1 (Tahu)</option>
              <option value="2">TP 2 (Tahu & Faham)</option>
              <option value="3">TP 3 (Tahu, Faham & Boleh Buat)</option>
              <option value="4">TP 4 (Beradab)</option>
              <option value="5">TP 5 (Beradab Terpuji)</option>
              <option value="6">TP 6 (Beradab Mithali)</option>
            </select>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Peratus Kehadiran</label>
              <button
                type="button"
                onClick={handleAutoCalculateAttendance}
                className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Kira automatik kehadiran berasaskan modul"
              >
                <Calculator className="w-3 h-3" />
                Kira Auto
              </button>
            </div>
            <input
              type="text"
              placeholder="95%"
              value={attendanceRate}
              onChange={(e) => setAttendanceRate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
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
              Daftar Murid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
