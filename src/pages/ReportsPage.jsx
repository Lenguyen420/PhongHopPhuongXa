import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import ReportsCharts from '@/components/Reports/ReportsCharts'
import ReportsFilter from '@/components/Reports/ReportsFilter'
import ReportsHeader from '@/components/Reports/ReportsHeader'
import ReportsOverview from '@/components/Reports/ReportsOverview'
import { useMeetingReportsQuery } from '@/services/meetingApi'

const initialFilters = {
  period: 'month',
  room: 'Tất cả phòng họp',
  unit: 'Tất cả đơn vị',
  host: 'Tất cả chủ trì',
}

const formatTimestamp = () => new Date().toLocaleString('vi-VN', { hour12: false })

const toExportRows = (items) =>
  items.map((item) => ({
    Ngày: item.date,
    'Tên cuộc họp': item.name,
    'Chủ trì': item.host,
    'Phòng họp': item.room,
    'Đơn vị': item.unit,
    'Số người tham dự': item.attendees,
    'Tỷ lệ tham dự': `${item.attendanceRate}%`,
    'Thời lượng': `${item.duration} phút`,
    'Trạng thái': item.status,
  }))

const stripVietnamese = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')

async function exportRowsToPdf({
  appliedFilters,
  fileName,
  lastUpdatedAt,
  overview = true,
  overviewStats = [],
  rows,
  title,
}) {
  const { jsPDF } = await import('jspdf')

  try {
    const html2canvas = (await import('html2canvas')).default
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '0'
    container.style.top = '0'
    container.style.zIndex = '-1'
    container.style.opacity = '0'
    container.style.pointerEvents = 'none'
    container.style.width = '1120px'
    container.style.padding = '32px'
    container.style.background = '#ffffff'
    container.style.color = '#0f172a'
    container.style.fontFamily = 'Arial, sans-serif'
    container.innerHTML = `<h1 style="font-size:24px;margin:0 0 8px;font-weight:700;">${title}</h1><p style="margin:0 0 16px;color:#475569;">Cập nhật: ${lastUpdatedAt}</p><p style="margin:0 0 20px;color:#475569;">Bộ lọc: ${appliedFilters.room} | ${appliedFilters.unit} | ${appliedFilters.host}</p>${overview ? `<h2 style="font-size:18px;margin:0 0 12px;">Tổng quan</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">${overviewStats.map((item) => `<div style="border:1px solid #d1d5db;border-radius:16px;padding:14px;"><div style="font-size:22px;font-weight:700;">${item.value} ${item.suffix}</div><div style="font-size:13px;color:#475569;">${item.title}</div><div style="font-size:12px;color:${item.trend === 'up' ? '#047857' : '#b45309'};">${item.trend === 'up' ? 'Tăng' : 'Giảm'} ${item.change}%</div></div>`).join('')}</div>` : ''}<h2 style="font-size:18px;margin:0 0 12px;">Chi tiết cuộc họp</h2><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:#f8fafc;">${Object.keys(
      rows[0] || {},
    )
      .map((key) => `<th style="border:1px solid #d1d5db;padding:8px;text-align:left;">${key}</th>`)
      .join('')}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr>${Object.values(row)
            .map((value) => `<td style="border:1px solid #d1d5db;padding:8px;">${value}</td>`)
            .join('')}</tr>`,
      )
      .join('')}</tbody></table>`
    document.body.appendChild(container)
    await document.fonts?.ready
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      scrollX: 0,
      scrollY: 0,
    })
    document.body.removeChild(container)

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imageWidth = pageWidth
    const imageHeight = (canvas.height * imageWidth) / canvas.width
    const imageData = canvas.toDataURL('image/png')
    let remainingHeight = imageHeight
    let position = 0
    pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
    remainingHeight -= pageHeight
    while (remainingHeight > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
      remainingHeight -= pageHeight
    }
    pdf.save(fileName)
  } catch {
    const pdf = new jsPDF()
    pdf.setFontSize(16)
    pdf.text(stripVietnamese(title), 14, 18)
    pdf.setFontSize(10)
    pdf.text(stripVietnamese(`Cap nhat: ${lastUpdatedAt}`), 14, 28)
    pdf.text(
      stripVietnamese(
        `Bo loc: ${appliedFilters.room} | ${appliedFilters.unit} | ${appliedFilters.host}`,
      ),
      14,
      36,
    )
    let y = 48
    rows.forEach((row, index) => {
      if (y > 280) {
        pdf.addPage()
        y = 18
      }
      pdf.text(
        stripVietnamese(
          `${index + 1}. ${row['Tên cuộc họp']} - ${row['Phòng họp']} - ${row['Trạng thái']}`,
        ),
        14,
        y,
      )
      y += 8
    })
    pdf.save(fileName)
  }
}

function ReportsPage() {
  const [filters, setFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const [queryFilters, setQueryFilters] = useState({})
  const [lastUpdatedAt, setLastUpdatedAt] = useState(formatTimestamp())
  const { data, isLoading, isError, refetch } = useMeetingReportsQuery({
    period: appliedFilters.period,
    ...queryFilters,
    page: 0,
    size: 200,
  })

  const reportRooms = ['Tất cả phòng họp', ...(data?.filters?.rooms ?? []).map((item) => item.name)]
  const reportUnits = [
    'Tất cả đơn vị',
    ...(data?.filters?.departments ?? []).map((item) => item.name),
  ]
  const reportHosts = ['Tất cả chủ trì', ...(data?.filters?.hosts ?? []).map((item) => item.name)]
  const comparison = data?.comparison ?? {}
  const overviewStats = [
    {
      id: 'meetings',
      title: 'Tổng số cuộc họp',
      value: data?.overview?.totalMeetings ?? 0,
      suffix: 'cuộc họp',
      change: comparison.totalMeetings?.changePercent ?? 0,
      trend: comparison.totalMeetings?.trend?.toLowerCase() ?? 'up',
    },
    {
      id: 'attendance',
      title: 'Tỷ lệ tham dự',
      value: `${data?.overview?.attendanceRate ?? 0}%`,
      suffix: '',
      change: comparison.attendanceRate?.changePercent ?? 0,
      trend: comparison.attendanceRate?.trend?.toLowerCase() ?? 'up',
    },
    {
      id: 'duration',
      title: 'Thời gian họp trung bình',
      value: data?.overview?.averageDurationMinutes ?? 0,
      suffix: 'phút',
      change: comparison.averageDurationMinutes?.changePercent ?? 0,
      trend: comparison.averageDurationMinutes?.trend?.toLowerCase() ?? 'up',
    },
    {
      id: 'rooms',
      title: 'Số phòng họp đã sử dụng',
      value: data?.overview?.roomsUsed ?? 0,
      suffix: 'phòng',
      change: 0,
      trend: 'up',
    },
    {
      id: 'participants',
      title: 'Tổng số người tham dự',
      value: data?.overview?.participantCount ?? 0,
      suffix: 'lượt',
      change: 0,
      trend: 'up',
    },
    {
      id: 'tasks',
      title: 'Tổng nhiệm vụ được giao',
      value: data?.overview?.taskCount ?? 0,
      suffix: 'nhiệm vụ',
      change: 0,
      trend: 'up',
    },
  ]
  const reportDetails = (data?.details?.data ?? []).map((item) => ({
    ...item,
    unit: item.department ?? '',
    duration: item.durationMinutes,
    status: statusLabel(item.status),
    host: item.host ?? '',
    room: item.room ?? '',
  }))
  const meetingsByTime = data?.meetingsByTime ?? []
  const topRooms = data?.topRooms ?? []
  const topUnits = data?.topDepartments ?? []
  const roomUsageRate = data?.roomUsageRate ?? []
  const meetingStatusRate = (data?.meetingStatusRate ?? []).map((item) => ({
    name: statusLabel(item.status),
    value: item.value,
  }))

  const filteredDetails = useMemo(
    () =>
      reportDetails.filter((item) => {
        const matchesRoom =
          appliedFilters.room === 'Tất cả phòng họp' || item.room === appliedFilters.room
        const matchesUnit =
          appliedFilters.unit === 'Tất cả đơn vị' || item.unit === appliedFilters.unit
        const matchesHost =
          appliedFilters.host === 'Tất cả chủ trì' || item.host === appliedFilters.host
        return matchesRoom && matchesUnit && matchesHost
      }),
    [appliedFilters, reportDetails],
  )

  const exportRows = useMemo(() => toExportRows(filteredDetails), [filteredDetails])

  const handleChange = (name, value) =>
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))

  const handleApply = () => {
    setAppliedFilters(filters)
    setQueryFilters({
      roomId: data?.filters?.rooms?.find((item) => item.name === filters.room)?.id,
      departmentId: data?.filters?.departments?.find((item) => item.name === filters.unit)?.id,
      hostId: data?.filters?.hosts?.find((item) => item.name === filters.host)?.id,
    })
    toast.success('Đã áp dụng bộ lọc báo cáo')
  }

  const handleReset = () => {
    setFilters(initialFilters)
    setAppliedFilters(initialFilters)
    setQueryFilters({})
    setLastUpdatedAt(formatTimestamp())
    toast.success('Đã làm mới dữ liệu báo cáo')
  }

  const handleExportExcel = async () => {
    const XLSX = await import('xlsx')
    const workbook = XLSX.utils.book_new()
    const summarySheet = XLSX.utils.json_to_sheet(
      overviewStats.map((item) => ({
        'Chỉ số': item.title,
        'Giá trị': `${item.value} ${item.suffix}`.trim(),
        'Tăng/giảm': `${item.trend === 'up' ? '+' : '-'}${item.change}%`,
      })),
    )
    const detailSheet = XLSX.utils.json_to_sheet(exportRows)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tong quan')
    XLSX.utils.book_append_sheet(workbook, detailSheet, 'Chi tiet')
    XLSX.writeFile(workbook, 'Bao-cao-thong-ke-cuoc-hop.xlsx')
    toast.success('Đã xuất file Excel')
  }

  const handleExportPdf = async () => {
    await exportRowsToPdf({
      appliedFilters,
      fileName: 'Bao-cao-thong-ke-cuoc-hop.pdf',
      lastUpdatedAt,
      overviewStats,
      rows: exportRows,
      title: 'Báo cáo & Thống kê cuộc họp',
    })
    toast.success('Đã xuất file PDF')
  }

  if (isLoading) return <ReportState text="Đang tổng hợp báo cáo..." />
  if (isError) return <ReportState action={refetch} text="Không thể tải báo cáo" />
  return (
    <div className="mx-auto grid max-w-[1600px] gap-4 sm:gap-6">
      <ReportsHeader
        lastUpdatedAt={lastUpdatedAt}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onRefresh={handleReset}
      />
      <ReportsFilter
        filters={filters}
        hosts={reportHosts}
        onApply={handleApply}
        onChange={handleChange}
        onReset={handleReset}
        rooms={reportRooms}
        units={reportUnits}
      />
      <ReportsOverview stats={overviewStats} />
      <ReportsCharts
        appliedFilters={appliedFilters}
        details={filteredDetails}
        exportRowsToPdf={exportRowsToPdf}
        lastUpdatedAt={lastUpdatedAt}
        lineData={meetingsByTime}
        period={appliedFilters.period}
        roomUsageRate={roomUsageRate}
        statusRate={meetingStatusRate}
        toExportRows={toExportRows}
        topRooms={topRooms}
        topUnits={topUnits}
      />
    </div>
  )
}

function statusLabel(status) {
  return (
    {
      COMPLETED: 'Đã hoàn thành',
      IN_PROGRESS: 'Đang diễn ra',
      CANCELLED: 'Đã hủy',
      SCHEDULED: 'Chờ diễn ra',
      DRAFT: 'Bản nháp',
    }[status] ?? status
  )
}
function ReportState({ action, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center font-semibold text-slate-600 ring-1 ring-slate-200">
      {text}
      {action && (
        <button className="ml-3 text-blue-600" onClick={action} type="button">
          Thử lại
        </button>
      )}
    </div>
  )
}

export default ReportsPage
