function PlaceholderPage({ title = 'Đang phát triển' }) {
  return (
    <div className="mx-auto max-w-3xl rounded-[20px] bg-white p-8 shadow-sm ring-1 ring-slate-200/70">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2563EB]">{title}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-3 text-base font-medium text-slate-500">
        Nội dung sẽ được kết nối vào vùng Outlet bên phải.
      </p>
    </div>
  )
}

export default PlaceholderPage
