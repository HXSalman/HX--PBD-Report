import React from 'react';
import { Student, SchoolMetadata, ModuleDefinition, getOverallTPStatement, getDefaultTeacherRemark } from '../data/pbdData';

interface OfficialKpmReportCardProps {
  student: Student;
  metadata: SchoolMetadata;
  modules: ModuleDefinition[];
}

export const OfficialKpmReportCard: React.FC<OfficialKpmReportCardProps> = ({
  student,
  metadata,
  modules,
}) => {
  const currentRemark = student.teacherRemarks || getDefaultTeacherRemark(student.overall);

  // KPM Header Logo (Jata Negara with text)
  const headerLogoSrc =
    metadata.kpmHeaderLogo ||
    metadata.kpmLogo ||
    '/assets/aistudio/kpm-header_99ba0e3f.png';

  // KPM Body Logo (Oval blue & yellow emblem)
  const bodyLogoSrc =
    metadata.kpmBodyLogo ||
    '/assets/aistudio/kpm-body_40f8f030.png';

  // School Crest Logo
  const schoolLogoSrc =
    metadata.schoolLogo ||
    '/assets/aistudio/Hua_Xia_PS_Logo-single_with_R_b7d8ae72.png';

  // BPK Logo
  const bpkLogoSrc =
    metadata.bpkLogo ||
    '/assets/aistudio/bpl_471965f2.png';

  return (
    <div className="report-page-sheet official-kpm-sheet bg-white text-black p-8 md:p-10 w-full max-w-[830px] mx-auto shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 font-sans text-xs leading-normal print:w-full print:max-w-none print:m-0 print:break-inside-avoid print:page-break-inside-avoid">
      {/* 1. Header with Logos - Clean, without dividing border to match official format */}
      <div className="flex items-start justify-between gap-4 pb-3 mb-4">
        {/* Left: KPM Header Logo (Jata Negara) */}
        <div className="w-40 shrink-0 flex items-center pt-0.5">
          <img
            src={headerLogoSrc}
            alt="Kementerian Pendidikan Malaysia"
            className="h-12 w-auto object-contain max-w-full"
          />
        </div>

        {/* Center: School Name, Address, Date */}
        <div className="flex-1 text-center font-bold text-black leading-snug">
          <div className="uppercase tracking-tight font-black text-[13.5px] leading-tight">
            {metadata.school}
          </div>
          <div className="uppercase font-semibold text-[11px] mt-1">
            {metadata.address.includes('SERI KEMBANGAN') ? 'SERI KEMBANGAN' : metadata.address}
          </div>
          <div className="uppercase font-semibold text-[11px] leading-tight">
            {metadata.state}
          </div>
          <div className="text-[10.5px] font-medium mt-1">
            {metadata.date}
          </div>
        </div>

        {/* Right: School Crest */}
        <div className="w-40 shrink-0 flex justify-end items-center">
          <img
            src={schoolLogoSrc}
            alt="Lencana Sekolah"
            className="h-16 w-auto object-contain max-w-full drop-shadow-2xs"
          />
        </div>
      </div>

      {/* 2. Subject Title */}
      <div className="font-black text-black text-[12px] uppercase mb-2.5 tracking-wider">
        {metadata.subject}
      </div>

      {/* 3. Student Particulars & Body Logos block */}
      <div className="flex items-center justify-between gap-6 mb-3.5">
        {/* Left: Particulars Table with generous breathing room */}
        <div className="w-[360px] shrink-0 border border-black">
          <table className="w-full text-[10px] leading-normal border-collapse">
            <tbody>
              <tr className="border-b border-black">
                <td className="w-32 px-2.5 py-1 font-bold border-r border-black bg-white">Nama Murid</td>
                <td className="px-2.5 py-1 font-bold uppercase">{student.name}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-2.5 py-1 font-bold border-r border-black bg-white">No. MY KID</td>
                <td className="px-2.5 py-1 font-mono">{student.ic}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-2.5 py-1 font-bold border-r border-black bg-white">Jantina</td>
                <td className="px-2.5 py-1 font-bold">{student.gender}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-2.5 py-1 font-bold border-r border-black bg-white">Kelas</td>
                <td className="px-2.5 py-1 font-bold">{metadata.class}</td>
              </tr>
              <tr className="border-b border-black">
                <td className="px-2.5 py-1 font-bold border-r border-black bg-white">Nama Guru</td>
                <td className="px-2.5 py-1 font-bold uppercase">{metadata.teacher}</td>
              </tr>
              <tr>
                <td className="px-2.5 py-1 font-bold border-r border-black bg-white">Tarikh Pelaporan</td>
                <td className="px-2.5 py-1">{metadata.date}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Body KPM Logo and BPK Logo side-by-side */}
        <div className="flex-1 flex items-center justify-end gap-6 pr-2">
          {/* Body KPM Logo (Oval blue & yellow emblem) */}
          <img
            src={bodyLogoSrc}
            alt="KPM Body Logo"
            className="h-11 w-auto object-contain shrink-0"
          />

          {/* Official BPK Logo */}
          <img
            src={bpkLogoSrc}
            alt="BPK Logo"
            className="h-10 w-auto object-contain shrink-0"
          />
        </div>
      </div>

      {/* 4. Tahap Penguasaan Keseluruhan Box */}
      <div className="border border-black mb-3.5">
        {/* Row 1: Overall TP */}
        <div className="flex border-b border-black">
          <div className="w-[330px] shrink-0 px-3 py-1.5 border-r border-black font-bold text-[10.5px] leading-snug">
            <div>Tahap Penguasaan Keseluruhan</div>
            <div className="uppercase">{metadata.subject}</div>
          </div>
          <div className="flex-1 px-3 py-1.5 flex items-center justify-center font-black text-2xl">
            {student.overall}
          </div>
        </div>

        {/* Row 2: Standard Statement */}
        <div className="flex">
          <div className="w-[330px] shrink-0 px-3 py-2 border-r border-black text-[10px] font-bold leading-normal">
            Berikut adalah pernyataan bagi Tahap Penguasaan keseluruhan:
          </div>
          <div className="flex-1 px-3 py-2 text-[10px] leading-relaxed">
            {getOverallTPStatement(student.overall)}
          </div>
        </div>
      </div>

      {/* 5. Main Assessment Table (9 Modules) with comfortable padding & line-height */}
      <div className="mb-4">
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-white text-center font-black">
              <th className="border border-black px-2.5 py-1.5 w-32 uppercase text-[10px]">MATA PELAJARAN</th>
              <th className="border border-black px-2.5 py-1.5 w-28 uppercase text-[10px]">KEMAHIRAN</th>
              <th className="border border-black px-2.5 py-1.5 w-24 uppercase text-[10px]">TAHAP PENGUASAAN</th>
              <th className="border border-black px-3.5 py-1.5 text-center uppercase text-[10px]">TAFSIRAN</th>
            </tr>
          </thead>
          <tbody>
            {student.modules.map((score, idx) => {
              const mod = modules[idx] || { code: `Modul ${idx + 1}`, descriptors: {} };
              const numScore = Number(score);
              const desc =
                mod.descriptors && mod.descriptors[numScore]
                  ? mod.descriptors[numScore]
                  : score === '-'
                  ? 'Belum ditaksir / Tidak Hadir'
                  : 'Melengkapkan standard prestasi pembelajaran.';

              return (
                <tr key={idx} className="align-middle">
                  {/* Single Spanning Cell for Mata Pelajaran on the first row */}
                  {idx === 0 && (
                    <td
                      rowSpan={9}
                      className="border border-black p-3 text-center font-black uppercase text-[11px] tracking-wider leading-snug"
                    >
                      {metadata.subject}
                    </td>
                  )}
                  <td className="border border-black px-2.5 py-1 text-center font-medium text-[10px]">
                    Modul {idx + 1}
                  </td>
                  <td className="border border-black px-2.5 py-1 text-center font-bold text-[10.5px]">
                    {score !== '' ? score : '-'}
                  </td>
                  <td className="border border-black px-3 py-1 text-[9.5px] leading-relaxed">
                    {desc}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 6. Ulasan Guru Section with comfortable vertical rhythm */}
      <div className="mb-5 mt-3 text-[10px] leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="font-bold shrink-0">ULASAN GURU :</span>
          <span className="font-medium underline underline-offset-4 decoration-black flex-1 leading-relaxed">
            {currentRemark}
          </span>
        </div>
      </div>

      {/* 7. Signatures */}
      <div className="grid grid-cols-2 gap-12 pt-3 text-[10px] leading-normal">
        {/* Left Signature */}
        <div>
          <div className="border-b border-dotted border-black w-60 mb-1.5"></div>
          <div className="font-black uppercase text-[10px] tracking-wide">{metadata.teacher}</div>
          <div className="font-bold text-[9px] uppercase text-black mt-0.5">{metadata.teacherDesignation}</div>
          <div className="font-bold text-[9px] uppercase text-black mt-0.5">{metadata.school}</div>
        </div>

        {/* Right Signature */}
        <div className="flex flex-col items-end text-right">
          <div className="border-b border-dotted border-black w-60 mb-1.5"></div>
          <div className="font-black uppercase text-[10px] tracking-wide">{metadata.principal}</div>
          <div className="font-bold text-[9px] uppercase text-black mt-0.5">{metadata.principalDesignation}</div>
          <div className="font-bold text-[9px] uppercase text-black mt-0.5">{metadata.school}</div>
        </div>
      </div>
    </div>
  );
};
