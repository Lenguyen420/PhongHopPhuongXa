export const roomColorStyles = {
  blue: {
    border: 'border-l-4 border-l-blue-500',
    bg: 'hover:bg-blue-50/10',
    accentBg: 'bg-blue-50/60 ring-blue-100/50 text-blue-900',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 text-blue-600 ring-blue-100',
    btnBg: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    gradient: 'from-blue-500 to-indigo-600',
  },
  teal: {
    border: 'border-l-4 border-l-teal-500',
    bg: 'hover:bg-teal-50/10',
    accentBg: 'bg-teal-50/60 ring-teal-100/50 text-teal-900',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50 text-teal-600 ring-teal-100',
    btnBg: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    gradient: 'from-teal-500 to-emerald-600',
  },
  purple: {
    border: 'border-l-4 border-l-purple-500',
    bg: 'hover:bg-purple-50/10',
    accentBg: 'bg-purple-50/60 ring-purple-100/50 text-purple-900',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 text-purple-600 ring-purple-100',
    btnBg: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    gradient: 'from-purple-500 to-indigo-600',
  },
  amber: {
    border: 'border-l-4 border-l-amber-500',
    bg: 'hover:bg-amber-50/10',
    accentBg: 'bg-amber-50/60 ring-amber-100/50 text-amber-950',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 text-amber-600 ring-amber-100',
    btnBg: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    gradient: 'from-amber-500 to-orange-600',
  },
  rose: {
    border: 'border-l-4 border-l-rose-500',
    bg: 'hover:bg-rose-50/10',
    accentBg: 'bg-rose-50/60 ring-rose-100/50 text-rose-900',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 text-rose-600 ring-rose-100',
    btnBg: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    gradient: 'from-rose-500 to-pink-600',
  },
  indigo: {
    border: 'border-l-4 border-l-indigo-500',
    bg: 'hover:bg-indigo-50/10',
    accentBg: 'bg-indigo-50/60 ring-indigo-100/50 text-indigo-900',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    btnBg: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    gradient: 'from-indigo-500 to-violet-600',
  },
}

export const getRoomColor = (roomNameOrId) => {
  if (!roomNameOrId) return 'blue'
  const name = roomNameOrId.toLowerCase()
  if (name.includes('01') || name.includes('room-01')) return 'blue'
  if (name.includes('02') || name.includes('room-02')) return 'teal'
  if (name.includes('lớn') || name.includes('room-03')) return 'purple'
  if (name.includes('phòng họp a') || name.includes('room-04') || name.endsWith(' a'))
    return 'amber'
  if (name.includes('phòng họp b') || name.includes('room-05') || name.endsWith(' b')) return 'rose'
  if (name.includes('trực tuyến') || name.includes('room-06')) return 'indigo'

  const hash = Array.from(roomNameOrId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = ['blue', 'teal', 'purple', 'amber', 'rose', 'indigo']
  return colors[hash % colors.length]
}
