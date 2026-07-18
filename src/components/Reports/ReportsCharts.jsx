import { ChevronLeft, ChevronRight, Download, FileText, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const chartColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
const pageSize = 8

const statusClasses = {
  'Đã hoàn thành': 'bg-emerald-50 text-emerald-700',
  'Đang diễn ra': 'bg-blue-50 text-[#2563EB]',
  'Đã hủy': 'bg-red-50 text-red-600',
  'Chờ diễn ra': 'bg-amber-50 text-amber-700',
}

const periodLabelMap = { day: 'ngày', week: 'tuần', month: 'tháng', year: 'năm' }

function ReportsCharts({ appliedFilters, details, exportRowsToPdf, lastUpdatedAt, lineData, period, roomUsageRate, statusRate, toExportRows, topRooms, topUnits }) {
  const [searchValue, setSearchValue] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)

  const filteredDetails = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const result = details.filter((item) => normalizedSearch.length === 0 || item.name.toLowerCase().includes(normalizedSearch) || item.host.toLowerCase().includes(normalizedSearch) || item.room.toLowerCase().includes(normalizedSearch) || item.unit.toLowerCase().includes(normalizedSearch))
    return [...result].sort((a, b) => {
      const firstValue = a[sortConfig.key]
      const secondValue = b[sortConfig.key]
      const direction = sortConfig.direction === 'asc' ? 1 : -1
      if (typeof firstValue === 'number' && typeof secondValue === 'number') return (firstValue - secondValue) * direction
      return String(firstValue).localeCompare(String(secondValue), 'vi') * direction
    })
  }, [details, searchValue, sortConfig])

  const totalPages = Math.max(1, Math.ceil(filteredDetails.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const pagedDetails = filteredDetails.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleSort = (key) => {
    setSortConfig((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
  }

  const handleExportDetailExcel = async () => {
    const XLSX = await import('xlsx')
    const workbook = XLSX.utils.book_new()
    const detailSheet = XLSX.utils.json_to_sheet(toExportRows(filteredDetails))
    XLSX.utils.book_append_sheet(workbook, detailSheet, 'Bang chi tiet')
    XLSX.writeFile(workbook, 'Bang-thong-ke-chi-tiet-cuoc-hop.xlsx')
  }

  const handleExportDetailPdf = async () => {
    await exportRowsToPdf({ appliedFilters, fileName: 'Bang-thong-ke-chi-tiet-cuoc-hop.pdf', lastUpdatedAt, overview: false, rows: toExportRows(filteredDetails), title: 'Bảng thống kê chi tiết cuộc họp' })
  }

  return (
    <section className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-lg font-bold text-slate-950">Bảng thống kê chi tiết</h2>
            <p className="text-sm font-medium text-slate-500">Tìm kiếm, sắp xếp, xuất file và xem chi tiết từng cuộc họp</p>
          </div>
          <div className="grid min-w-0 gap-2 min-[520px]:grid-cols-[minmax(220px,1fr)_auto_auto] xl:w-[620px]">
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 transition focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100">
              <Search className="shrink-0 text-slate-400" size={18} />
              <input className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400" onChange={(event) => { setSearchValue(event.target.value); setCurrentPage(1) }} placeholder="Tìm kiếm cuộc họp..." value={searchValue} />
            </label>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-blue-50" onClick={handleExportDetailExcel} type="button">
              <Download size={17} />
              Excel
            </button>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50" onClick={handleExportDetailPdf} type="button">
              <FileText size={17} />
              PDF
            </button>
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto rounded-2xl border border-gray-300">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <SortableHeader label="Ngày" name="date" onSort={handleSort} />
                <SortableHeader label="Tên cuộc họp" name="name" onSort={handleSort} />
                <SortableHeader label="Chủ trì" name="host" onSort={handleSort} />
                <SortableHeader label="Phòng họp" name="room" onSort={handleSort} />
                <SortableHeader label="Đơn vị" name="unit" onSort={handleSort} />
                <SortableHeader label="Số người tham dự" name="attendees" onSort={handleSort} />
                <SortableHeader label="Tỷ lệ tham dự" name="attendanceRate" onSort={handleSort} />
                <SortableHeader label="Thời lượng" name="duration" onSort={handleSort} />
                <SortableHeader label="Trạng thái" name="status" onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {pagedDetails.map((item) => (
                <tr className="transition hover:bg-slate-50" key={item.id}>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-600">{item.date}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-bold text-slate-950">{item.name}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{item.host}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{item.room}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{item.unit}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-bold text-slate-700">{item.attendees}</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-bold text-[#2563EB]">{item.attendanceRate}%</td>
                  <td className="border-b border-gray-300 px-4 py-3 font-semibold text-slate-700">{item.duration} phút</td>
                  <td className="border-b border-gray-300 px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[item.status] || 'bg-slate-100 text-slate-600'}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-500">Hiển thị {pagedDetails.length} / {filteredDetails.length} dòng</p>
          <div className="flex items-center gap-2">
            <button aria-label="Trang trước" className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)} type="button"><ChevronLeft size={18} /></button>
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{safePage}/{totalPages}</span>
            <button aria-label="Trang sau" className="grid h-10 w-10 place-items-center rounded-2xl border border-gray-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)} type="button"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        <ChartCard title="Số cuộc họp theo thời gian" subtitle={`Xu hướng theo ${periodLabelMap[period] || 'tháng'}`}>
          <ResponsiveContainer height={280} width="100%">
            <LineChart data={lineData}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip />
              <Line dataKey="meetings" name="Cuộc họp" stroke="#2563EB" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top phòng họp được sử dụng nhiều nhất" subtitle="Số lần sử dụng">
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={topRooms}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" name="Lần sử dụng" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]">
        <ChartCard title="Top đơn vị tổ chức họp nhiều nhất" subtitle="Số lượng cuộc họp">
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={topUnits} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis tick={{ fill: '#64748B', fontSize: 12 }} type="number" />
              <YAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} type="category" width={112} />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" name="Cuộc họp" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tỷ lệ sử dụng phòng họp" subtitle="Theo phần trăm sử dụng">
          <PieBlock data={roomUsageRate} />
        </ChartCard>

        <ChartCard title="Trạng thái cuộc họp" subtitle="Cơ cấu trạng thái">
          <PieBlock data={statusRate} />
        </ChartCard>
      </div>

    </section>
  )
}

function ChartCard({ children, subtitle, title }) {
  return (
    <section className="min-w-0 rounded-2xl border border-gray-300 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 min-w-0">
        <h2 className="break-words text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

function PieBlock({ data }) {
  return (
    <div className="grid gap-3">
      <ResponsiveContainer height={220} width="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={54} outerRadius={88} paddingAngle={3}>
            {data.map((entry, index) => <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid gap-2">
        {data.map((item, index) => (
          <div className="flex items-center justify-between gap-3 text-sm font-semibold" key={item.name}>
            <span className="flex min-w-0 items-center gap-2 text-slate-600"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} /><span className="truncate">{item.name}</span></span>
            <span className="font-bold text-slate-950">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SortableHeader({ label, name, onSort }) {
  return (
    <th className="border-b border-gray-300 px-4 py-3">
      <button className="text-left font-bold uppercase tracking-wide transition hover:text-[#2563EB]" onClick={() => onSort(name)} type="button">{label}</button>
    </th>
  )
}

export default ReportsCharts
