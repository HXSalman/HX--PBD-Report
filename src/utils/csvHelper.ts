import { Student, SchoolMetadata, getDefaultTeacherRemark } from '../data/pbdData';

export function generateSampleCSV(): string {
  return `No,Nama Murid,No KP,Jantina,M1,M2,M3,M4,M5,M6,M7,M8,M9,TP Keseluruhan,Kehadiran,Ulasan
1,AHMAD DANIAL BIN ZAINAL,100101-14-1234,L,4,4,4,5,5,5,4,4,4,4,96%,"Murid menunjukkan komitmen yang baik."
2,NUR AINA BINTI HASHIM,100202-10-5678,P,5,5,5,5,6,6,5,5,5,5,98%,"Syabas dan tahniah atas pencapaian cemerlang."
3,KEITH TAN JIA HAO,100303-14-9876,L,3,4,3,4,4,5,4,4,4,4,92%,"Tingkatkan kefahaman dalam topik lejar."`;
}

export function exportStudentsToCSV(students: Student[], metadata?: SchoolMetadata): string {
  const headers = [
    'No',
    'Nama Murid',
    'No Kad Pengenalan',
    'Jantina',
    'Modul 1',
    'Modul 2',
    'Modul 3',
    'Modul 4',
    'Modul 5',
    'Modul 6',
    'Modul 7',
    'Modul 8',
    'Modul 9',
    'TP Keseluruhan',
    'Kehadiran',
    'Ulasan Guru'
  ];

  const rows = students.map((s, idx) => {
    const modules = Array.from({ length: 9 }, (_, i) => s.modules[i] !== undefined ? s.modules[i] : '-');
    const ulasan = (s.teacherRemarks || getDefaultTeacherRemark(s.overall)).replace(/"/g, '""');
    return [
      idx + 1,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.ic}"`,
      s.gender,
      ...modules,
      s.overall,
      `"${s.attendanceRate || '95%'}"`,
      `"${ulasan}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export function parseCSVLine(text: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseStudentsFromCSV(csvText: string): {
  students: Student[];
  errors: string[];
} {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      students: [],
      errors: ['Fail CSV kosong atau tidak mengandungi data murid yang mencukupi.']
    };
  }

  // Detect delimiter: comma, tab, or semicolon
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes('\t')) delimiter = '\t';
  else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';

  const rawHeaders = parseCSVLine(firstLine, delimiter).map((h) =>
    h.toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  // Column index identification
  let nameIdx = rawHeaders.findIndex((h) => h.includes('nama') || h.includes('name') || h === 'student');
  let icIdx = rawHeaders.findIndex((h) => h.includes('ic') || h.includes('kp') || h.includes('mykid') || h.includes('kadpengenalan'));
  let genderIdx = rawHeaders.findIndex((h) => h.includes('jantina') || h.includes('gender') || h === 'j' || h === 'g');
  let overallIdx = rawHeaders.findIndex((h) => h.includes('overall') || h.includes('keseluruhan') || h === 'tp');
  let attendanceIdx = rawHeaders.findIndex((h) => h.includes('kehadiran') || h.includes('attendance'));
  let remarkIdx = rawHeaders.findIndex((h) => h.includes('ulasan') || h.includes('remark') || h.includes('comment'));

  // Module indices (M1-M9 or Modul 1-9)
  const moduleIndices: number[] = [];
  for (let m = 1; m <= 9; m++) {
    const idx = rawHeaders.findIndex((h) => h === `m${m}` || h === `modul${m}` || h === `module${m}`);
    moduleIndices.push(idx);
  }

  // Fallbacks if standard headers were not explicitly titled:
  if (nameIdx === -1 && rawHeaders.length > 1) nameIdx = 1;
  if (icIdx === -1 && rawHeaders.length > 2) icIdx = 2;
  if (genderIdx === -1 && rawHeaders.length > 3) genderIdx = 3;

  const parsedStudents: Student[] = [];
  const errors: string[] = [];

  for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
    const cols = parseCSVLine(lines[lineIdx], delimiter);
    if (cols.length < 2) continue;

    const rawName = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : `Murid ${lineIdx}`;
    const rawIc = icIdx !== -1 && cols[icIdx] ? cols[icIdx] : `100000-00-${String(lineIdx).padStart(4, '0')}`;
    const rawGender = genderIdx !== -1 && cols[genderIdx] ? cols[genderIdx].toUpperCase() : 'L';
    const gender: 'L' | 'P' = rawGender.startsWith('P') || rawGender.startsWith('F') ? 'P' : 'L';

    // Parse module scores
    const modules: (number | string)[] = [];
    let validModulesCount = 0;
    let moduleSum = 0;

    for (let m = 0; m < 9; m++) {
      let scoreVal: number | string = '-';
      const colIdx = moduleIndices[m];

      if (colIdx !== -1 && cols[colIdx] !== undefined) {
        const val = cols[colIdx].trim();
        const num = parseInt(val, 10);
        if (!isNaN(num) && num >= 1 && num <= 6) {
          scoreVal = num;
          moduleSum += num;
          validModulesCount++;
        } else {
          scoreVal = val === '-' ? '-' : '-';
        }
      } else {
        // positional module detection after gender column (idx 4 to 12)
        const posIdx = 4 + m;
        if (cols[posIdx] !== undefined) {
          const num = parseInt(cols[posIdx].trim(), 10);
          if (!isNaN(num) && num >= 1 && num <= 6) {
            scoreVal = num;
            moduleSum += num;
            validModulesCount++;
          }
        }
      }
      modules.push(scoreVal);
    }

    // Parse overall TP
    let overallTP: number | string = 3;
    if (overallIdx !== -1 && cols[overallIdx] !== undefined) {
      const num = parseInt(cols[overallIdx].trim(), 10);
      if (!isNaN(num) && num >= 1 && num <= 6) {
        overallTP = num;
      } else if (validModulesCount > 0) {
        overallTP = Math.round(moduleSum / validModulesCount);
      }
    } else if (validModulesCount > 0) {
      overallTP = Math.round(moduleSum / validModulesCount);
    }

    const attendanceRate = attendanceIdx !== -1 && cols[attendanceIdx] ? cols[attendanceIdx] : '95%';
    const teacherRemarks = remarkIdx !== -1 && cols[remarkIdx] ? cols[remarkIdx] : getDefaultTeacherRemark(overallTP);

    parsedStudents.push({
      id: lineIdx,
      name: rawName.replace(/^"|"$/g, '').toUpperCase(),
      ic: rawIc.replace(/^"|"$/g, ''),
      gender,
      modules,
      overall: overallTP,
      attendanceRate,
      teacherRemarks
    });
  }

  if (parsedStudents.length === 0) {
    errors.push('Tiada rekod murid berjaya dibaca daripada fail.');
  }

  return { students: parsedStudents, errors };
}
