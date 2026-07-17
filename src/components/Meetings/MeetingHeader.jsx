import { ArrowLeft, Save, Send } from 'lucide-react'

function MeetingHeader({ onBack }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2563EB] sm:text-sm">
          Quản lý cuộc họp
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 min-[420px]:text-3xl sm:text-4xl">
          Tạo cuộc họp
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
          Tạo mới và lên lịch cuộc họp trực tuyến hoặc trực tiếp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 lg:flex">
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={17} />
          Quay lại
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
          form="meeting-form"
          name="intent"
          value="DRAFT"
          type="submit"
        >
          <Save size={17} />
          Lưu nháp
        </button>
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          form="meeting-form"
          name="intent"
          value="SCHEDULED"
          type="submit"
        >
          <Send size={17} />
          Tạo cuộc họp
        </button>
      </div>
    </header>
  )
}

export default MeetingHeader
