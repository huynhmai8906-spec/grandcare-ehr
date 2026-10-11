'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/', icon: 'space_dashboard', label: 'Tổng quan & Dashboard', dataPath: 'tong-quan-dashboard-vien' },
  { path: '/benh-nhan', icon: 'clinical_notes', label: 'Hồ Sơ Bệnh Nhân EHR', dataPath: 'quan-ly-benh-nhan-ehr' },
  { path: '/kho-duoc', icon: 'medication', label: 'Kho Dược & Đơn Thuốc', dataPath: 'kho-duoc-don-thuoc' },
  { path: '/bac-si', icon: 'badge', label: 'Bác Sĩ & Hội Đồng Y Khoa', dataPath: 'doi-ngu-bac-si-hoi-dong' },
  { path: '/lich-kham', icon: 'video_camera_front', label: 'Lịch Khám & Telehealth', dataPath: 'lich-kham-telehealth' },
  { path: '/so-do-phong', icon: 'single_bed', label: 'Sơ Đồ Phòng & Giường', dataPath: 'so-do-phong-giuong-lao-khoa' },
  { path: '/cap-cuu', icon: 'emergency', label: 'Cấp Cứu 115 & Dijkstra GPS', dataPath: 'trung-tam-cap-cuu-115-gps' },
  { path: '/cong-lien-ket', icon: 'hub', label: 'Cổng Liên Kết 2-Web', dataPath: 'cong-quan-tri-2-web-gateway' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-72 z-50 flex flex-col justify-between overflow-y-auto" 
      style={{ background: 'var(--surface-clean)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
      
      {/* Header Logo */}
      <div style={{ padding: '1.5rem' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
            style={{ background: 'var(--emerald-deep)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>local_hospital</span>
          </div>
          <div className="flex flex-col">
            <span className="font-newsreader font-bold leading-tight" 
              style={{ fontSize: '18px', color: 'var(--primary)' }}>GrandCare</span>
            <span className="uppercase tracking-wider" 
              style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--on-surface-variant)' }}>
              EHR & Ops Suite
            </span>
          </div>
        </div>

        {/* FHIR Status */}
        <div className="mb-4 flex items-center justify-between rounded-lg px-3 py-2"
          style={{ background: 'var(--surface-container-low)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--vital-stable)' }}></span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--on-surface)' }}>HL7 FHIR R4 Live</span>
          </div>
          <span className="rounded px-2 py-0.5" 
            style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-fixed)' }}>
            99.98%
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all"
              style={isActive(item.path) ? {
                background: 'var(--primary-container)',
                color: 'var(--on-primary)',
                fontWeight: 700,
              } : {
                color: 'var(--on-surface-variant)',
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'var(--surface-container-high)';
                  e.currentTarget.style.color = 'var(--on-surface)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--on-surface-variant)';
                }
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: isActive(item.path) ? 700 : 600 }}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer: SOS + User */}
      <div className="mt-auto" style={{ padding: '1.5rem', background: 'var(--surface-container-lowest)' }}>
        <div className="flex items-center justify-between rounded-lg px-3 py-2 mb-3"
          style={{ background: 'var(--error-container)', color: 'var(--on-error-container)' }}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined" 
              style={{ fontSize: '18px', color: 'var(--emergency-red)' }}>e911_emergency</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--emergency-red)' }}>Kênh SOS Trực Ban</span>
          </div>
          <span className="w-2 h-2 rounded-full animate-ping" style={{ background: 'var(--emergency-red)' }}></span>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ background: 'var(--primary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
          </div>
          <div className="flex flex-col">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--on-surface)' }}>GS. Đặng Hoàng Minh</span>
            <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>Viện Trưởng Điều Hành</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
