/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  INITIAL_METADATA,
  INITIAL_STUDENTS,
  MODULE_DEFINITIONS,
  Student,
  SchoolMetadata,
} from './data/pbdData';
import { ReportCard } from './components/ReportCard';
import { ClassAnalytics } from './components/ClassAnalytics';
import { EditStudentModal } from './components/EditStudentModal';
import { EditSchoolModal } from './components/EditSchoolModal';
import { AddStudentModal } from './components/AddStudentModal';
import { UploadStudentsModal } from './components/UploadStudentsModal';
import { ManageStudentsModal } from './components/ManageStudentsModal';
import { BatchPrintView } from './components/BatchPrintView';
import {
  Search,
  Printer,
  Settings,
  UserPlus,
  FileText,
  BarChart3,
  Upload,
  Edit3,
  FileSpreadsheet,
} from 'lucide-react';

export default function App() {
  const [metadata, setMetadata] = useState<SchoolMetadata>(INITIAL_METADATA);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(INITIAL_STUDENTS[0]?.id || 1);
  const [currentTab, setCurrentTab] = useState<'individual' | 'analytics'>('individual');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [tpFilter, setTpFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');

  // Modals state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isBatchPrinting, setIsBatchPrinting] = useState(false);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.ic.toLowerCase().includes(q) ||
        String(student.overall) === q;

      if (!matchesSearch) return false;

      const numTp = Number(student.overall);
      if (tpFilter === 'high') return numTp >= 5;
      if (tpFilter === 'mid') return numTp === 4;
      if (tpFilter === 'low') return numTp <= 3;
      return true;
    });
  }, [students, searchQuery, tpFilter]);

  // Selected Student
  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const currentStudentIndex = useMemo(() => {
    return students.findIndex((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  // Keyboard navigation for switching students
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (currentStudentIndex > 0) {
          setSelectedStudentId(students[currentStudentIndex - 1].id);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (currentStudentIndex < students.length - 1) {
          setSelectedStudentId(students[currentStudentIndex + 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStudentIndex, students]);

  // Handlers
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) {
      const remaining = students.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setSelectedStudentId(remaining[0].id);
      }
    }
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
    setSelectedStudentId(newStudent.id);
  };

  const handleImportStudents = (newStudents: Student[], replace: boolean) => {
    if (replace) {
      const formatted = newStudents.map((s, idx) => ({ ...s, id: idx + 1 }));
      setStudents(formatted);
      if (formatted.length > 0) {
        setSelectedStudentId(formatted[0].id);
      }
    } else {
      const maxId = Math.max(...students.map((s) => s.id), 0);
      const formatted = newStudents.map((s, idx) => ({ ...s, id: maxId + idx + 1 }));
      setStudents((prev) => [...prev, ...formatted]);
    }
  };

  const handleSaveBulkStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    if (!updatedStudents.some((s) => s.id === selectedStudentId) && updatedStudents.length > 0) {
      setSelectedStudentId(updatedStudents[0].id);
    }
  };

  // Trigger batch print for all students
  const handleBatchPrint = () => {
    setIsBatchPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsBatchPrinting(false);
      }, 500);
    }, 150);
  };

  return (
    <div className="h-screen bg-slate-100/60 flex flex-col text-slate-800 antialiased selection:bg-slate-900 selection:text-white overflow-hidden">
      {/* Top Application Header */}
      <header className="no-print app-header bg-white border-b border-slate-200/80 shrink-0 sticky top-0 z-40 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            {metadata.schoolLogo ? (
              <img
                src={metadata.schoolLogo}
                alt="Logo Sekolah"
                className="w-9 h-9 object-contain drop-shadow-2xs shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wide shadow-2xs shrink-0">
                PBD
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
                  {metadata.school}
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {metadata.class}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {metadata.subject} • Sesi {metadata.academicYear} • Guru: {metadata.teacher.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* Navigation View Switcher (Segmented Controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200/60">
            <button
              onClick={() => setCurrentTab('individual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentTab === 'individual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Laporan Individu
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                currentTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analisis Kelas
            </button>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              title="Muat naik data murid dari fail CSV atau Excel"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Muat Naik</span> Fail
            </button>

            <button
              onClick={() => setIsManageModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              title="Buka paparan jadual untuk edit maklumat murid secara pukal"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Urus &</span> Edit Murid
            </button>

            <button
              onClick={() => setIsSchoolModalOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Tetapan Maklumat Sekolah & Penilaian"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              Tambah Murid
            </button>

            {/* Batch Print All */}
            <button
              onClick={handleBatchPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Semua ({students.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      {isBatchPrinting ? (
        /* Container rendered during batch print */
        <div className="p-4 bg-white">
          <BatchPrintView
            students={students}
            metadata={metadata}
            modules={MODULE_DEFINITIONS}
          />
        </div>
      ) : currentTab === 'analytics' ? (
        /* Class Analytics Tab */
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <ClassAnalytics
            students={students}
            metadata={metadata}
            modules={MODULE_DEFINITIONS}
          />
        </main>
      ) : (
        /* Individual Student Report View with Directory Sidebar */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Student Directory Sidebar - Fixed Position */}
          <aside className="no-print w-full md:w-80 lg:w-96 bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-auto md:h-full md:sticky md:top-0 z-20 overflow-hidden">
            {/* Search Box */}
            <div className="p-4 border-b border-slate-200/70 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari murid mengikut nama, IC..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>

              {/* Segmented Quick Filter */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-600">
                <button
                  onClick={() => setTpFilter('all')}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    tpFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  Semua ({students.length})
                </button>
                <button
                  onClick={() => setTpFilter('high')}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    tpFilter === 'high' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  TP 5-6
                </button>
                <button
                  onClick={() => setTpFilter('mid')}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    tpFilter === 'mid' ? 'bg-white text-sky-800 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  TP 4
                </button>
                <button
                  onClick={() => setTpFilter('low')}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    tpFilter === 'low' ? 'bg-white text-amber-800 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  TP 1-3
                </button>
              </div>
            </div>

            {/* Student List Count Header */}
            <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Senarai Murid ({filteredStudents.length})</span>
              <div className="flex items-center gap-1 normal-case font-semibold">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="p-1 hover:text-slate-900 hover:bg-slate-200/70 rounded text-slate-500 transition-colors"
                  title="Muat Naik Fail Murid (CSV/Excel)"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(true)}
                  className="p-1 hover:text-slate-900 hover:bg-slate-200/70 rounded text-slate-500 transition-colors"
                  title="Urus & Edit Senarai Murid dalam Jadual"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Student Cards */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Tiada murid sepadan dengan carian "{searchQuery}"
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const isSelected = student.id === selectedStudentId;
                  const numTp = Number(student.overall);

                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`group p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white hover:bg-slate-50/80 border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-slate-800 text-slate-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {student.id}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isSelected ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {student.name}
                          </p>
                          <div
                            className={`text-[11px] flex items-center gap-1.5 mt-0.5 ${
                              isSelected ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            <span className="font-mono text-[10px]">{student.ic}</span>
                            <span>•</span>
                            <span>{student.gender === 'L' ? 'Lelaki' : 'Perempuan'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 pl-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStudent(student);
                          }}
                          className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            isSelected ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                          title={`Kemaskini maklumat ${student.name}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-black ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : numTp >= 5
                              ? 'bg-emerald-100 text-emerald-800'
                              : numTp === 4
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          TP {student.overall}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer with Navigation Tip */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-center">
              <span>Guna kekunci &larr; &rarr; untuk navigasi pantas</span>
            </div>
          </aside>

          {/* Right Main Report Canvas */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto print:overflow-visible print:p-0 flex justify-center">
            {currentStudent ? (
              <ReportCard
                student={currentStudent}
                metadata={metadata}
                modules={MODULE_DEFINITIONS}
                onEditStudent={(s) => setEditingStudent(s)}
                onToggleFormat={(fmt) => setMetadata((prev) => ({ ...prev, reportFormat: fmt }))}
                currentIndex={currentStudentIndex + 1}
                totalStudents={students.length}
                hasPrev={currentStudentIndex > 0}
                hasNext={currentStudentIndex < students.length - 1}
                onPrevStudent={() => {
                  if (currentStudentIndex > 0) {
                    setSelectedStudentId(students[currentStudentIndex - 1].id);
                  }
                }}
                onNextStudent={() => {
                  if (currentStudentIndex < students.length - 1) {
                    setSelectedStudentId(students[currentStudentIndex + 1].id);
                  }
                }}
              />
            ) : (
              <div className="text-center py-20 text-slate-400">
                <p>Pilih seorang murid daripada senarai untuk melihat laporan.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          modules={MODULE_DEFINITIONS}
          isOpen={Boolean(editingStudent)}
          onClose={() => setEditingStudent(null)}
          onSave={handleUpdateStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      {/* Edit School Metadata Modal */}
      {isSchoolModalOpen && (
        <EditSchoolModal
          metadata={metadata}
          isOpen={isSchoolModalOpen}
          onClose={() => setIsSchoolModalOpen(false)}
          onSave={(updated) => setMetadata(updated)}
        />
      )}

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <AddStudentModal
          modules={MODULE_DEFINITIONS}
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          onAdd={handleAddStudent}
          nextId={Math.max(...students.map((s) => s.id), 0) + 1}
        />
      )}

      {/* Upload Students Modal (CSV / Excel / JSON) */}
      {isUploadModalOpen && (
        <UploadStudentsModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onImport={handleImportStudents}
          currentStudentsCount={students.length}
        />
      )}

      {/* Bulk Manage & Edit Students Modal */}
      {isManageModalOpen && (
        <ManageStudentsModal
          students={students}
          metadata={metadata}
          modules={MODULE_DEFINITIONS}
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onSave={handleSaveBulkStudents}
          onOpenUpload={() => {
            setIsManageModalOpen(false);
            setIsUploadModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
