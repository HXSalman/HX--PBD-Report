import React, { useState } from 'react';
import { Student, ModuleDefinition, SchoolMetadata, getDefaultTeacherRemark, calculateAttendanceRate } from '../data/pbdData';
import { exportStudentsToCSV } from '../utils/csvHelper';
import { X, Plus, Trash2, Download, Upload, Search, Calculator, Users, Save, Check, Percent } from 'lucide-react';

interface ManageStudentsModalProps {
  students: Student[];
  metadata: SchoolMetadata;
  modules: ModuleDefinition[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudents: Student[]) => void;
  onOpenUpload: () => void;
}

export const ManageStudentsModal: React.FC<ManageStudentsModalProps> = ({
  students,
  metadata,
  modules,
  isOpen,
  onClose,
  onSave,
  onOpenUpload,
}) => {
  const [studentList, setStudentList] = useState<Student[]>(() =>
    students.map((s) => ({ ...s, modules: [...s.modules] }))
  );
  const [search, setSearch] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // Auto-calculate attendance rate by default
  const [autoCalculateAttendance, setAutoCalculateAttendance] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFieldChange = (idx: number, field: keyof Student, val: any) => {
    const updated = [...studentList];
    const current = updated[idx];
    let updatedStudent = { ...current, [field]: val };

    // When overall TP changes and auto calculate is active, also sync attendance and remarks
    if (field === 'overall' && autoCalculateAttendance) {
      updatedStudent = {
        ...updatedStudent,
        attendanceRate: calculateAttendanceRate(current.modules, val),
        teacherRemarks: getDefaultTeacherRemark(val),
      };
    }

    updated[idx] = updatedStudent;
    setStudentList(updated);
    setHasChanges(true);
  };

  const handleModuleScoreChange = (studentIdx: number, moduleIdx: number, val: string) => {
    const updated = [...studentList];
    const newModules = [...updated[studentIdx].modules];
    newModules[moduleIdx] = val === '-' ? '-' : Number(val);
    
    // Automatically recalculate attendance percentage by default when marks are updated
    const newAttendance = autoCalculateAttendance
      ? calculateAttendanceRate(newModules, updated[studentIdx].overall)
      : updated[studentIdx].attendanceRate;

    updated[studentIdx] = {
      ...updated[studentIdx],
      modules: newModules,
      attendanceRate: newAttendance || updated[studentIdx].attendanceRate,
    };
    setStudentList(updated);
    setHasChanges(true);
  };

  const handleAutoCalculateTP = (studentIdx: number) => {
    const student = studentList[studentIdx];
    const validScores = student.modules
      .map((m) => Number(m))
      .filter((n) => !isNaN(n) && n > 0);

    if (validScores.length > 0) {
      const sum = validScores.reduce((acc, curr) => acc + curr, 0);
      const avg = Math.round(sum / validScores.length);
      const calculatedTP = Math.min(6, Math.max(1, avg));

      const newAttendance = autoCalculateAttendance
        ? calculateAttendanceRate(student.modules, calculatedTP)
        : student.attendanceRate;

      const updated = [...studentList];
      updated[studentIdx] = {
        ...student,
        overall: calculatedTP,
        teacherRemarks: getDefaultTeacherRemark(calculatedTP),
        attendanceRate: newAttendance,
      };
      setStudentList(updated);
      setHasChanges(true);
    }
  };

  const handleAutoCalculateAll = () => {
    const updated = studentList.map((student) => {
      const validScores = student.modules
        .map((m) => Number(m))
        .filter((n) => !isNaN(n) && n > 0);

      if (validScores.length > 0) {
        const sum = validScores.reduce((acc, curr) => acc + curr, 0);
        const avg = Math.round(sum / validScores.length);
        const calculatedTP = Math.min(6, Math.max(1, avg));
        return {
          ...student,
          overall: calculatedTP,
          attendanceRate: autoCalculateAttendance
            ? calculateAttendanceRate(student.modules, calculatedTP)
            : student.attendanceRate,
          teacherRemarks: student.teacherRemarks || getDefaultTeacherRemark(calculatedTP),
        };
      }
      return student;
    });

    setStudentList(updated);
    setHasChanges(true);
  };

  const handleAutoCalculateAttendance = (studentIdx: number) => {
    const student = studentList[studentIdx];
    const calculatedRate = calculateAttendanceRate(student.modules, student.overall);
    const updated = [...studentList];
    updated[studentIdx] = {
      ...student,
      attendanceRate: calculatedRate,
    };
    setStudentList(updated);
    setHasChanges(true);
  };

  const handleAutoCalculateAllAttendance = () => {
    const updated = studentList.map((student) => ({
      ...student,
      attendanceRate: calculateAttendanceRate(student.modules, student.overall),
    }));
    setStudentList(updated);
    setHasChanges(true);
  };

  const handleAddRow = () => {
    const nextId = Math.max(...studentList.map((s) => s.id), 0) + 1;
    const defaultModules = [4, 4, 4, 4, 4, 4, 4, 4, 4];
    const calculatedAttendance = calculateAttendanceRate(defaultModules, 4);
    const newStudent: Student = {
      id: nextId,
      name: `MURID BARU ${nextId}`,
      ic: `100101-14-${String(nextId).padStart(4, '0')}`,
      gender: 'L',
      modules: defaultModules,
      overall: 4,
      attendanceRate: calculatedAttendance,
      teacherRemarks: getDefaultTeacherRemark(4),
    };
    setStudentList([...studentList, newStudent]);
    setHasChanges(true);
  };

  const handleDeleteRow = (id: number) => {
    setStudentList(studentList.filter((s) => s.id !== id));
    setHasChanges(true);
  };

  const handleExportCSV = () => {
    const csvContent = exportStudentsToCSV(studentList, metadata);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Senarai_Murid_PBD_${metadata.class.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveAll = () => {
    onSave(studentList);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 400);
  };

  // Filtered view
  const filteredList = studentList.filter((s) => {
    const q = search.toLowerCase().trim();
    return !q || s.name.toLowerCase().includes(q) || s.ic.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Urus & Kemaskini Maklumat Murid</h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                  {studentList.length} Murid
                </span>
                {hasChanges && (
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold animate-pulse">
                    Ada perubahan belum disimpan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {metadata.school} • {metadata.class} • {metadata.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Muat naik data dari fail CSV atau Excel"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Muat Naik Fail
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Eksport data kelas ke fail CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Eksport CSV
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau No. KP..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleAutoCalculateAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              title="Kira purata keseluruhan bagi semua murid berasaskan modul"
            >
              <Calculator className="w-3.5 h-3.5 text-sky-600" />
              Kira Semua Purata TP
            </button>

            <button
              onClick={handleAutoCalculateAllAttendance}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
              title="Kira automatik peratus kehadiran semua murid berasaskan modul"
            >
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
              Kira Semua Kehadiran
            </button>
          </div>

          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Baris Murid
          </button>
        </div>

        {/* Spreadsheet Table Container */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 select-none">
                <tr>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-center w-10 font-bold">#</th>
                  <th className="border-b border-r border-slate-200 px-3 py-2 text-left min-w-[200px] font-bold">
                    Nama Penuh Murid
                  </th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-left min-w-[130px] font-bold">
                    No. Kad Pengenalan
                  </th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-center w-16 font-bold">
                    Jantina
                  </th>
                  {modules.map((m) => (
                    <th
                      key={m.id}
                      className="border-b border-r border-slate-200 px-1 py-2 text-center w-11 font-bold"
                      title={m.title}
                    >
                      M{m.id}
                    </th>
                  ))}
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-center w-16 font-bold bg-slate-200/70">
                    TP
                  </th>
                  <th className="border-b border-r border-slate-200 px-2 py-2 text-center w-24 font-bold bg-slate-200/50">
                    Kehadiran
                  </th>
                  <th className="border-b border-slate-200 px-2 py-2 text-center w-12 font-bold">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredList.map((student) => {
                  const originalIndex = studentList.findIndex((s) => s.id === student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="border-r border-slate-200 px-2 py-1 text-center font-bold text-slate-400">
                        {student.id}
                      </td>

                      {/* Name input */}
                      <td className="border-r border-slate-200 px-2 py-1">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) =>
                            handleFieldChange(originalIndex, 'name', e.target.value.toUpperCase())
                          }
                          className="w-full px-2 py-1 text-xs font-semibold uppercase rounded hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </td>

                      {/* IC input */}
                      <td className="border-r border-slate-200 px-2 py-1">
                        <input
                          type="text"
                          value={student.ic}
                          onChange={(e) =>
                            handleFieldChange(originalIndex, 'ic', e.target.value)
                          }
                          className="w-full px-2 py-1 text-xs font-mono rounded hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </td>

                      {/* Gender select */}
                      <td className="border-r border-slate-200 px-1 py-1 text-center">
                        <select
                          value={student.gender}
                          onChange={(e) =>
                            handleFieldChange(originalIndex, 'gender', e.target.value as 'L' | 'P')
                          }
                          className="px-1.5 py-1 text-xs font-semibold rounded hover:bg-slate-100 focus:ring-1 focus:ring-slate-900"
                        >
                          <option value="L">L</option>
                          <option value="P">P</option>
                        </select>
                      </td>

                      {/* Module scores M1 - M9 */}
                      {modules.map((m, mIdx) => (
                        <td key={m.id} className="border-r border-slate-200 px-0.5 py-1 text-center">
                          <select
                            value={student.modules[mIdx] !== undefined ? student.modules[mIdx] : '-'}
                            onChange={(e) =>
                              handleModuleScoreChange(originalIndex, mIdx, e.target.value)
                            }
                            className={`w-10 py-1 text-center font-bold text-xs rounded transition-colors ${
                              student.modules[mIdx] === '-'
                                ? 'text-slate-400'
                                : 'text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <option value="-">-</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                          </select>
                        </td>
                      ))}

                      {/* Overall TP */}
                      <td className="border-r border-slate-200 px-1 py-1 text-center bg-slate-50">
                        <div className="flex items-center justify-center gap-1">
                          <select
                            value={student.overall}
                            onChange={(e) => {
                              const val = e.target.value === '-' ? '-' : Number(e.target.value);
                              handleFieldChange(originalIndex, 'overall', val);
                            }}
                            className="font-black text-xs px-1 py-1 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-slate-900"
                          >
                            <option value="-">-</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAutoCalculateTP(originalIndex)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                            title="Kira automatik berasaskan modul"
                          >
                            <Calculator className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Attendance (Auto-calculate button + manual edit input) */}
                      <td className="border-r border-slate-200 px-1 py-1 text-center bg-slate-50/50">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            value={student.attendanceRate || '95%'}
                            onChange={(e) =>
                              handleFieldChange(originalIndex, 'attendanceRate', e.target.value)
                            }
                            placeholder="95%"
                            className="w-13 text-center px-1.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 rounded hover:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden transition-colors"
                            title="Edit peratus kehadiran murid ini secara manual"
                          />
                          <button
                            type="button"
                            onClick={() => handleAutoCalculateAttendance(originalIndex)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Kira automatik kehadiran berasaskan modul murid ini"
                          >
                            <Calculator className="w-3 h-3 text-slate-500 hover:text-emerald-600" />
                          </button>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="px-1 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(student.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Padam murid ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-white shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>{filteredList.length} murid dipaparkan</span>
            {hasChanges && (
              <span className="text-amber-600 font-semibold">• Sila klik Simpan untuk mengemas kini laporan</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-6 py-2 font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-xs transition-colors"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Berjaya Disimpan!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Semua Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
