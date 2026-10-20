import React, { useState } from 'react';
import { Student, SchoolMetadata, ModuleDefinition, TP_RUBRIC_REFERENCE, getDefaultTeacherRemark } from '../data/pbdData';
import { Printer, ChevronLeft, ChevronRight, Edit3, Award, CheckCircle2, UserCheck, LayoutTemplate } from 'lucide-react';
import { OfficialKpmReportCard } from './OfficialKpmReportCard';

interface ReportCardProps {
  student: Student;
  metadata: SchoolMetadata;
  modules: ModuleDefinition[];
  onEditStudent: (student: Student) => void;
  onToggleFormat?: (format: 'official_kpm' | 'modern') => void;
  onPrevStudent?: () => void;
  onNextStudent?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalStudents?: number;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  student,
  metadata,
  modules,
  onEditStudent,
  onToggleFormat,
  onPrevStudent,
  onNextStudent,
  hasPrev,
  hasNext,
  currentIndex = 1,
  totalStudents = 24,
}) => {
  const [showRubric, setShowRubric] = useState(false);
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [customRemark, setCustomRemark] = useState(student.teacherRemarks || getDefaultTeacherRemark(student.overall));

  const isOfficialFormat = metadata.reportFormat !== 'modern';

  const handleSaveRemark = () => {
    onEditStudent({
      ...student,
      teacherRemarks: customRemark,
    });
    setIsEditingRemark(false);
  };

  const currentRemark = student.teacherRemarks || customRemark || getDefaultTeacherRemark(student.overall);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Toolbar (Screen Only - Fixed / Sticky Position on scroll) */}
      <div className="no-print sticky top-0 z-30 w-full max-w-4xl mb-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 transition-all">
        {/* Navigation & Student Counter */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevStudent}
            disabled={!hasPrev}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Murid Sebelumnya (Shortcut: ←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-500">
            Murid <span className="font-bold text-slate-800">{currentIndex}</span> daripada <span className="font-bold text-slate-800">{totalStudents}</span>
          </span>
          <button
            onClick={onNextStudent}
            disabled={!hasNext}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Murid Seterusnya (Shortcut: →)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Format Switcher & Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Switcher Segmented Control */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-semibold border border-slate-200/80">
            <button
              type="button"
              onClick={() => onToggleFormat?.('official_kpm')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                isOfficialFormat
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Format Rasmi Kementerian Pendidikan Malaysia (Lampiran)"
            >
              <LayoutTemplate className="w-3 h-3" />
              <span>Format Rasmi KPM</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleFormat?.('modern')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                !isOfficialFormat
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Format Moden Standard PBD"
            >
              <span>Format Moden</span>
            </button>
          </div>

          {!isOfficialFormat && (
            <button
              onClick={() => setShowRubric(!showRubric)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                showRubric
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showRubric ? 'Tutup Skala TP' : 'Skala TP (1-6)'}
            </button>
          )}

          <button
            onClick={() => onEditStudent(student)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            Kemaskini Markah
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Laporan (A4)
          </button>
        </div>
      </div>

      {/* Render Selected Format */}
      {isOfficialFormat ? (
        /* Format 2: Official KPM / BPK Format (Matching Image Attachment) */
        <OfficialKpmReportCard
          student={student}
          metadata={metadata}
          modules={modules}
        />
      ) : (
        /* Format 1: Modern Format */
        <div className="report-page-sheet bg-white border border-slate-200/90 shadow-sm rounded-lg w-full max-w-4xl p-10 md:p-12 transition-all">
          {/* Header */}
          <div className="text-center pb-6 mb-6 border-b-2 border-slate-900">
            <div className="flex items-center justify-center gap-3 mb-2">
              {metadata.schoolLogo ? (
                <img
                  src={metadata.schoolLogo}
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wider">
                  HX
                </div>
              )}
              <div className="text-left">
                <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                  {metadata.ministryHeader}
                </p>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  {metadata.school}
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {metadata.address}, {metadata.state} {metadata.schoolCode ? `• KOD SEKOLAH: ${metadata.schoolCode}` : ''}
            </p>
            <div className="mt-3">
              <span className="inline-block bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded">
                LAPORAN PENTAKSIRAN BILIK DARJAH (PBD) AKADEMIK
              </span>
            </div>
          </div>

          {/* Student & Assessment Particulars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 bg-slate-50/70 border border-slate-200 rounded-lg p-5 mb-6 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Nama Murid</span>
              <span className="font-bold text-slate-900 text-right">{student.name}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">No. Kad Pengenalan / MyKid</span>
              <span className="font-bold text-slate-900 font-mono tracking-tight">{student.ic}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Tingkatan / Kelas</span>
              <span className="font-bold text-slate-900">{metadata.class}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Jantina</span>
              <span className="font-bold text-slate-900">
                {student.gender === 'L' ? 'Lelaki (L)' : 'Perempuan (P)'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Mata Pelajaran</span>
              <span className="font-bold text-slate-900">
                {metadata.subject} ({metadata.subjectCode})
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Tarikh Penilaian</span>
              <span className="font-bold text-slate-900">{metadata.date}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Guru Mata Pelajaran</span>
              <span className="font-bold text-slate-900">{metadata.teacher}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
              <span className="text-slate-500 font-medium">Sesi Persekolahan</span>
              <span className="font-bold text-slate-900">
                {metadata.academicYear} • {metadata.assessmentTerm}
              </span>
            </div>
          </div>

          {/* Modules Assessment Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 px-3 py-2 text-center w-12 font-bold uppercase">No</th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-bold uppercase w-64">
                    Standard Kandungan / Modul
                  </th>
                  <th className="border border-slate-300 px-2 py-2 text-center w-16 font-bold uppercase">
                    TP
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-left font-bold uppercase">
                    Tafsiran Prestasi Standard Pembelajaran
                  </th>
                </tr>
              </thead>
              <tbody>
                {student.modules.map((score, index) => {
                  const mod = modules[index] || {
                    code: `MODUL ${index + 1}.0`,
                    title: `Modul ${index + 1}`,
                    descriptors: {},
                  };
                  const numScore = Number(score);
                  const desc =
                    mod.descriptors && mod.descriptors[numScore]
                      ? mod.descriptors[numScore]
                      : score === '-'
                      ? 'Belum ditaksir / Tidak Hadir bagi modul ini.'
                      : 'Menguasai kemahiran mengikut standard pentaksiran kurikulum kebangsaan.';

                  return (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">
                        {index + 1}
                      </td>
                      <td className="border border-slate-300 px-3 py-2">
                        <div className="font-bold text-slate-900">{mod.code}</div>
                        <div className="text-[11px] text-slate-600 font-medium">{mod.title}</div>
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center font-black text-sm text-slate-900 bg-white">
                        {score !== '' ? score : '-'}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-[11px] leading-relaxed text-slate-700">
                        {desc}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Overall TP Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-slate-900 bg-slate-50 rounded-lg p-4 mb-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Award className="w-5 h-5 text-slate-900" />
                <h3 className="font-black text-sm md:text-base text-slate-900 uppercase tracking-tight">
                  Tahap Penguasaan Keseluruhan (Overall TP)
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                Tahap penguasaan keseluruhan mencerminkan integrasi pengetahuan, kemahiran dan nilai yang dicapai murid bagi mata pelajaran Prinsip Perakaunan Tingkatan 4.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tahap</span>
                <div className="w-14 h-14 bg-white border-2 border-slate-900 rounded-lg flex items-center justify-center font-black text-2xl text-slate-900 shadow-2xs">
                  {student.overall}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Interactive TP Rubric Guide */}
          {showRubric && (
            <div className="no-print bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-xs transition-all">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Rujukan Skala Tahap Penguasaan (KPM)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {TP_RUBRIC_REFERENCE.map((item) => (
                  <div key={item.tp} className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-black text-slate-900">TP {item.tp} : {item.title}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher's Ulasan / Remarks */}
          <div className="border border-slate-300 rounded-lg p-4 mb-8 bg-white relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <UserCheck className="w-3.5 h-3.5 text-slate-900" />
                Ulasan Guru Mata Pelajaran
              </div>
              {!isEditingRemark && (
                <button
                  onClick={() => setIsEditingRemark(true)}
                  className="no-print text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Ulasan
                </button>
              )}
            </div>

            {isEditingRemark ? (
              <div className="no-print space-y-2">
                <textarea
                  value={customRemark}
                  onChange={(e) => setCustomRemark(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                  placeholder="Tulis ulasan kemajuan murid..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingRemark(false)}
                    className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveRemark}
                    className="px-3 py-1 text-xs bg-slate-900 text-white rounded font-medium hover:bg-slate-800"
                  >
                    Simpan Ulasan
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-800 italic leading-relaxed">
                "{currentRemark}"
              </p>
            )}
          </div>

          {/* Official Signatures Grid */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-center text-xs mt-auto">
            <div>
              <div className="h-12 border-b border-slate-900 mx-4 mb-2"></div>
              <p className="font-bold text-slate-900 uppercase text-[11px]">{metadata.teacher}</p>
              <p className="text-[10px] text-slate-500">{metadata.teacherDesignation}</p>
            </div>

            <div>
              <div className="h-12 border-b border-slate-900 mx-4 mb-2"></div>
              <p className="font-bold text-slate-900 uppercase text-[11px]">{metadata.principal}</p>
              <p className="text-[10px] text-slate-500">{metadata.principalDesignation}</p>
            </div>

            <div>
              <div className="h-12 border-b border-slate-900 mx-4 mb-2"></div>
              <p className="font-bold text-slate-900 uppercase text-[11px]">Tandatangan Ibu Bapa / Penjaga</p>
              <p className="text-[10px] text-slate-500">Tarikh: .......................................</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
