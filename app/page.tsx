import Header from '@/components/Header';
import { dashboardStats } from '@/lib/data';

const kpiCards = [
  { label: 'Tổng Bệnh Nhân Nội Trú', value: '48', sub: '36 đang điều trị tích cực', icon: 'groups', color: 'var(--primary)' },
  { label: 'Phòng VIP Đang Hoạt Động', value: '48/52', sub: 'Công suất 92.3%', icon: 'hotel', color: 'var(--sapphire-dispatch)' },
  { label: 'Ca Cảnh Báo Nhịp Tim', value: '02', sub: 'Cần theo dõi khẩn', icon: 'monitor_heart', color: 'var(--emergency-red)' },
  { label: 'Bác Sĩ Đang Trực', value: '12', sub: '100% Cấp phép Bộ Y Tế', icon: 'stethoscope', color: 'var(--vital-stable)' },
  { label: 'Hội Chẩn Hôm Nay', value: '14', sub: '8 đã hoàn thành', icon: 'groups_2', color: 'var(--telehealth-teal)' },
  { label: 'Đơn Thuốc Đang Chờ', value: '08', sub: 'Kho dược đang cấp phát', icon: 'medication', color: 'var(--clinical-amber)' },
  { label: 'Thời Gian Phản Hồi SOS', value: '< 90s', sub: 'Chuẩn JCI International', icon: 'emergency', color: 'var(--emergency-red)' },
  { label: 'FHIR Gateway Uptime', value: '99.98%', sub: 'HL7 R4 Certified', icon: 'verified_user', color: 'var(--emerald-deep)' },
];

const recentEvents = [
  { type: 'OBX|1|NM', level: 'info', message: 'EHR-2026-0891: Vitals sync hoàn tất qua Telemetry Hub GW-Sala-3', time: '10:42:15', bg: 'var(--secondary-fixed)', color: 'var(--on-secondary-fixed)' },
  { type: 'ALM|2|WARN', level: 'warn', message: 'EHR-2026-1044: Rung nhĩ dạng nhẹ (Sinus Tachycardia alert) gửi tới TS. Lê Hồng Hùng', time: '10:41:02', bg: 'var(--tertiary-fixed)', color: 'var(--on-tertiary-fixed)' },
  { type: 'RX|3|PEND', level: 'pending', message: 'RX-2026-002: Đơn Warfarin 2.5mg đang chờ cấp phát kho dược Sala', time: '10:39:45', bg: 'var(--surface-container)', color: 'var(--on-surface)' },
  { type: 'ADT|4|OK', level: 'success', message: 'EHR-2026-0773: Vật lý trị liệu buổi chiều hoàn thành - tiến triển tốt', time: '10:35:22', bg: 'var(--primary-fixed)', color: 'var(--on-primary-fixed)' },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      <Header title="Tổng Quan Dashboard" icon="space_dashboard" subtitle="GrandCare Medical VIP Geriatric Center — HL7 FHIR R4 Enterprise Suite" />
      
      <main style={{ paddingTop: '4rem' }}>
        {/* Top Banner */}
        <div className="flex items-center justify-between px-6 py-4" 
          style={{ background: 'var(--surface-clean)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'var(--primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>space_dashboard</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--emerald-deep)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  HL7 FHIR R4 Enterprise Clinical Suite
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" 
                  style={{ background: 'var(--secondary-fixed)', fontSize: '10px' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: 'var(--vital-stable)' }}></span>
                  Sync Active (Port 8443)
                </span>
              </div>
              <h1 className="font-newsreader font-bold" style={{ fontSize: '24px', color: 'var(--primary)', lineHeight: '1.2' }}>
                Tổng Quan Viện & Dashboard Điều Hành
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div className="px-3 py-1.5 rounded-lg" style={{ background: 'var(--primary-fixed)', color: 'var(--primary)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700 }}>
                🏥 GrandCare Medical VIP Geriatric Center
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* KPI Grid 4x2 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, i) => (
              <div key={i} className="rounded-xl p-4 relative overflow-hidden flex flex-col justify-between"
                style={{ background: 'var(--surface-clean)', boxShadow: '0 2px 8px -2px rgba(44,49,57,0.04)' }}>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-10"
                  style={{ background: kpi.color }}></div>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {kpi.label}
                  </span>
                  <span className="p-1 rounded" style={{ background: 'var(--surface-container-low)', color: kpi.color }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{kpi.icon}</span>
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: kpi.color, lineHeight: '1', fontFamily: 'Manrope, sans-serif' }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>{kpi.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* HL7 Event Stream */}
            <div className="rounded-xl p-5" style={{ background: 'var(--surface-clean)', boxShadow: '0 2px 8px -2px rgba(44,49,57,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ color: 'var(--emerald-deep)' }}>sync_saved_locally</span>
                  <h2 className="font-newsreader font-bold" style={{ fontSize: '18px', color: 'var(--primary)' }}>
                    HL7 v2.5.1 / FHIR R4 Event Stream
                  </h2>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>Cập nhật mỗi 30s</span>
              </div>
              <div className="flex flex-col gap-2">
                {recentEvents.map((evt, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg"
                    style={{ background: 'var(--surface-container-low)' }}>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded font-mono text-[11px] font-bold"
                        style={{ background: evt.bg, color: evt.color }}>
                        {evt.type}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--on-surface)' }}>{evt.message}</span>
                    </div>
                    <span className="font-mono ml-2 flex-shrink-0" style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status Overview */}
            <div className="rounded-xl p-5" style={{ background: 'var(--surface-clean)', boxShadow: '0 2px 8px -2px rgba(44,49,57,0.04)' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>analytics</span>
                <h2 className="font-newsreader font-bold" style={{ fontSize: '18px', color: 'var(--primary)' }}>
                  Chỉ Số Hoạt Động Viện
                </h2>
              </div>
              
              {/* Patient status breakdown */}
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Bệnh nhân ổn định', count: 1, total: 3, color: 'var(--vital-stable)', pct: 33 },
                  { label: 'Đang theo dõi nhịp tim', count: 1, total: 3, color: 'var(--clinical-amber)', pct: 33 },
                  { label: 'Phục hồi chức năng', count: 1, total: 3, color: 'var(--sapphire-dispatch)', pct: 33 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: '12px', color: 'var(--on-surface)' }}>{item.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: item.color }}>{item.count}/{item.total}</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'var(--surface-container-high)' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance badges */}
              <div className="mt-5 pt-4 grid grid-cols-2 gap-2" style={{ borderTop: '1px solid var(--surface-container)' }}>
                {[
                  { icon: 'verified_user', label: 'HL7® FHIR® R4', sub: 'Validated', color: 'var(--primary)' },
                  { icon: 'security', label: 'JCI Accredited', sub: '2026 Certified', color: 'var(--sapphire-dispatch)' },
                  { icon: 'privacy_tip', label: 'HIPAA Compliant', sub: 'Data Encrypted', color: 'var(--vital-stable)' },
                  { icon: 'assured_workload', label: 'ISO 27001', sub: 'Info Security', color: 'var(--clinical-amber)' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: 'var(--surface-container-low)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: badge.color }}>{badge.icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: badge.color }}>{badge.label}</div>
                      <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>{badge.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
