function CalendarFilter({ label, name, options, value, onChange }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <select
        className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        value={value}
      >
        <option value="">Tất cả</option>
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.id
          const optionLabel = typeof option === 'string' ? option : option.label

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          )
        })}
      </select>
    </label>
  )
}

export default CalendarFilter
