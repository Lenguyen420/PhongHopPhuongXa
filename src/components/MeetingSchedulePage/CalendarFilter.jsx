import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

function CalendarFilter({ label, name, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find((opt) => {
    const val = typeof opt === 'string' ? opt : opt.id
    return String(val) === String(value)
  })
  const displayLabel = selectedOption
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : 'Tất cả'

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center justify-between gap-1.5 rounded-xl border border-slate-200 bg-white pl-3 pr-2 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-50 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50/50 min-w-[125px] max-w-[200px]"
      >
        <span className="truncate">
          <span className="text-slate-400 font-semibold mr-1">{label}:</span>
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1.5 w-max min-w-full max-w-[260px] origin-top-left rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none max-h-60 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => {
              onChange(name, '')
              setIsOpen(false)
            }}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors ${
              !value
                ? 'bg-blue-50 text-[#2563EB]'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {label}: Tất cả
          </button>
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.id
            const optionLabel = typeof option === 'string' ? option : option.label
            const isSelected = String(optionValue) === String(value)

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(name, optionValue)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-[#2563EB]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {optionLabel}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CalendarFilter
