// API: GET /api/dashboard
import { NextResponse } from 'next/server';
import { patientsDb, doctorsDb, medicationsDb, prescriptionsDb, dashboardStats } from '@/lib/data';

export async function GET() {
  const patients = Object.values(patientsDb);
  const medications = Object.values(medicationsDb);
  const prescriptions = Object.values(prescriptionsDb);

  const stats = {
    ...dashboardStats,
    // Live computed stats
    totalPatientsDb: patients.length,
    stablePatients: patients.filter(p => p.status === 'stable').length,
    watchPatients: patients.filter(p => p.status === 'watch').length,
    criticalAlerts: patients.filter(p => p.vitals.hrStatus === 'critical' || p.vitals.hrStatus === 'warning').length,
    lowStockMeds: medications.filter(m => m.status === 'low' || m.status === 'critical').length,
    pendingPrescriptions: prescriptions.filter(p => p.status === 'pending').length,
    totalDoctors: Object.keys(doctorsDb).length,
    activeDoctorsDb: Object.values(doctorsDb).filter(d => d.status === 'active').length,
  };

  // Recent activity feed (simulated)
  const recentEvents = [
    { type: 'OBX', level: 'info', message: 'EHR-2026-0891: Vitals sync hoàn tất qua Telemetry Hub GW-Sala-3', time: '10:42:15' },
    { type: 'ALM', level: 'warn', message: 'EHR-2026-1044: Rung nhĩ dạng nhẹ (Sinus Tachycardia alert) gửi tới TS. Lê Hồng Hùng', time: '10:41:02' },
    { type: 'RX', level: 'info', message: 'RX-2026-002: Đơn Warfarin 2.5mg đang chờ cấp phát kho dược Sala', time: '10:39:45' },
    { type: 'ADT', level: 'success', message: 'EHR-2026-0773: Vật lý trị liệu buổi chiều hoàn thành - tiến triển tốt', time: '10:35:22' },
  ];

  return NextResponse.json({ 
    stats, 
    recentEvents,
    timestamp: new Date().toISOString()
  });
}
