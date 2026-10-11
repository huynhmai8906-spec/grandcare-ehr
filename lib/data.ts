// GrandCare EHR - Mock Data Store
// For production: Replace with Supabase/PostgreSQL

export interface Patient {
  id: string;
  name: string;
  age: number;
  dob: string;
  cccd: string;
  insurance: string;
  room: string;
  wing: 'sala' | 'bachdang' | 'thaodien' | 'presidential';
  doctor: string;
  doctorId: string;
  status: 'stable' | 'watch' | 'rehab' | 'critical' | 'new';
  statusLabel: string;
  vitals: {
    hr: number;
    hrStatus: 'normal' | 'warning' | 'critical';
    bp: string;
    spo2: number;
    glucose: number;
    temp: number;
  };
  history: string;
  regime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  department: string;
  status: 'active' | 'on-call' | 'off';
  phone: string;
  email: string;
  patients: number;
  consultations: number;
  bio: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  price: number;
  supplier: string;
  expiryDate: string;
  status: 'available' | 'low' | 'critical' | 'expired';
  batchNumber: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medications: Array<{
    medicationId: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
  }>;
  status: 'pending' | 'dispensed' | 'cancelled';
  createdAt: string;
  dispensedAt?: string;
}

// ============ MOCK DATA ============

export const patientsDb: Record<string, Patient> = {
  'EHR-2026-0891': {
    id: 'EHR-2026-0891',
    name: 'Nguyễn Văn An',
    age: 68,
    dob: '1958-03-15',
    cccd: '079058001234',
    insurance: 'GD4790123456789',
    room: 'Phòng 302 Villa Sen Vàng Sala',
    wing: 'sala',
    doctor: 'PGS.TS Trần Vinh Quang',
    doctorId: 'DR-001',
    status: 'stable',
    statusLabel: 'Ổn Định',
    vitals: { hr: 74, hrStatus: 'normal', bp: '118/78', spo2: 99.1, glucose: 5.6, temp: 36.5 },
    history: 'Tăng huyết áp vô căn (10 năm), Đái tháo đường Type 2 kiểm soát tốt bằng Metformin. Không dị ứng thuốc ghi nhận.',
    regime: 'Holter ECG 24h, kiểm tra điện giải đồ sáng mai, tiếp tục chế độ dinh dưỡng giảm muối 4g/ngày.',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-12T02:30:00Z',
  },
  'EHR-2026-1044': {
    id: 'EHR-2026-1044',
    name: 'Trần Thị Mai',
    age: 74,
    dob: '1952-07-22',
    cccd: '079052002345',
    insurance: 'GD4790987654321',
    room: 'Phòng 205 Premier Bạch Đằng',
    wing: 'bachdang',
    doctor: 'TS.BS Lê Hồng Hùng',
    doctorId: 'DR-002',
    status: 'watch',
    statusLabel: 'Theo Dõi Nhịp Tim',
    vitals: { hr: 91, hrStatus: 'warning', bp: '135/88', spo2: 97.2, glucose: 6.8, temp: 37.1 },
    history: 'Rung nhĩ kịch phát, tiền sử TIA (2023). Dị ứng Penicillin. Đang dùng Warfarin 2.5mg/ngày.',
    regime: 'Theo dõi INR mỗi 48h, Holter 24h, hạn chế Vitamin K. Hội chẩn tim mạch can thiệp ngày mai.',
    createdAt: '2026-10-03T10:00:00Z',
    updatedAt: '2026-10-12T02:45:00Z',
  },
  'EHR-2026-0773': {
    id: 'EHR-2026-0773',
    name: 'Hoàng Quốc Tuấn',
    age: 81,
    dob: '1945-11-08',
    cccd: '079045003456',
    insurance: 'GD4790111222333',
    room: 'Phòng 108 Sanctuary Thảo Điền',
    wing: 'thaodien',
    doctor: 'BSCKII Vũ Thị Mai',
    doctorId: 'DR-003',
    status: 'rehab',
    statusLabel: 'Phục Hồi Hậu Tai Biến',
    vitals: { hr: 72, hrStatus: 'normal', bp: '125/82', spo2: 98.8, glucose: 5.2, temp: 36.8 },
    history: 'Đột quỵ nhồi máu não (8/2026), liệt nhẹ tay phải đang phục hồi. Tăng huyết áp có kiểm soát. Không dị ứng.',
    regime: 'Vật lý trị liệu 2 lần/ngày (08:00 và 15:00), ngôn ngữ trị liệu 1 lần/ngày, Aspirin 100mg/sáng.',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-10-12T03:00:00Z',
  },
};

export const doctorsDb: Record<string, Doctor> = {
  'DR-001': {
    id: 'DR-001',
    name: 'PGS.TS Trần Vinh Quang',
    title: 'PGS.TS',
    specialty: 'Tim mạch can thiệp',
    department: 'Khoa Tim Mạch Can Thiệp',
    status: 'active',
    phone: '028-1234-5678',
    email: 'tvquang@grandcare.vn',
    patients: 12,
    consultations: 48,
    bio: 'Chuyên gia tim mạch can thiệp hàng đầu, 25 năm kinh nghiệm. Nghiên cứu sinh tại ĐH Toulouse, Pháp. Thành viên Hội Tim Mạch Châu Á.',
  },
  'DR-002': {
    id: 'DR-002',
    name: 'TS.BS Lê Hồng Hùng',
    title: 'TS.BS',
    specialty: 'Lão khoa & Loạn nhịp tim',
    department: 'Khoa Lão Khoa',
    status: 'active',
    phone: '028-1234-5679',
    email: 'lhhung@grandcare.vn',
    patients: 15,
    consultations: 62,
    bio: 'Tiến sĩ Y khoa chuyên ngành Lão khoa, nghiên cứu sau tiến sĩ tại Mayo Clinic. Tác giả 40+ bài báo quốc tế.',
  },
  'DR-003': {
    id: 'DR-003',
    name: 'BSCKII Vũ Thị Mai',
    title: 'BSCKII',
    specialty: 'Phục hồi chức năng đột quỵ',
    department: 'Khoa Phục Hồi Chức Năng',
    status: 'on-call',
    phone: '028-1234-5680',
    email: 'vtmai@grandcare.vn',
    patients: 8,
    consultations: 35,
    bio: 'Bác sĩ chuyên khoa II Phục hồi chức năng, đào tạo tại Singapore General Hospital. Chuyên gia phục hồi đột quỵ.',
  },
  'DR-004': {
    id: 'DR-004',
    name: 'GS. Đặng Hoàng Minh',
    title: 'GS',
    specialty: 'Quản trị Y tế & Chính sách',
    department: 'Ban Giám Đốc',
    status: 'active',
    phone: '028-1234-5681',
    email: 'dhminh@grandcare.vn',
    patients: 0,
    consultations: 8,
    bio: 'Giáo sư Y khoa, Viện Trưởng Điều Hành GrandCare Medical. 35 năm trong ngành y tế, cố vấn Bộ Y Tế.',
  },
  'DR-005': {
    id: 'DR-005',
    name: 'ThS.BS Nguyễn Thanh Hà',
    title: 'ThS.BS',
    specialty: 'Nội tiết - Đái tháo đường',
    department: 'Khoa Nội Tiết',
    status: 'active',
    phone: '028-1234-5682',
    email: 'ntha@grandcare.vn',
    patients: 10,
    consultations: 28,
    bio: 'Thạc sĩ chuyên ngành Nội tiết, đào tạo tại Đài Loan. Chuyên gia điều trị đái tháo đường ở người cao tuổi.',
  },
};

export const medicationsDb: Record<string, Medication> = {
  'MED-001': {
    id: 'MED-001',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    category: 'Thuốc đái tháo đường',
    stock: 2400,
    unit: 'Viên',
    minStock: 500,
    price: 1200,
    supplier: 'Long Châu An Khang',
    expiryDate: '2027-06-30',
    status: 'available',
    batchNumber: 'LC2026A001',
  },
  'MED-002': {
    id: 'MED-002',
    name: 'Warfarin 2.5mg',
    genericName: 'Warfarin Sodium',
    category: 'Thuốc chống đông máu',
    stock: 320,
    unit: 'Viên',
    minStock: 200,
    price: 3500,
    supplier: 'Long Châu An Khang',
    expiryDate: '2027-03-15',
    status: 'low',
    batchNumber: 'LC2026B002',
  },
  'MED-003': {
    id: 'MED-003',
    name: 'Aspirin 100mg',
    genericName: 'Acetylsalicylic Acid',
    category: 'Thuốc chống kết tập tiểu cầu',
    stock: 5000,
    unit: 'Viên',
    minStock: 1000,
    price: 800,
    supplier: 'Long Châu An Khang',
    expiryDate: '2028-01-31',
    status: 'available',
    batchNumber: 'LC2026C003',
  },
  'MED-004': {
    id: 'MED-004',
    name: 'Rosuvastatin 20mg',
    genericName: 'Rosuvastatin Calcium',
    category: 'Thuốc hạ mỡ máu (Statin)',
    stock: 180,
    unit: 'Viên',
    minStock: 300,
    price: 8500,
    supplier: 'AstraZeneca VN',
    expiryDate: '2027-09-30',
    status: 'critical',
    batchNumber: 'AZ2026D004',
  },
  'MED-005': {
    id: 'MED-005',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate',
    category: 'Thuốc hạ huyết áp (CCB)',
    stock: 1800,
    unit: 'Viên',
    minStock: 400,
    price: 2200,
    supplier: 'Long Châu An Khang',
    expiryDate: '2027-12-31',
    status: 'available',
    batchNumber: 'LC2026E005',
  },
  'MED-006': {
    id: 'MED-006',
    name: 'NaCl 0.9% 500ml',
    genericName: 'Natrium Chloride',
    category: 'Dung dịch truyền tĩnh mạch',
    stock: 450,
    unit: 'Chai',
    minStock: 100,
    price: 25000,
    supplier: 'Fresenius Kabi VN',
    expiryDate: '2027-08-15',
    status: 'available',
    batchNumber: 'FK2026F006',
  },
};

export const prescriptionsDb: Record<string, Prescription> = {
  'RX-2026-001': {
    id: 'RX-2026-001',
    patientId: 'EHR-2026-0891',
    patientName: 'Nguyễn Văn An',
    doctorId: 'DR-001',
    doctorName: 'PGS.TS Trần Vinh Quang',
    medications: [
      { medicationId: 'MED-001', name: 'Metformin 500mg', dosage: '500mg', frequency: '2 lần/ngày', duration: '30 ngày', quantity: 60 },
      { medicationId: 'MED-005', name: 'Amlodipine 5mg', dosage: '5mg', frequency: '1 lần/sáng', duration: '30 ngày', quantity: 30 },
    ],
    status: 'dispensed',
    createdAt: '2026-10-10T09:00:00Z',
    dispensedAt: '2026-10-10T10:30:00Z',
  },
  'RX-2026-002': {
    id: 'RX-2026-002',
    patientId: 'EHR-2026-1044',
    patientName: 'Trần Thị Mai',
    doctorId: 'DR-002',
    doctorName: 'TS.BS Lê Hồng Hùng',
    medications: [
      { medicationId: 'MED-002', name: 'Warfarin 2.5mg', dosage: '2.5mg', frequency: '1 lần/tối', duration: '14 ngày', quantity: 14 },
    ],
    status: 'pending',
    createdAt: '2026-10-12T02:00:00Z',
  },
};

export const dashboardStats = {
  totalPatients: 48,
  inpatients: 36,
  vipRooms: 52,
  occupiedRooms: 48,
  activeAlerts: 2,
  pendingPrescriptions: 8,
  consultationsToday: 14,
  fhirUptime: 99.98,
  activeDoctors: 12,
  emergencyResponse: '< 90 Giây',
};
