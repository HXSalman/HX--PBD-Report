import React from 'react';
import { Student, SchoolMetadata, ModuleDefinition, getDefaultTeacherRemark } from '../data/pbdData';
import { Award, UserCheck } from 'lucide-react';
import { OfficialKpmReportCard } from './OfficialKpmReportCard';

interface BatchPrintViewProps {
  students: Student[];
  metadata: SchoolMetadata;
  modules: ModuleDefinition[];
}

export const BatchPrintView: React.FC<BatchPrintViewProps> = ({
  students,
  metadata,
  modules,
}) => {
  const isOfficialFormat = metadata.reportFormat !== 'modern';

  return (
    <div className="batch-print-wrapper w-full">
      {students.map((student) => {
        if (isOfficialFormat) {
          return (
            <div key={student.id} className="mb-10 print:mb-0">
              <OfficialKpmReportCard
                student={student}
                metadata={metadata}
                modules={modules}
              />
            </div>
          );
        }

        const remark = student.teacherRemarks || getDefaultTeacherRemark(student.overall);

        return (
          <div
            key={student.id}
            className="report-page-sheet bg-white p-10 md:p-12 w-full max-w-4xl mx-auto mb-10 print:mb-0"
          >
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
                {metadata.address}, {metadata.state}
              </p>
              <div className="mt-3">
                <span className="inline-block bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded">
                  LAPORAN PENTAKSIRAN BILIK DARJAH (PBD) AKADEMIK
                </span>
              </div>
            </div>

            {/* Particulars */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 bg-slate-50/70 border border-slate-200 rounded-lg p-4 mb-5 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Nama Murid</span>
                <span className="font-bold text-slate-900 text-right">{student.name}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">No. Kad Pengenalan / MyKid</span>
                <span className="font-bold text-slate-900 font-mono tracking-tight">{student.ic}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Tingkatan / Kelas</span>
                <span className="font-bold text-slate-900">{metadata.class}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Jantina</span>
                <span className="font-bold text-slate-900">
                  {student.gender === 'L' ? 'Lelaki (L)' : 'Perempuan (P)'}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Mata Pelajaran</span>
                <span className="font-bold text-slate-900">
                  {metadata.subject} ({metadata.subjectCode})
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Tarikh Penilaian</span>
                <span className="font-bold text-slate-900">{metadata.date}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Guru Mata Pelajaran</span>
                <span className="font-bold text-slate-900">{metadata.teacher}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/70">
                <span className="text-slate-500 font-medium">Sesi Persekolahan</span>
                <span className="font-bold text-slate-900">
                  {metadata.academicYear} • {metadata.assessmentTerm}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-10 font-bold uppercase">No</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left font-bold uppercase w-60">
                      Standard Kandungan / Modul
                    </th>
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-14 font-bold uppercase">
                      TP
                    </th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left font-bold uppercase">
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
                      <tr key={index}>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-medium text-slate-600">
                          {index + 1}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5">
                          <div className="font-bold text-slate-900">{mod.code}</div>
                          <div className="text-[11px] text-slate-600 font-medium">{mod.title}</div>
                        </td>
                        <td className="border border-slate-300 px-2 py-1.5 text-center font-black text-sm text-slate-900 bg-white">
                          {score !== '' ? score : '-'}
                        </td>
                        <td className="border border-slate-300 px-3 py-1.5 text-[11px] leading-relaxed text-slate-700">
                          {desc}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Overall */}
            <div className="flex items-center justify-between gap-4 border-2 border-slate-900 bg-slate-50 rounded-lg p-3.5 mb-5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-900" />
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                    Tahap Penguasaan Keseluruhan (Overall TP)
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Tahap penguasaan keseluruhan mencerminkan integrasi pengetahuan dan kemahiran Prinsip Perakaunan Tingkatan 4.
                </p>
              </div>
              <div className="w-12 h-12 bg-white border-2 border-slate-900 rounded-lg flex items-center justify-center font-black text-2xl text-slate-900 shrink-0">
                {student.overall}
              </div>
            </div>

            {/* Ulasan */}
            <div className="border border-slate-300 rounded-lg p-3.5 mb-6 bg-white">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-900" />
                Ulasan Guru Mata Pelajaran
              </div>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                "{remark}"
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-5 border-t border-slate-300 text-center text-xs">
              <div>
                <div className="h-10 border-b border-slate-900 mx-4 mb-2"></div>
                <p className="font-bold text-slate-900 uppercase text-[11px]">{metadata.teacher}</p>
                <p className="text-[10px] text-slate-500">{metadata.teacherDesignation}</p>
              </div>
              <div>
                <div className="h-10 border-b border-slate-900 mx-4 mb-2"></div>
                <p className="font-bold text-slate-900 uppercase text-[11px]">{metadata.principal}</p>
                <p className="text-[10px] text-slate-500">{metadata.principalDesignation}</p>
              </div>
              <div>
                <div className="h-10 border-b border-slate-900 mx-4 mb-2"></div>
                <p className="font-bold text-slate-900 uppercase text-[11px]">Tandatangan Ibu Bapa / Penjaga</p>
                <p className="text-[10px] text-slate-500">Tarikh: .......................................</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
