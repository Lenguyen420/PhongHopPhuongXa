import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Video,
  LogOut,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '@/app/authSlice'

const navItems = [
  { label: 'Tổng quan', path: '/', icon: LayoutDashboard },
  { label: 'Lịch họp', path: '/lich-hop', icon: Calendar },
  { label: 'Tạo cuộc họp', path: '/cuoc-hop', icon: Video },
  { label: 'Phòng họp', path: '/phong-hop', icon: Building2 },
  { label: 'Tài liệu', path: '/tai-lieu', icon: FileText },
  { label: 'Biên bản', path: '/bien-ban', icon: ClipboardList },
  { label: 'Người dùng', path: '/nguoi-dung', icon: Users },
  { label: 'Báo cáo', path: '/bao-cao', icon: BarChart3 },
  { label: 'Cài đặt', path: '/cai-dat', icon: Settings },
]

function Sidebar() {
  const dispatch = useDispatch()
  return (
    <aside className="sticky top-0 z-20 bg-slate-950 px-3 py-3 text-white shadow-xl sm:px-4 sm:py-4 lg:min-h-svh lg:px-5 lg:py-6">
      <div className="hidden items-center gap-3 lg:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#2563EB] shadow-lg shadow-blue-950/30">
          <CalendarClock size={24} strokeWidth={2.4} />
        </div>
        <div>
          <p className="text-sm font-bold leading-5">Phòng họp</p>
          <p className="text-xs font-medium text-slate-400">Phường/Xã</p>
        </div>
      </div>

      <nav className="mt-0 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:mt-8 lg:grid lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              [
                'flex h-10 shrink-0 items-center gap-2 rounded-2xl px-3 text-xs font-semibold transition min-[420px]:h-11 min-[420px]:gap-3 min-[420px]:px-4 min-[420px]:text-sm',
                isActive
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-950/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              ].join(' ')
            }
            end={path === '/'}
            key={path}
            to={path}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={2.1} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        className="mt-3 hidden h-11 w-full items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white lg:flex"
        onClick={() => dispatch(logout())}
        type="button"
      >
        <LogOut size={18} /> Đăng xuất
      </button>
    </aside>
  )
}

export default Sidebar
