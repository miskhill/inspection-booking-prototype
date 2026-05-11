import type { BookingStatus } from '../types/booking'

type BookingFilter = 'All' | BookingStatus

type StatusFilterProps = {
  options: BookingFilter[]
  activeFilter: BookingFilter
  onChange: (nextFilter: BookingFilter) => void
}

export function StatusFilter({
  options,
  activeFilter,
  onChange,
}: StatusFilterProps) {
  return (
    <fieldset className="filter-panel">
      <legend>Filter by status</legend>
      <div className="filter-buttons" role="toolbar" aria-label="Status filters">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={
              option === activeFilter
                ? 'filter-button filter-button--active'
                : 'filter-button'
            }
            aria-pressed={option === activeFilter}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
