import { Captions, Mic, MonitorUp, PhoneOff, Settings, Video } from 'lucide-react'

function MeetingRoomToolbar() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/85 px-4 py-3 text-white backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 sm:gap-3">
        <ControlButton icon={Mic} label="Mic" />
        <ControlButton icon={Video} label="Camera" />
        <ControlButton icon={Captions} label="Phụ đề" />
        <ControlButton icon={MonitorUp} label="Trình chiếu" />
        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#EF4444] px-5 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-600"
          onClick={() => window.close()}
          type="button"
        >
          <PhoneOff size={20} />
          <span className="hidden sm:inline">Rời cuộc họp</span>
        </button>
        <ControlButton icon={Settings} label="Cài đặt" />
      </div>
    </footer>
  )
}

function ControlButton({ icon: Icon, label }) {
  return (
    <button
      className="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      title={label}
      type="button"
    >
      <Icon size={20} />
    </button>
  )
}

export default MeetingRoomToolbar
