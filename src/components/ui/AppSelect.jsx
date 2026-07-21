import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

/* oxlint-disable jsx-a11y/prefer-tag-over-role -- This component intentionally implements an accessible custom listbox. */

const normalizeOptions = (options) =>
  options.map((option) =>
    typeof option === 'object'
      ? {
          disabled: Boolean(option.disabled),
          label: option.label ?? option.name ?? String(option.value ?? option.id ?? ''),
          value: option.value ?? option.id ?? '',
        }
      : { disabled: false, label: String(option), value: option },
  )

function AppSelect({
  'aria-label': ariaLabel,
  buttonClassName = '',
  className = '',
  defaultValue = '',
  disabled = false,
  name,
  onChange,
  options = [],
  placeholder = 'Chọn một giá trị',
  value: controlledValue,
}) {
  const id = useId()
  const rootRef = useRef(null)
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [menuPosition, setMenuPosition] = useState(null)
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options])
  const value = controlledValue === undefined ? internalValue : controlledValue
  const selectedIndex = normalizedOptions.findIndex(
    (option) => String(option.value) === String(value),
  )
  const selectedOption = normalizedOptions[selectedIndex]

  useEffect(() => {
    if (controlledValue === undefined) setInternalValue(defaultValue)
  }, [controlledValue, defaultValue])

  useEffect(() => {
    if (!isOpen) return undefined

    const updatePosition = () => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      const estimatedHeight = Math.min(288, normalizedOptions.length * 44 + 12)
      const opensUpward = window.innerHeight - rect.bottom < Math.min(220, estimatedHeight)
      setMenuPosition({
        left: rect.left,
        top: opensUpward ? Math.max(8, rect.top - estimatedHeight - 8) : rect.bottom + 8,
        width: rect.width,
      })
    }
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target))
        setIsOpen(false)
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('pointerdown', closeOnOutsideClick)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [isOpen, normalizedOptions.length])

  useEffect(() => {
    if (!isOpen) return
    setHighlightedIndex(Math.max(0, selectedIndex))
  }, [isOpen, selectedIndex])

  const selectOption = (option) => {
    if (option.disabled) return
    if (controlledValue === undefined) setInternalValue(option.value)
    onChange?.({ target: { name, value: option.value } })
    setIsOpen(false)
  }

  const moveHighlight = (direction) => {
    if (!normalizedOptions.length) return
    let next = highlightedIndex
    do {
      next = (next + direction + normalizedOptions.length) % normalizedOptions.length
    } while (normalizedOptions[next]?.disabled && next !== highlightedIndex)
    setHighlightedIndex(next)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') return setIsOpen(false)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) setIsOpen(true)
      else moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
      return
    }
    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault()
      const option = normalizedOptions[highlightedIndex]
      if (option) selectOption(option)
    }
  }

  return (
    <div className={`relative min-w-0 ${className}`} ref={rootRef}>
      {name && <input name={name} type="hidden" value={value ?? ''} />}
      <button
        aria-controls={`${id}-listbox`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? placeholder}
        className={`flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-2xl border bg-white px-3.5 text-left text-sm font-semibold outline-none transition-all duration-200 ${
          isOpen
            ? 'border-blue-500 text-slate-900 ring-4 ring-blue-100'
            : 'border-slate-300 text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/30'
        } disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none ${buttonClassName}`}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span className={`truncate ${selectedOption ? '' : 'text-slate-400'}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
          }`}
          size={17}
        />
      </button>

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            className="fixed z-[200] max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/15"
            id={`${id}-listbox`}
            ref={menuRef}
            role="listbox"
            style={menuPosition}
          >
            {normalizedOptions.length ? (
              normalizedOptions.map((option, index) => {
                const isSelected = index === selectedIndex
                const isHighlighted = index === highlightedIndex
                return (
                  <button
                    aria-selected={isSelected}
                    className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isHighlighted
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                    disabled={option.disabled}
                    key={`${String(option.value)}-${index}`}
                    onClick={() => selectOption(option)}
                    onPointerEnter={() => setHighlightedIndex(index)}
                    role="option"
                    type="button"
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="shrink-0" size={17} strokeWidth={2.5} />}
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-4 text-center text-sm font-medium text-slate-400">
                Không có dữ liệu
              </p>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}

export default AppSelect
