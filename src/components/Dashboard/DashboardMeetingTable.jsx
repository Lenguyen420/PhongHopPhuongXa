const statusClasses = {
  'Đang diễn ra': 'bg-[#ECFDF5] text-[#10B981] ring-[#A7F3D0]',
  'Sắp diễn ra': 'bg-[#FFFBEB] text-[#F59E0B] ring-[#FDE68A]',
  'Chưa bắt đầu': 'bg-slate-100 text-slate-600 ring-slate-200',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
        statusClasses[status] ?? statusClasses['Chưa bắt đầu']
      }`}
    >
      {status}
    </span>
  )
}

function DashboardMeetingTable({ meetings }) {
  return (
    <section className="overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-200/70">
      <div className="border-b border-slate-200/80 px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-base font-bold text-slate-950 sm:text-lg">Lịch họp hôm nay</h2>
      </div>

      <div className="grid gap-3 p-4 md:hidden">
        {meetings.map((meeting) => (
          <article
            className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
            key={`${meeting.time}-${meeting.name}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <time className="text-sm font-bold text-[#2563EB]">{meeting.time}</time>
                <h3 className="mt-1 text-sm font-bold text-slate-950">{meeting.name}</h3>
              </div>
              <StatusBadge status={meeting.status} />
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-slate-500">Phòng</dt>
                <dd className="text-right font-semibold text-slate-700">{meeting.room}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-medium text-slate-500">Chủ trì</dt>
                <dd className="text-right font-semibold text-slate-700">{meeting.host}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Tên cuộc họp</th>
              <th className="px-6 py-4">Phòng</th>
              <th className="px-6 py-4">Chủ trì</th>
              <th className="px-6 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {meetings.map((meeting) => (
              <tr
                className="transition hover:bg-slate-50/80"
                key={`${meeting.time}-${meeting.name}`}
              >
                <td className="px-6 py-5 text-sm font-bold text-slate-900">{meeting.time}</td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-800">{meeting.name}</td>
                <td className="px-6 py-5 text-sm text-slate-600">{meeting.room}</td>
                <td className="px-6 py-5 text-sm text-slate-600">{meeting.host}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={meeting.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default DashboardMeetingTable
