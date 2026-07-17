import { useState } from 'react'
import { File, MessageSquareText, Send, Users } from 'lucide-react'
import { downloadAttachment } from '@/services/files'

function MeetingRoomSidebar({ meeting, onSendMessage }) {
  const [message, setMessage] = useState('')
  return (
    <aside className="grid min-h-0 gap-4 rounded-[28px] bg-white/95 p-4 text-slate-900 shadow-2xl ring-1 ring-white/20 lg:w-96">
      <section className="min-h-0">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          <Users size={16} />
          Đại biểu tham dự
        </h2>
        <div className="mt-3 grid max-h-52 gap-2 overflow-y-auto pr-1">
          {meeting.participants.map((participant) => (
            <div
              className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
              key={participant.id}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#2563EB] text-sm font-bold text-white">
                {participant.name.charAt(0)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-slate-900">
                  {participant.name}
                </span>
                <span className="text-xs font-semibold text-slate-500">{participant.role}</span>
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${participant.active ? 'bg-[#10B981]' : 'bg-slate-300'}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          <File size={16} />
          Tài liệu
        </h2>
        <div className="mt-3 grid gap-2">
          {meeting.documents.map((document) => (
            <button
              className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700"
              key={document.id}
              onClick={() => downloadAttachment(document)}
              type="button"
            >
              {document.fileName}
            </button>
          ))}
        </div>
      </section>

      <section className="min-h-0">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          <MessageSquareText size={16} />
          Trao đổi
        </h2>
        <div className="mt-3 grid max-h-40 gap-2 overflow-y-auto pr-1">
          {meeting.messages.length > 0 ? (
            meeting.messages.map((message) => (
              <div className="rounded-2xl bg-blue-50 p-3 text-sm" key={message.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">{message.sender}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {new Date(message.time).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="mt-1 font-medium text-slate-600">{message.content}</p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-500">
              Chưa có trao đổi trong cuộc họp.
            </p>
          )}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            const content = message.trim()
            if (!content) return
            onSendMessage(content)
            setMessage('')
          }}
        >
          <input
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-3 text-sm outline-none"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Nhập trao đổi..."
            value={message}
          />
          <button
            className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white"
            type="submit"
          >
            <Send size={16} />
          </button>
        </form>
      </section>
    </aside>
  )
}

export default MeetingRoomSidebar
