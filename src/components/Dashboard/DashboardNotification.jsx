function DashboardNotification({ notifications }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
      <h2 className="text-base font-bold text-slate-950 sm:text-lg">Thông báo</h2>

      <div className="mt-4 sm:mt-5">
        {notifications.map((item, index) => (
          <div
            className="relative flex gap-3 pb-6 last:pb-0 sm:gap-4"
            key={`${item.time}-${item.title}`}
          >
            {index !== notifications.length - 1 && (
              <span className="absolute left-[31px] top-8 h-full w-px bg-slate-200 sm:left-[35px]" />
            )}
            <time className="w-12 shrink-0 text-sm font-bold text-[#2563EB] sm:w-14">
              {item.time}
            </time>
            <span className="relative mt-1 h-3 w-3 shrink-0 rounded-full bg-[#2563EB] ring-4 ring-blue-100" />
            <p className="-mt-1 text-sm font-semibold text-slate-700">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DashboardNotification
