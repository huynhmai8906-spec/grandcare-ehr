'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function Header({ title, subtitle, icon = 'verified' }: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-72 right-0 h-16 z-40 flex items-center justify-between px-6"
      style={{
        background: 'rgba(251, 253, 253, 0.9)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" 
            style={{ fontSize: '20px', color: 'var(--telehealth-teal)' }}>{icon}</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--on-surface)' }}>
            {subtitle || 'Quản Trị Viện Phí & Y Tế Cao Cấp'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* FHIR Gateway Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{ background: 'var(--surface-container-low)' }}>
          <span className="material-symbols-outlined" 
            style={{ fontSize: '16px', color: 'var(--sapphire-dispatch)' }}>router</span>
          <span style={{ fontSize: '10px', color: 'var(--on-surface)' }}>
            FHIR Gateway: <strong style={{ color: 'var(--emerald-deep)' }}>CONNECTED (ms 18)</strong>
          </span>
        </div>

        {/* SOS Button */}
        <button
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg"
          style={{ background: 'var(--emergency-red)', color: 'var(--on-error)' }}
          onClick={() => alert('⚠️ Kênh SOS đang kết nối... Đội cấp cứu đang được thông báo.')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>notification_important</span>
          <span style={{ fontSize: '12px', fontWeight: 700 }}>Báo Động Đỏ SOS</span>
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ background: 'var(--primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
        </div>
      </div>
    </header>
  );
}
