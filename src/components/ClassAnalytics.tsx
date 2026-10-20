import React from 'react';
import { Student, SchoolMetadata, ModuleDefinition } from '../data/pbdData';
import { Users, TrendingUp, Award, BarChart3, Printer } from 'lucide-react';

interface ClassAnalyticsProps {
  students: Student[];
  metadata: SchoolMetadata;
  modules: ModuleDefinition[];
}

export const ClassAnalytics: React.FC<ClassAnalyticsProps> = ({
  students,
  metadata,
  modules,
}) => {
  const total = students.length;
  const boys = students.filter((s) => s.gender === 'L').length;
  const girls = students.filter((s) => s.gender === 'P').length;

  // TP Distribution counts
  const tpCounts: Record<number, number> = { 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let tpSum = 0;
  let validStudentsCount = 0;

  students.forEach((s) => {
    const val = Number(s.overall);
    if (!isNaN(val) && val >= 1 && val <= 6) {
      tpCounts[val] = (tpCounts[val] || 0) + 1;
      tpSum += val;
      validStudentsCount++;
    }
  });

  const classAvg = validStudentsCount > 0 ? (tpSum / validStudentsCount).toFixed(2) : '0';

  // Module Averages
  const moduleAverages = modules.map((mod, idx) => {
    let sum = 0;
    let count = 0;
    students.forEach((s) => {
      const score = Number(s.modules[idx]);
      if (!isNaN(score) && score > 0) {
        sum += score;
        count++;
      }
    });
    return {
      id: mod.id,
      code: mod.code,
      title: mod.title,
      avg: count > 0 ? (sum / count).toFixed(2) : '0',
    };
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="no-print flex items-center justify-between bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Analisis Prestasi Keseluruhan Kelas</h2>
          <p className="text-xs text-slate-500">
            {metadata.class} • {metadata.subject} • {total} Murid Berdaftar
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          Cetak Analisis Kelas
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Jumlah Murid</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{total}</div>
          <div className="text-xs text-slate-500 mt-1">
            {boys} Lelaki · {girls} Perempuan
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Purata TP Kelas</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{classAvg}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Daripada Skala TP 6.0</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Cemerlang (TP 5-6)</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {tpCounts[6] + tpCounts[5]}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {(((tpCounts[6] + tpCounts[5]) / total) * 100).toFixed(1)}% daripada kelas
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Kepujian (TP 4)</span>
            <BarChart3 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{tpCounts[4]}</div>
          <div className="text-xs text-slate-500 mt-1">
            {((tpCounts[4] / total) * 100).toFixed(1)}% daripada kelas
          </div>
        </div>
      </div>

      {/* TP Distribution Breakdown Chart */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Taburan Tahap Penguasaan Keseluruhan (TP 1 - TP 6)
        </h3>
        <div className="space-y-3">
          {[6, 5, 4, 3, 2, 1].map((tp) => {
            const count = tpCounts[tp];
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={tp} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 w-12">TP {tp}</span>
                    <span className="text-slate-500">
                      {tp >= 5 ? 'Cemerlang' : tp === 4 ? 'Kepujian' : tp === 3 ? 'Memuaskan' : 'Perlu Bimbingan'}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800">
                    {count} murid ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tp >= 5 ? 'bg-emerald-600' : tp === 4 ? 'bg-sky-600' : tp === 3 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module by Module Mastery */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Purata Tahap Penguasaan Mengikut Standard Modul
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {moduleAverages.map((m) => (
            <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-900">{m.code}</span>
                <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {m.avg}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{m.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Class Master Table (Lembaran Induk Pentaksiran PBD) */}
      <div className="report-page-sheet bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs overflow-x-auto">
        <div className="text-center pb-4 mb-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 uppercase">
            Lembaran Pentaksiran Bilik Darjah (PBD) Keseluruhan Kelas
          </h3>
          <p className="text-xs text-slate-500">
            {metadata.school} • {metadata.class} • {metadata.subject} • Sesi {metadata.academicYear}
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-300 px-2 py-2 text-center w-8">No</th>
              <th className="border border-slate-300 px-3 py-2 text-left">Nama Murid</th>
              <th className="border border-slate-300 px-2 py-2 text-center w-24">No. KP</th>
              <th className="border border-slate-300 px-1 py-2 text-center w-8">J</th>
              {modules.map((m) => (
                <th key={m.id} className="border border-slate-300 px-1 py-2 text-center w-8" title={m.title}>
                  M{m.id}
                </th>
              ))}
              <th className="border border-slate-300 px-2 py-2 text-center w-12 font-bold bg-slate-200">
                TP
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-300 px-2 py-1.5 text-center text-slate-600">
                  {student.id}
                </td>
                <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900 whitespace-nowrap">
                  {student.name}
                </td>
                <td className="border border-slate-300 px-2 py-1.5 text-center font-mono text-[11px] text-slate-600">
                  {student.ic}
                </td>
                <td className="border border-slate-300 px-1 py-1.5 text-center text-slate-600">
                  {student.gender}
                </td>
                {student.modules.map((score, sIdx) => (
                  <td key={sIdx} className="border border-slate-300 px-1 py-1.5 text-center font-medium">
                    {score !== '' ? score : '-'}
                  </td>
                ))}
                <td className="border border-slate-300 px-2 py-1.5 text-center font-black bg-slate-50 text-slate-900">
                  {student.overall}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Verification Footer for Class Sheet */}
        <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200 text-xs">
          <div>
            <div className="h-10 border-b border-slate-900 mx-8 mb-2"></div>
            <p className="font-bold text-center text-slate-900 uppercase">{metadata.teacher}</p>
            <p className="text-[11px] text-center text-slate-500">Guru Mata Pelajaran</p>
          </div>
          <div>
            <div className="h-10 border-b border-slate-900 mx-8 mb-2"></div>
            <p className="font-bold text-center text-slate-900 uppercase">{metadata.principal}</p>
            <p className="text-[11px] text-center text-slate-500">Pengetua / Guru Kanan</p>
          </div>
        </div>
      </div>
    </div>
  );
};
