'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

interface Patient {
  id: string;
  name: string;
  age: number;
  dob: string;
  cccd: string;
  room: string;
  wing: string;
  doctor: string;
  doctorId: string;
  status: string;
  statusLabel: string;
  vitals: { hr: number; hrStatus: string; bp: string; spo2: number; glucose: number; temp: number };
  history: string;
  regime: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  stable: { bg: '#E0F2F1', color: '#0D5C58' },
  watch: { bg: '#FFF9E0', color: '#6A4D0C' },
  rehab: { bg: '#E8EAF6', color: '#1B3B5F' },
  critical: { bg: '#FFDAD6', color: '#93000A' },
  new: { bg: '#ABEFE9', color: '#00201E' },
};

const wingLabels: Record<string, string> = {
  sala: 'Villa Sen Vàng Sala',
  bachdang: 'Premier Bạch Đằng',
  thaodien: 'Sanctuary Thảo Điền',
  presidential: 'Presidential Suite',
};

export default function BenhNhanPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWing, setFilterWing] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFhir, setShowFhir] = useState(false);
  const [fhirData, setFhirData] = useState('');
  const [loading, setLoading] = useState(true);
  const [streamActive, setStreamActive] = useState(true);
  const [vitalHr, setVitalHr] = useState(78);
  const [vitalBp, setVitalBp] = useState('120/80');
  const [vitalSpo2, setVitalSpo2] = useState(98.5);
  const [vitalGlucose, setVitalGlucose] = useState(5.6);

  // Form state
  const [form, setForm] = useState({
    name: '', dob: '1955-06-15', cccd: '', insurance: '',
    room: 'Phòng 303 Villa Sen Vàng Sala', doctorId: 'DR-001',
    doctor: 'PGS.TS Trần Vinh Quang', wing: 'sala', history: ''
  });

  const fetchPatients = async () => {
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (filterWing) params.set('wing', filterWing);
    if (search) params.set('search', search);
    
    const res = await fetch(`/api/patients?${params}`);
    const json = await res.json();
    setPatients(json.data || []);
    if (json.data?.length > 0 && !selected) {
      setSelected(json.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, [filterStatus, filterWing, search]);

  // Simulate live vitals
  useEffect(() => {
    if (!streamActive) return;
    const interval = setInterval(() => {
      setVitalHr(prev => Math.max(60, Math.min(100, prev + Math.floor(Math.random() * 7) - 3)));
      setVitalSpo2(prev => Math.max(95, Math.min(100, +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1))));
    }, 2000);
    return () => clearInterval(interval);
  }, [streamActive]);

  const handleSelectPatient = async (id: string) => {
    const res = await fetch(`/api/patients/${id}`);
    const json = await res.json();
    if (json.data) {
      setSelected(json.data);
      setVitalHr(json.data.vitals.hr);
      setVitalBp(json.data.vitals.bp);
      setVitalSpo2(json.data.vitals.spo2);
      setVitalGlucose(json.data.vitals.glucose);
    }
  };

  const handleOpenFhir = async () => {
    if (!selected) return;
    const res = await fetch(`/api/patients/${selected.id}`);
    const json = await res.json();
    setFhirData(JSON.stringify(json.fhir, null, 2));
    setShowFhir(true);
  };

  const handleSubmitPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (res.ok) {
      alert(json.message);
      setShowModal(false);
      await fetchPatients();
    } else {
      alert(json.error || 'Lỗi tạo bệnh nhân');
    }
  };

  const handleDeletePatient = async () => {
    if (!selected) return;
    const confirm = prompt(`CẢNH BÁO AN TOÀN Y TẾ:\nNhập mã "${selected.id}" để xác nhận hủy hồ sơ:`);
    if (confirm === selected.id) {
      await fetch(`/api/patients/${selected.id}`, { method: 'DELETE' });
      setSelected(null);
      await fetchPatients();
    } else {
      alert('Mã xác nhận không khớp. Thao tác hủy bỏ.');
    }
  };

  const filterTabs = [
    { key: 'all', label: `Tất cả (${patients.length})` },
    { key: 'stable', label: 'Ổn định' },
    { key: 'watch', label: 'Theo dõi tim' },
    { key: 'rehab', label: 'Hậu tai biến' },
    { key: 'critical', label: 'Cấp cứu' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      <Header title="Hồ Sơ Bệnh Nhân EHR" icon="clinical_notes" />
      
      <main style={{ paddingTop: '4rem' }}>
        {/* Top Command Ribbon */}
        <div className="px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4"
          style={{ background: 'var(--surface-clean)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'var(--primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>clinical_notes</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--emerald-deep)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  HL7 FHIR R4 Enterprise Clinical Suite
                </span>
              </div>
              <h1 className="font-newsreader font-bold" style={{ fontSize: '22px', color: 'var(--primary)' }}>
                Quản Lý Bệnh Nhân & Hồ Sơ EHR Master
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
              style={{ background: 'var(--surface-container-low)' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>Tổng nội trú VIP</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>48 / 52 Phòng</div>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--outline-variant)' }}></div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>Cảnh báo nhịp tim</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--emergency-red)' }}>02 Ca cần lưu ý</div>
              </div>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white"
              style={{ background: 'var(--emerald-deep)', fontSize: '14px', fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
              Tiếp Nhận Bệnh Nhân Mới
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT: Patient Roster (7 cols) */}
          <div className="xl:col-span-7 flex flex-col gap-4">
            {/* Search & Filters */}
            <div className="rounded-xl p-4" style={{ background: 'var(--surface-clean)', boxShadow: '0 2px 8px -2px rgba(44,49,57,0.04)' }}>
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-3">
                <div className="relative w-full md:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]"
                    style={{ color: 'var(--on-surface-variant)' }}>search</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                    style={{ background: 'var(--surface-container-low)', color: 'var(--on-surface)', fontSize: '14px', border: 'none' }}
                    placeholder="Tìm theo tên, mã EHR, CCCD, phòng..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {filterTabs.map(tab => (
                    <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
                      className="px-3 py-1.5 rounded-full whitespace-nowrap"
                      style={{
                        fontSize: '12px', fontWeight: 600,
                        background: filterStatus === tab.key ? 'var(--primary)' : 'var(--surface-container)',
                        color: filterStatus === tab.key ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                      }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'var(--surface-container-lowest)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--sapphire-dispatch)' }}>apartment</span>
                  <select className="bg-transparent w-full focus:outline-none" style={{ fontSize: '12px', color: 'var(--on-surface)' }}
                    value={filterWing} onChange={e => setFilterWing(e.target.value)}>
                    <option value="">Khu nghỉ dưỡng (Tất cả)</option>
                    <option value="sala">Villa Sen Vàng Sala</option>
                    <option value="bachdang">Premier Bạch Đằng</option>
                    <option value="thaodien">Sanctuary Thảo Điền</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'var(--surface-container-lowest)' }}>
                  <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--clinical-amber)' }}>tune</span>
                  <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Tổng: </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--on-surface)' }}>{patients.length} bệnh nhân</span>
                </div>
              </div>
            </div>

            {/* Patient Cards */}
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center py-8" style={{ color: 'var(--on-surface-variant)' }}>Đang tải dữ liệu...</div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--on-surface-variant)' }}>Không tìm thấy bệnh nhân</div>
              ) : patients.map(patient => {
                const sc = statusColors[patient.status] || statusColors.stable;
                const isSelected = selected?.id === patient.id;
                const leftBgMap: Record<string, string> = {
                  stable: 'var(--vital-stable)',
                  watch: 'var(--clinical-amber)',
                  rehab: 'var(--sapphire-dispatch)',
                  critical: 'var(--emergency-red)',
                  new: 'var(--emerald-deep)',
                };
                return (
                  <div key={patient.id}
                    className="rounded-xl p-4 relative overflow-hidden cursor-pointer"
                    style={{
                      background: 'var(--surface-clean)',
                      boxShadow: isSelected ? '0 4px 16px rgba(13,92,88,0.15)' : '0 2px 8px -2px rgba(44,49,57,0.04)',
                      outline: isSelected ? '2px solid var(--emerald-deep)' : 'none',
                    }}
                    onClick={() => handleSelectPatient(patient.id)}>
                    {/* Left status bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                      style={{ background: leftBgMap[patient.status] || 'var(--vital-stable)' }}></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pl-2">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                          style={{ background: 'var(--primary)', fontSize: '22px' }}>
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{patient.name}</h2>
                            <span className="px-2 py-0.5 rounded font-mono" 
                              style={{ fontSize: '10px', fontWeight: 700, background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)' }}>
                              {patient.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full" 
                              style={{ fontSize: '10px', fontWeight: 700, background: sc.bg, color: sc.color }}>
                              {patient.statusLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mb-1" style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                            <span>{patient.age} tuổi</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--sapphire-dispatch)' }}>hotel</span>
                              {patient.room}
                            </span>
                          </div>
                          <div className="flex items-center gap-2" style={{ fontSize: '12px' }}>
                            <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--emerald-deep)' }}>health_and_safety</span>
                            <span>BS phụ trách: <strong style={{ color: 'var(--primary)' }}>{patient.doctor}</strong></span>
                          </div>
                        </div>
                      </div>
                      {/* Vitals mini */}
                      <div className="flex md:flex-col items-end gap-2 p-3 rounded-lg flex-shrink-0"
                        style={{ background: 'var(--surface-container-low)' }}>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>HR</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: patient.vitals.hrStatus === 'normal' ? 'var(--vital-stable)' : 'var(--emergency-red)' }}>
                            {patient.vitals.hr} bpm
                          </span>
                          {patient.vitals.hrStatus !== 'normal' && (
                            <span className="material-symbols-outlined animate-pulse text-[16px]" style={{ color: 'var(--emergency-red)' }}>crisis_alert</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>BP</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--on-surface)' }}>{patient.vitals.bp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>SpO2</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--emerald-deep)' }}>{patient.vitals.spo2}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Live Telemetry (5 cols) */}
          <div className="xl:col-span-5 flex flex-col gap-4">
            {/* Live Vital Stream */}
            <div className="rounded-xl p-4" style={{ background: 'var(--surface-clean)', boxShadow: '0 2px 8px -2px rgba(44,49,57,0.04)' }}>
              <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--surface-container)' }}>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--surface-container-low)' }}>
                    <span className="w-3 h-3 rounded-full animate-ping absolute" style={{ background: 'var(--vital-stable)' }}></span>
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--vital-stable)' }}></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>Live Pulse Telemetry</span>
                      {streamActive && (
                        <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(46,107,71,0.1)', color: 'var(--vital-stable)', fontSize: '10px', fontWeight: 700 }}>
                          LIVE STREAM ACTIVE
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                      Bệnh nhân: {selected?.name || 'Chọn bệnh nhân'} ({selected?.id || '—'})
                    </span>
                  </div>
                </div>
                <button onClick={() => setStreamActive(!streamActive)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: 'var(--surface-container-high)', fontSize: '12px', fontWeight: 600, color: 'var(--on-surface)' }}>
                  <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--vital-stable)' }}>
                    {streamActive ? 'sensors' : 'sensors_off'}
                  </span>
                  {streamActive ? 'Tạm dừng' : 'Kích hoạt'}
                </button>
              </div>

              {/* ECG Display */}
              <div className="relative rounded-xl p-4 mb-4 overflow-hidden"
                style={{ background: 'var(--inverse-surface)', color: 'var(--inverse-on-surface)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono uppercase tracking-wider" style={{ fontSize: '11px', color: '#8fd3cd' }}>
                    Lead II • 25mm/s • 10mm/mV
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--vital-stable)' }}></span>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--vital-stable)', fontWeight: 700 }}>ECG REALTIME</span>
                  </div>
                </div>
                <div className="w-full overflow-hidden" style={{ height: '80px' }}>
                  <svg className="w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ecgGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#0D5C58" stopOpacity="0.2" />
                        <stop offset="70%" stopColor="#2E6B47" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#abefe9" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 20 L 600 20 M 0 40 L 600 40 M 0 60 L 600 60 M 0 80 L 600 80"
                      fill="none" stroke="#3f4947" strokeDasharray="3,3" strokeWidth="0.3" />
                    <path d="M 0 50 Q 20 50 30 50 T 40 45 T 50 50 T 60 55 T 70 50 L 80 50 L 85 20 L 92 88 L 100 45 L 108 52 L 120 50 Q 140 50 160 50 T 170 45 T 180 50 T 190 55 T 200 50 L 210 50 L 215 20 L 222 88 L 230 45 L 238 52 L 250 50 Q 270 50 290 50 T 300 45 T 310 50 T 320 55 T 330 50 L 340 50 L 345 20 L 352 88 L 360 45 L 368 52 L 380 50 Q 400 50 420 50 T 430 45 T 440 50 T 450 55 T 460 50 L 470 50 L 475 20 L 482 88 L 490 45 L 498 52 L 510 50 Q 530 50 550 50 T 560 45 T 570 50 T 580 55 T 590 50 L 600 50"
                      fill="none" stroke="url(#ecgGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex items-center justify-between mt-1 font-mono" style={{ fontSize: '11px', color: '#6f7978' }}>
                  <span>ST Segment: Normal (+0.04mV)</span>
                  <span>PR Interval: 142ms</span>
                  <span>QTC: 412ms</span>
                </div>
              </div>

              {/* 4 Vitals */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'NHỊP TIM (HR)', value: vitalHr.toString(), unit: 'bpm', sub: 'Sinus Rhythm', icon: 'favorite', color: 'var(--emergency-red)', barColor: 'var(--emerald-deep)', barPct: Math.min(100, (vitalHr/120)*100) },
                  { label: 'HUYẾT ÁP (NIBP)', value: vitalBp, unit: 'mmHg', sub: 'Tối ưu', icon: 'speed', color: 'var(--sapphire-dispatch)', barColor: 'var(--sapphire-dispatch)', barPct: 70 },
                  { label: 'NỒNG ĐỘ SpO2', value: vitalSpo2.toString(), unit: '%', sub: 'Khí phòng', icon: 'air', color: 'var(--telehealth-teal)', barColor: 'var(--vital-stable)', barPct: vitalSpo2 },
                  { label: 'ĐƯỜNG HUYẾT', value: vitalGlucose.toString(), unit: 'mmol/L', sub: 'Sau ăn 2h', icon: 'water_drop', color: 'var(--clinical-amber)', barColor: 'var(--clinical-amber)', barPct: 60 },
                ].map((vital, i) => (
                  <div key={i} className="p-3 rounded-xl flex flex-col justify-between"
                    style={{ background: 'var(--surface-container-low)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]" style={{ color: vital.color }}>{vital.icon}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--on-surface-variant)' }}>{vital.label}</span>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--vital-stable)' }}>{vital.sub}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 my-1">
                      <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Manrope' }}>{vital.value}</span>
                      <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{vital.unit}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-container)' }}>
                      <div className="h-full rounded-full" style={{ width: `${vital.barPct}%`, background: vital.barColor }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Info Panel */}
            {selected && (
              <div className="rounded-xl p-4 flex flex-col gap-3"
                style={{ background: 'var(--surface-container-lowest)', boxShadow: '0 2px 8px -2px rgba(44,49,57,0.04)' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>Hồ sơ lâm sàng đang mở</span>
                  <span className="font-mono" style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{selected.id}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--on-surface)' }}>
                  <p className="mb-1"><strong>Tiền sử:</strong> {selected.history}</p>
                  <p><strong>Chỉ định:</strong> {selected.regime}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2" style={{ borderTop: '1px solid var(--surface-container)' }}>
                  <button onClick={handleOpenFhir}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg"
                    style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface)', fontSize: '13px', fontWeight: 600 }}>
                    <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--sapphire-dispatch)' }}>code</span>
                    Xem FHIR JSON
                  </button>
                  <button onClick={handleDeletePatient}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg"
                    style={{ background: 'var(--primary-container)', color: 'var(--on-primary)', fontSize: '13px', fontWeight: 600 }}>
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Xóa Hồ Sơ
                  </button>
                </div>
              </div>
            )}

            {/* Compliance */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface-container-low)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--primary-fixed)', color: 'var(--primary)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>verified_user</span>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>HL7® FHIR® R4 Validated</div>
                  <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Profile: GrandCare Geriatric Clinical Spec 2026</div>
                </div>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--vital-stable)' }}>check_circle</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Add Patient */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(44,49,57,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--surface-clean)', boxShadow: '0 16px 36px -6px rgba(27,59,95,0.16)', maxHeight: '90vh' }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid var(--surface-container)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--emerald-deep)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person_add_alt</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-newsreader font-bold" style={{ fontSize: '18px', color: 'var(--primary)' }}>
                      Tiếp Nhận & Khởi Tạo Hồ Sơ Bệnh Nhân EHR
                    </h3>
                    <span className="px-2 py-0.5 rounded" style={{ background: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)', fontSize: '10px', fontWeight: 700 }}>
                      HL7/FHIR R4
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>
                    Tạo hồ sơ bệnh án nội trú tiêu chuẩn y tế quốc tế
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ color: 'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitPatient} className="p-6 overflow-y-auto flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'name', label: 'Họ và tên bệnh nhân', placeholder: 'Ví dụ: Đặng Thu Thảo', type: 'text', key: 'name' },
                  { id: 'dob', label: 'Ngày sinh (DOB)', placeholder: '', type: 'date', key: 'dob' },
                  { id: 'cccd', label: 'Số CCCD / Định danh quốc gia', placeholder: '079055001234', type: 'text', key: 'cccd' },
                  { id: 'insurance', label: 'Mã thẻ BHYT / Bảo hiểm Quốc Tế', placeholder: 'GD4790123456789', type: 'text', key: 'insurance' },
                ].map(field => (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>
                      {field.label} <span style={{ color: 'var(--emergency-red)' }}>*</span>
                    </label>
                    <input
                      className="px-3.5 py-2.5 rounded-lg focus:outline-none"
                      style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '14px' }}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      required={field.key === 'name' || field.key === 'cccd'}
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>
                    Phòng bố trí nghỉ dưỡng <span style={{ color: 'var(--emergency-red)' }}>*</span>
                  </label>
                  <select
                    className="px-3.5 py-2.5 rounded-lg focus:outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '14px' }}
                    value={form.room}
                    onChange={e => {
                      const wings: Record<string, string> = {
                        'Phòng 303 Villa Sen Vàng Sala': 'sala',
                        'Phòng 206 Premier Bạch Đằng': 'bachdang',
                        'Phòng 109 Sanctuary Thảo Điền': 'thaodien',
                        'Phòng VIP 501 Presidential Suite': 'presidential',
                      };
                      setForm({ ...form, room: e.target.value, wing: wings[e.target.value] || 'sala' });
                    }}>
                    <option>Phòng 303 Villa Sen Vàng Sala</option>
                    <option>Phòng 206 Premier Bạch Đằng</option>
                    <option>Phòng 109 Sanctuary Thảo Điền</option>
                    <option>Phòng VIP 501 Presidential Suite</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>
                    Bác sĩ điều trị phụ trách <span style={{ color: 'var(--emergency-red)' }}>*</span>
                  </label>
                  <select
                    className="px-3.5 py-2.5 rounded-lg focus:outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '14px' }}
                    value={form.doctorId}
                    onChange={e => {
                      const names: Record<string, string> = {
                        'DR-001': 'PGS.TS Trần Vinh Quang',
                        'DR-002': 'TS.BS Lê Hồng Hùng',
                        'DR-003': 'BSCKII Vũ Thị Mai',
                      };
                      setForm({ ...form, doctorId: e.target.value, doctor: names[e.target.value] || '' });
                    }}>
                    <option value="DR-001">PGS.TS Trần Vinh Quang (Tim mạch can thiệp)</option>
                    <option value="DR-002">TS.BS Lê Hồng Hùng (Lão khoa & Loạn nhịp tim)</option>
                    <option value="DR-003">BSCKII Vũ Thị Mai (Phục hồi chức năng đột quỵ)</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--on-surface)' }}>
                  Tiền sử bệnh, Dị ứng & Chẩn đoán ban đầu
                </label>
                <textarea
                  className="px-3.5 py-2.5 rounded-lg focus:outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontSize: '14px' }}
                  placeholder="Ví dụ: Rung nhĩ kịch phát, tiền sử tai biến thoáng qua TIA (2023), Dị ứng Penicillin..."
                  rows={3}
                  value={form.history}
                  onChange={e => setForm({ ...form, history: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg"
                  style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface)', fontWeight: 600 }}>
                  Hủy
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-lg text-white"
                  style={{ background: 'var(--emerald-deep)', fontWeight: 700, fontSize: '15px' }}>
                  Khởi Tạo Hồ Sơ HL7/FHIR R4
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: FHIR JSON Viewer */}
      {showFhir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(44,49,57,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-3xl rounded-2xl overflow-hidden flex flex-col"
            style={{ background: 'var(--surface-clean)', boxShadow: '0 16px 36px -6px rgba(27,59,95,0.16)', maxHeight: '90vh' }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'var(--inverse-surface)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>data_object</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>HL7® FHIR® R4 Bundle Viewer</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                    Bệnh nhân: {selected?.name} • Mã EHR: {selected?.id}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const blob = new Blob([fhirData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `${selected?.id}-FHIR-R4-Bundle.json`;
                  a.click(); URL.revokeObjectURL(url);
                }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white"
                  style={{ background: 'rgba(255,255,255,0.15)', fontSize: '13px', fontWeight: 600 }}>
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Tải JSON
                </button>
                <button onClick={() => setShowFhir(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                </button>
              </div>
            </div>
            <pre className="p-6 overflow-auto font-mono"
              style={{ fontSize: '12px', background: '#1a1e26', color: '#8fd3cd', flex: 1, maxHeight: '60vh' }}>
              {fhirData}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
