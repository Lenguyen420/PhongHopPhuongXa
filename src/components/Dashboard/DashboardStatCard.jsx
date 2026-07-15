import { Building2, Calendar, CheckCircle, Clock3, PlayCircle, Users } from 'lucide-react'

const icons = {
  Building2,
  Calendar,
  CheckCircle,
  Clock3,
  PlayCircle,
  Users,
}

const colorClasses = {
  blue: 'bg-[#EFF6FF] text-[#2563EB] ring-[#BFDBFE]',
  green: 'bg-[#ECFDF5] text-[#10B981] ring-[#A7F3D0]',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
  orange: 'bg-[#FFFBEB] text-[#F59E0B] ring-[#FDE68A]',
}

function DashboardStatCard({ icon, title, value, color }) {
  const Icon = icons[icon] ?? Calendar

  return (
    <article className="group rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5">
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ring-1 sm:mb-5 sm:h-11 sm:w-11 ${colorClasses[color]}`}
      >
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <p className="min-h-9 text-[13px] font-semibold leading-5 text-slate-500 sm:text-sm">
        {title}
      </p>
      <strong className="mt-2 block text-2xl font-bold tracking-tight text-slate-950 sm:mt-3 sm:text-3xl">
        {value}
      </strong>
    </article>
  )
}

export default DashboardStatCard
