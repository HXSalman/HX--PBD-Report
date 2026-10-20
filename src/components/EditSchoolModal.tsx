import React, { useState, useRef } from 'react';
import { SchoolMetadata } from '../data/pbdData';
import { X, Building2, Upload, Image, Trash2, CheckCircle2, LayoutTemplate } from 'lucide-react';

interface EditSchoolModalProps {
  metadata: SchoolMetadata;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SchoolMetadata) => void;
}

export const EditSchoolModal: React.FC<EditSchoolModalProps> = ({
  metadata,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SchoolMetadata>({
    reportFormat: 'official_kpm',
    ...metadata,
  });

  const schoolLogoInputRef = useRef<HTMLInputElement>(null);
  const kpmHeaderLogoInputRef = useRef<HTMLInputElement>(null);
  const kpmBodyLogoInputRef = useRef<HTMLInputElement>(null);
  const bpkLogoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'schoolLogo' | 'kpmHeaderLogo' | 'kpmBodyLogo' | 'bpkLogo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, [field]: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-900" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">Tetapan Maklumat Sekolah, Format & Logo</h3>
              <p className="text-xs text-slate-500">Sesuaikan logo rasmi, format laporan dan butiran sekolah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Format Selection Section */}
          <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <LayoutTemplate className="w-4 h-4 text-slate-700" />
              <span>Format Laporan Murid</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.reportFormat === 'official_kpm'
                    ? 'border-slate-900 bg-white shadow-xs'
                    : 'border-slate-200 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">Format Rasmi KPM / BPK</span>
                  {formData.reportFormat === 'official_kpm' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Format rasmi SPPB dengan logo KPM, BPK, jadual perincian modul dan ulasan guru bergari (seperti dalam lampiran).
                </p>
                <input
                  type="radio"
                  name="reportFormat"
                  value="official_kpm"
                  checked={formData.reportFormat === 'official_kpm'}
                  onChange={() => setFormData({ ...formData, reportFormat: 'official_kpm' })}
                  className="hidden"
                />
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  formData.reportFormat === 'modern'
                    ? 'border-slate-900 bg-white shadow-xs'
                    : 'border-slate-200 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900">Format Moden (Standard PBD)</span>
                  {formData.reportFormat === 'modern' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Paparan kad penilaian moden dengan reka bentuk kemas, petunjuk skala TP dan ulasan guru interaktif.
                </p>
                <input
                  type="radio"
                  name="reportFormat"
                  value="modern"
                  checked={formData.reportFormat === 'modern'}
                  onChange={() => setFormData({ ...formData, reportFormat: 'modern' })}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Image className="w-4 h-4 text-slate-700" />
                <span>Pengurusan & Muat Naik Logo Rasmi</span>
              </div>
              <span className="text-[10px] text-slate-500">Format PNG / JPG / SVG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* 1. School Logo */}
              <div className="bg-white p-3 border border-slate-200 rounded-lg flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">Lencana / Logo Sekolah</span>
                    <p className="text-[10px] text-slate-500">Dipaparkan di sudut atas kanan laporan</p>
                  </div>
                  <img
                    src={formData.schoolLogo || "/assets/aistudio/Hua_Xia_PS_Logo-single_with_R_b7d8ae72.png"}
                    alt="Logo Sekolah"
                    className="w-12 h-12 object-contain border border-slate-200 rounded p-1 bg-slate-50 shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={schoolLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'schoolLogo')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => schoolLogoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Pilih Logo
                  </button>
                  {formData.schoolLogo && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, schoolLogo: undefined })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded border border-slate-200 hover:bg-rose-50 transition-colors"
                      title="Reset ke lalai Hua Xia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. KPM Header Logo */}
              <div className="bg-white p-3 border border-slate-200 rounded-lg flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">Logo KPM (Header Atas)</span>
                    <p className="text-[10px] text-slate-500">Jata Negara & teks rasmi di sudut kiri atas</p>
                  </div>
                  <img
                    src={formData.kpmHeaderLogo || formData.kpmLogo || "/assets/aistudio/kpm-header_99ba0e3f.png"}
                    alt="Logo KPM Header"
                    className="w-16 h-10 object-contain border border-slate-200 rounded p-1 bg-slate-50 shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={kpmHeaderLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'kpmHeaderLogo')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => kpmHeaderLogoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Tukar Header KPM
                  </button>
                  {formData.kpmHeaderLogo && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, kpmHeaderLogo: undefined })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded border border-slate-200 hover:bg-rose-50 transition-colors"
                      title="Reset ke lalai KPM Header"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. KPM Body Logo */}
              <div className="bg-white p-3 border border-slate-200 rounded-lg flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">Logo KPM (Badan Laporan)</span>
                    <p className="text-[10px] text-slate-500">Logo bujur biru/kuning bersebelahan logo BPK</p>
                  </div>
                  <img
                    src={formData.kpmBodyLogo || "/assets/aistudio/kpm-body_40f8f030.png"}
                    alt="Logo KPM Badan"
                    className="w-16 h-10 object-contain border border-slate-200 rounded p-1 bg-slate-50 shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={kpmBodyLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'kpmBodyLogo')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => kpmBodyLogoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Tukar Body KPM
                  </button>
                  {formData.kpmBodyLogo && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, kpmBodyLogo: undefined })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded border border-slate-200 hover:bg-rose-50 transition-colors"
                      title="Reset ke lalai KPM Badan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 4. BPK Logo */}
              <div className="bg-white p-3 border border-slate-200 rounded-lg flex flex-col justify-between space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">Logo BPK</span>
                    <p className="text-[10px] text-slate-500">Bahagian Pembangunan Kurikulum</p>
                  </div>
                  <img
                    src={formData.bpkLogo || "/assets/aistudio/bpl_471965f2.png"}
                    alt="Logo BPK"
                    className="w-14 h-10 object-contain border border-slate-200 rounded p-1 bg-slate-50 shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={bpkLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'bpkLogo')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => bpkLogoInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    Pilih Logo BPK
                  </button>
                  {formData.bpkLogo && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bpkLogo: undefined })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded border border-slate-200 hover:bg-rose-50 transition-colors"
                      title="Reset ke lalai BPK"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* School Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Sekolah</label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Kod Sekolah</label>
              <input
                type="text"
                placeholder="BEA8651"
                value={formData.schoolCode || ''}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Alamat / Kawasan Sekolah</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Negeri</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Mata Pelajaran</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tingkatan / Kelas</label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tarikh Pelaporan</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Teachers and Principal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Guru Mata Pelajaran</label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Pengetua</label>
              <input
                type="text"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Footer Buttons */}
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
              Simpan Tetapan & Logo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
