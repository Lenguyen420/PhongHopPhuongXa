import { Save, Send, X } from 'lucide-react'

function MeetingFooter({ onCancel }) {
  return (
    <footer className="flex flex-col gap-3 rounded-[20px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 sm:flex-row sm:items-center sm:justify-between">
      <button
        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        onClick={onCancel}
        type="button"
      >
        <X size={18} />
        Hủy
      </button>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-[#2563EB] shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
          form="meeting-form"
          name="intent"
          value="DRAFT"
          type="submit"
        >
          <Save size={18} />
          Lưu nháp
        </button>
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          form="meeting-form"
          name="intent"
          value="SCHEDULED"
          type="submit"
        >
          <Send size={18} />
          Tạo cuộc họp
        </button>
      </div>
    </footer>
  )
}

export default MeetingFooter
