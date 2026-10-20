import { Student, SchoolMetadata, ModuleDefinition, MODULE_DEFINITIONS, getDefaultTeacherRemark } from '../data/pbdData';

export function generateStandaloneHtml(
  metadata: SchoolMetadata,
  students: Student[],
  modules: ModuleDefinition[] = MODULE_DEFINITIONS
): string {
  const jsonMetadata = JSON.stringify(metadata);
  const jsonStudents = JSON.stringify(students);
  const jsonModules = JSON.stringify(modules);

  return `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Pentaksiran Bilik Darjah (PBD) - ${metadata.school}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #0284c7;
            --primary-dark: #0369a1;
            --bg-page: #f8fafc;
            --bg-card: #ffffff;
            --text-heading: #0f172a;
            --text-body: #334155;
            --text-muted: #64748b;
            --border-light: #e2e8f0;
            --border-dark: #94a3b8;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }

        body {
            background-color: var(--bg-page);
            color: var(--text-body);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Top Header */
        header.app-header {
            background: #ffffff;
            border-bottom: 1px solid var(--border-light);
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .header-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header-title h1 {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--text-heading);
            letter-spacing: -0.01em;
        }

        .header-subtitle {
            font-size: 0.8rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid transparent;
            transition: all 0.15s ease;
        }

        .btn-primary {
            background-color: #0f172a;
            color: #ffffff;
        }

        .btn-primary:hover {
            background-color: #1e293b;
        }

        .btn-secondary {
            background-color: #ffffff;
            color: #0f172a;
            border-color: var(--border-light);
        }

        .btn-secondary:hover {
            background-color: #f1f5f9;
        }

        /* Main Layout */
        .workspace-layout {
            display: flex;
            flex: 1;
            height: calc(100vh - 61px);
            overflow: hidden;
        }

        /* Sidebar */
        aside.student-sidebar {
            width: 320px;
            background: #ffffff;
            border-right: 1px solid var(--border-light);
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }

        .sidebar-search-box {
            padding: 16px;
            border-bottom: 1px solid var(--border-light);
        }

        .search-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--border-light);
            font-size: 0.85rem;
            outline: none;
        }

        .search-input:focus {
            border-color: var(--primary);
        }

        .student-count-bar {
            padding: 8px 16px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            background: #f8fafc;
            border-bottom: 1px solid var(--border-light);
            display: flex;
            justify-content: space-between;
        }

        .student-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }

        .student-card {
            padding: 10px 12px;
            border-radius: 6px;
            margin-bottom: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid transparent;
            transition: all 0.15s ease;
        }

        .student-card:hover {
            background-color: #f8fafc;
            border-color: var(--border-light);
        }

        .student-card.active {
            background-color: #f0fdf4;
            border-color: #bbf7d0;
        }

        .student-info-left {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .student-name {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-heading);
        }

        .student-meta {
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .tp-badge {
            font-size: 0.75rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            background: #e2e8f0;
            color: #334155;
        }

        .tp-badge.tp-5, .tp-badge.tp-6 {
            background: #dcfce7;
            color: #166534;
        }

        .tp-badge.tp-4 {
            background: #e0f2fe;
            color: #0369a1;
        }

        .tp-badge.tp-3 {
            background: #fef3c7;
            color: #92400e;
        }

        /* Report Canvas */
        main.report-canvas {
            flex: 1;
            overflow-y: auto;
            padding: 32px;
            display: flex;
            justify-content: center;
            background-color: #f1f5f9;
        }

        .report-sheet {
            background: #ffffff;
            width: 100%;
            max-width: 820px;
            min-height: 1120px;
            padding: 48px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04);
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* Report Sheet Header */
        .official-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #0f172a;
            margin-bottom: 20px;
        }

        .crest-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            margin-bottom: 8px;
            background: #0f172a;
            color: #ffffff;
            border-radius: 8px;
            font-weight: 800;
            font-size: 1.1rem;
        }

        .official-kpm-title {
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #475569;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .official-school-name {
            font-size: 1.35rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.01em;
            margin-bottom: 4px;
        }

        .official-address {
            font-size: 0.8rem;
            color: #64748b;
            margin-bottom: 12px;
        }

        .report-doc-title {
            display: inline-block;
            background: #0f172a;
            color: #ffffff;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 4px 18px;
            border-radius: 4px;
        }

        /* Student Particulars Table */
        .particulars-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px 24px;
            background: #f8fafc;
            border: 1px solid var(--border-light);
            border-radius: 6px;
            padding: 16px 20px;
            margin-bottom: 24px;
            font-size: 0.85rem;
        }

        .particulars-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #e2e8f0;
            padding-bottom: 4px;
        }

        .p-label {
            color: var(--text-muted);
            font-weight: 500;
        }

        .p-value {
            font-weight: 700;
            color: var(--text-heading);
            text-align: right;
        }

        /* Modules Table */
        .modules-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 0.85rem;
        }

        .modules-table th, .modules-table td {
            border: 1px solid #cbd5e1;
            padding: 8px 12px;
            vertical-align: middle;
        }

        .modules-table th {
            background-color: #f1f5f9;
            font-weight: 700;
            text-align: left;
            color: #1e293b;
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .col-center {
            text-align: center !important;
        }

        .col-tp-box {
            width: 70px;
            text-align: center;
            font-size: 1rem;
            font-weight: 800;
            background: #ffffff;
        }

        .desc-text {
            font-size: 0.8rem;
            color: #475569;
            line-height: 1.35;
        }

        /* Overall TP Section */
        .overall-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 2px solid #0f172a;
            background: #f8fafc;
            border-radius: 6px;
            padding: 14px 20px;
            margin-bottom: 24px;
        }

        .overall-left h3 {
            font-size: 0.95rem;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .overall-left p {
            font-size: 0.8rem;
            color: #64748b;
        }

        .overall-tp-badge {
            font-size: 1.8rem;
            font-weight: 800;
            color: #0f172a;
            background: #ffffff;
            border: 2px solid #0f172a;
            width: 54px;
            height: 54px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Teacher Remarks Section */
        .remarks-box {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 14px 18px;
            margin-bottom: 28px;
            background: #ffffff;
        }

        .remarks-title {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #475569;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
        }

        .remarks-content {
            font-size: 0.85rem;
            line-height: 1.5;
            color: #1e293b;
            font-style: italic;
        }

        /* Signatures Grid */
        .signatures-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: auto;
            padding-top: 24px;
            border-top: 1px solid var(--border-light);
        }

        .signature-item {
            text-align: center;
        }

        .signature-line {
            height: 48px;
            border-bottom: 1px solid #0f172a;
            margin-bottom: 8px;
        }

        .signature-name {
            font-size: 0.78rem;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
        }

        .signature-role {
            font-size: 0.7rem;
            color: #64748b;
        }

        /* Print Override */
        @media print {
            body {
                background: #ffffff !important;
                color: #000000 !important;
            }

            header.app-header,
            aside.student-sidebar {
                display: none !important;
            }

            .workspace-layout {
                display: block !important;
                height: auto !important;
                overflow: visible !important;
            }

            main.report-canvas {
                padding: 0 !important;
                background: #ffffff !important;
                display: block !important;
            }

            .report-sheet {
                box-shadow: none !important;
                border-radius: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
                width: 100% !important;
                page-break-after: always;
                break-after: page;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>

    <header class="app-header">
        <div class="header-title">
            <div class="crest-icon" style="width: 32px; height: 32px; font-size: 0.85rem; border-radius: 4px;">HX</div>
            <div>
                <h1>${metadata.school}</h1>
                <div class="header-subtitle">${metadata.class} • ${metadata.subject} • Sesi ${metadata.academicYear}</div>
            </div>
        </div>
        <div class="header-actions">
            <button class="btn btn-secondary" onclick="printAllReports()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Cetak Semua (24 Murid)
            </button>
            <button class="btn btn-primary" onclick="window.print()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Cetak Murid Ini
            </button>
        </div>
    </header>

    <div class="workspace-layout">
        <aside class="student-sidebar">
            <div class="sidebar-search-box">
                <input type="text" id="searchInput" class="search-input" placeholder="Cari nama atau No. KP..." oninput="handleSearch(this.value)">
            </div>
            <div class="student-count-bar">
                <span>Senarai Murid</span>
                <span id="studentCountText">24 Murid</span>
            </div>
            <div class="student-list" id="studentListContainer">
                <!-- Dynamic student list items -->
            </div>
        </aside>

        <main class="report-canvas">
            <div id="reportSheet" class="report-sheet">
                <!-- Dynamic Report Content -->
            </div>
        </main>
    </div>

    <!-- Hidden Container for Batch Printing -->
    <div id="batchPrintContainer" style="display: none;"></div>

    <script>
        const metadata = ${jsonMetadata};
        const students = ${jsonStudents};
        const modules = ${jsonModules};

        let selectedStudentId = students[0]?.id || 1;
        let filteredStudents = [...students];

        function getDescriptor(moduleIdx, tp) {
            const mod = modules[moduleIdx];
            if (!mod) return "-";
            const numTp = Number(tp);
            if (mod.descriptors && mod.descriptors[numTp]) {
                return mod.descriptors[numTp];
            }
            return "Murid dinilai mengikut standard kurikulum.";
        }

        function getTeacherRemark(overallTP) {
            const tp = Number(overallTP);
            switch (tp) {
                case 6: return "Tahniah! Murid menunjukkan penguasaan yang sangat cemerlang, berdisiplin dan konsisten dalam semua modul perakaunan. Berpotensi tinggi mencapai gred A+ dalam peperiksaan SPM.";
                case 5: return "Syabas dan tahniah! Murid mempunyai kefahaman yang sangat kukuh dalam tatacara sistem catatan bergu dan penyediaan penyata kewangan. Teruskan momentum kecemerlangan.";
                case 4: return "Pencapaian yang baik dan terpuji. Murid menguasai asas perakaunan dengan sistematik. Tingkatkan ketelitian dalam topik pelarasan dan pembetulan kesilapan untuk ke tahap cemerlang.";
                case 3: return "Murid telah mencapai tahap penguasaan minimum. Perlu melipatgandakan latihan kendiri serta memberi lebih tumpuan kepada pemahaman lejar dan persamaan perakaunan.";
                case 2: return "Murid masih memerlukan bimbingan guru dan rakan untuk mengukuhkan konsep asas serta tatacara perekodan dokumen ke dalam buku perakaunan.";
                default: return "Murid menunjukkan komitmen pembelajaran yang positif sepanjang sesi persekolahan.";
            }
        }

        function renderStudentList() {
            const container = document.getElementById('studentListContainer');
            container.innerHTML = '';

            filteredStudents.forEach(student => {
                const item = document.createElement('div');
                item.className = 'student-card' + (student.id === selectedStudentId ? ' active' : '');
                item.onclick = () => {
                    selectedStudentId = student.id;
                    renderStudentList();
                    renderReport(student);
                };

                const tpClass = 'tp-' + student.overall;

                item.innerHTML = \`
                    <div class="student-info-left">
                        <div class="student-name">\${student.id}. \${student.name}</div>
                        <div class="student-meta">\${student.ic} · \${student.gender === 'L' ? 'Lelaki' : 'Perempuan'}</div>
                    </div>
                    <span class="tp-badge \${tpClass}">TP \${student.overall}</span>
                \`;
                container.appendChild(item);
            });

            document.getElementById('studentCountText').innerText = filteredStudents.length + ' Murid';
        }

        function handleSearch(query) {
            const q = query.toLowerCase().trim();
            if (!q) {
                filteredStudents = [...students];
            } else {
                filteredStudents = students.filter(s => 
                    s.name.toLowerCase().includes(q) || 
                    s.ic.toLowerCase().includes(q) ||
                    String(s.overall) === q
                );
            }
            renderStudentList();
            if (filteredStudents.length > 0 && !filteredStudents.some(s => s.id === selectedStudentId)) {
                selectedStudentId = filteredStudents[0].id;
                renderReport(filteredStudents[0]);
            }
        }

        function buildReportHTML(student) {
            let rowsHtml = '';
            student.modules.forEach((tp, idx) => {
                const mod = modules[idx] || { code: 'MODUL ' + (idx + 1), title: 'Modul ' + (idx + 1) };
                const desc = getDescriptor(idx, tp);
                rowsHtml += \`
                    <tr>
                        <td class="col-center" style="font-weight: 600; width: 40px;">\${idx + 1}</td>
                        <td style="width: 250px;">
                            <div style="font-weight: 700; color: #0f172a;">\${mod.code}</div>
                            <div style="color: #475569; font-size: 0.8rem;">\${mod.title}</div>
                        </td>
                        <td class="col-tp-box">\${tp !== '' && tp !== undefined ? tp : '-'}</td>
                        <td class="desc-text">\${desc}</td>
                    </tr>
                \`;
            });

            const remark = student.teacherRemarks || getTeacherRemark(student.overall);

            return \`
                <div class="official-header">
                    <div class="crest-icon">HX</div>
                    <div class="official-kpmTitle">\${metadata.ministryHeader || 'KEMENTERIAN PENDIDIKAN MALAYSIA'}</div>
                    <h2 class="official-school-name">\${metadata.school}</h2>
                    <div class="official-address">\${metadata.address}, \${metadata.state}</div>
                    <div class="report-doc-title">LAPORAN PENTAKSIRAN BILIK DARJAH (PBD) AKADEMIK</div>
                </div>

                <div class="particulars-grid">
                    <div class="particulars-item">
                        <span class="p-label">Nama Murid:</span>
                        <span class="p-value">\${student.name}</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">No. Kad Pengenalan / MyKid:</span>
                        <span class="p-value">\${student.ic}</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">Tingkatan / Kelas:</span>
                        <span class="p-value">\${metadata.class}</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">Jantina:</span>
                        <span class="p-value">\${student.gender === 'L' ? 'Lelaki (L)' : 'Perempuan (P)'}</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">Mata Pelajaran:</span>
                        <span class="p-value">\${metadata.subject} (\${metadata.subjectCode || '3756'})</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">Tarikh Penilaian:</span>
                        <span class="p-value">\${metadata.date}</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">Guru Mata Pelajaran:</span>
                        <span class="p-value">\${metadata.teacher}</span>
                    </div>
                    <div class="particulars-item">
                        <span class="p-label">Sesi Persekolahan:</span>
                        <span class="p-value">\${metadata.academicYear} · \${metadata.assessmentTerm}</span>
                    </div>
                </div>

                <table class="modules-table">
                    <thead>
                        <tr>
                            <th class="col-center">No</th>
                            <th>Standard Prestasi / Modul Pembelajaran</th>
                            <th class="col-center">TP</th>
                            <th>Tafsiran Prestasi Standard Kandungan</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${rowsHtml}
                    </tbody>
                </table>

                <div class="overall-banner">
                    <div class="overall-left">
                        <h3>Tahap Penguasaan Keseluruhan (Overall TP)</h3>
                        <p>Penilaian keseluruhan berasaskan pencapaian standard kandungan kurikulum kebangsaan (KSSM).</p>
                    </div>
                    <div class="overall-tp-badge">
                        \${student.overall}
                    </div>
                </div>

                <div class="remarks-box">
                    <div class="remarks-title">Ulasan Guru Mata Pelajaran</div>
                    <div class="remarks-content">"\${remark}"</div>
                </div>

                <div class="signatures-grid">
                    <div class="signature-item">
                        <div class="signature-line"></div>
                        <div class="signature-name">\${metadata.teacher}</div>
                        <div class="signature-role">\${metadata.teacherDesignation || 'Guru Mata Pelajaran'}</div>
                    </div>
                    <div class="signature-item">
                        <div class="signature-line"></div>
                        <div class="signature-name">\${metadata.principal}</div>
                        <div class="signature-role">\${metadata.principalDesignation || 'Pengetua'}</div>
                    </div>
                    <div class="signature-item">
                        <div class="signature-line"></div>
                        <div class="signature-name">Tandatangan Ibu Bapa / Penjaga</div>
                        <div class="signature-role">Tarikh: .......................................</div>
                    </div>
                </div>
            \`;
        }

        function renderReport(student) {
            const sheet = document.getElementById('reportSheet');
            sheet.innerHTML = buildReportHTML(student);
        }

        function printAllReports() {
            const printContainer = document.getElementById('batchPrintContainer');
            printContainer.innerHTML = '';
            students.forEach(student => {
                const page = document.createElement('div');
                page.className = 'report-sheet';
                page.style.marginBottom = '20px';
                page.innerHTML = buildReportHTML(student);
                printContainer.appendChild(page);
            });

            // Temporarily hide workspace and show print container for print dialog
            const workspace = document.querySelector('.workspace-layout');
            workspace.style.display = 'none';
            printContainer.style.display = 'block';

            window.print();

            // Restore after print dialog closes
            setTimeout(() => {
                workspace.style.display = 'flex';
                printContainer.style.display = 'none';
            }, 500);
        }

        // Initialize
        renderStudentList();
        const initialStudent = students.find(s => s.id === selectedStudentId) || students[0];
        if (initialStudent) {
            renderReport(initialStudent);
        }
    </script>
</body>
</html>`;
}
