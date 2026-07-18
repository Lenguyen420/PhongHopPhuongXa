import { BriefcaseBusiness, Crown, Shield, UserCog, UserRound, Users } from 'lucide-react'

const roleIcons = {
  'Tất cả người dùng': Users,
  'Quản trị hệ thống': Shield,
  'Lãnh đạo': Crown,
  'Thư ký': UserCog,
  'Trưởng phòng/Ban': BriefcaseBusiness,
  'Thành viên': UserRound,
}

function UsersSidebar({ roleCounts, roles, selectedRole, setSelectedRole }) {
  return (
    <aside className="min-w-0 overflow-hidden rounded-2xl border border-gray-300 bg-white p-3 shadow-sm sm:p-4 xl:sticky xl:top-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Vai trò</h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#2563EB]">{roleCounts['Tất cả người dùng'] || 0}</span>
      </div>

      <nav className="flex min-w-0 gap-2 overflow-x-auto pb-1 xl:grid xl:overflow-visible xl:pb-0">
        {roles.map((role) => {
          const Icon = roleIcons[role] || UserRound
          const isSelected = selectedRole === role

          return (
            <button className={`flex w-[230px] shrink-0 items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition xl:w-full ${isSelected ? 'border-blue-200 bg-blue-50 text-[#2563EB] shadow-sm' : 'border-transparent text-slate-700 hover:border-gray-300 hover:bg-slate-50'}`} key={role} onClick={() => setSelectedRole(role)} type="button">
              <span className="flex min-w-0 items-center gap-3">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${isSelected ? 'bg-white text-[#2563EB]' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{role}</span>
                  <span className="block truncate text-xs font-semibold text-slate-400">{roleCounts[role] || 0} người dùng</span>
                </span>
              </span>
              <span className={`rounded-full px-2 py-1 text-xs font-bold ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'}`}>{roleCounts[role] || 0}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default UsersSidebar
