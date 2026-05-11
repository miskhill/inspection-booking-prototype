import { useEffect, useState } from 'react'
import {
  BOOKING_STATUSES,
  type BookingStatus,
  type InspectionBooking,
} from '../types/booking'
import { formatDate, toToken } from '../utils/bookingFormat'

type BookingDetailsProps = {
  booking: InspectionBooking | null
  isSaving: boolean
  onSave: (nextStatus: BookingStatus) => Promise<void>
}

const STATUS_NOTES: Record<BookingStatus, string> = {
  Requested: 'New demand waiting for scheduling and inspector assignment.',
  Scheduled: 'Booked and assigned. The next operational step is the site visit.',
  'In Progress': 'Inspection has started and evidence collection is underway.',
  Completed: 'The inspection is complete and ready for downstream reporting.',
  Cancelled: 'This booking is no longer active and should not be scheduled.',
}

const DEFAULT_DRAFT_STATUS: BookingStatus = 'Requested'

export function BookingDetails({
  booking,
  isSaving,
  onSave,
}: BookingDetailsProps) {
  const [draftStatus, setDraftStatus] = useState<BookingStatus>(
    booking?.status ?? DEFAULT_DRAFT_STATUS,
  )

  useEffect(() => {
    // This local draft is intentionally reset when a different booking/status is shown.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftStatus(booking?.status ?? DEFAULT_DRAFT_STATUS)
  }, [booking?.status])

  if (!booking) {
    return (
      <section
        className="panel details-panel empty-state"
        aria-labelledby="booking-details-title"
        role="region"
      >
        <div className="empty-state__card">
          <h2 id="booking-details-title">Booking details</h2>
          <p className="subtle">
            Select a booking from the list to inspect dates, ownership, and status.
          </p>
        </div>
      </section>
    )
  }

  const hasStatusChanged = draftStatus !== booking.status

  return (
    <section
      className="panel details-panel"
      aria-labelledby="booking-details-title"
      role="region"
    >
      <div className="details-intro">
        <div>
          <h2 id="booking-details-title">Booking details</h2>
          <span className="booking-id">{booking.id}</span>
          <h3>{booking.customerName}</h3>
          <p>{booking.inspectionType} inspection booking</p>
        </div>
        <div className="badge-row">
          <span className={`pill pill--${toToken(booking.status)}`}>{booking.status}</span>
          <span className={`pill pill--${toToken(booking.priority)}`}>
            {booking.priority}
          </span>
        </div>
      </div>

      <article className="detail-card">
        <h3>Booking snapshot</h3>
        <dl className="detail-grid">
          <div className="detail-item">
            <dt>Assigned inspector</dt>
            <dd>{booking.assignedInspector}</dd>
          </div>
          <div className="detail-item">
            <dt>Booked date</dt>
            <dd>{formatDate(booking.bookedDate)}</dd>
          </div>
          <div className="detail-item">
            <dt>Inspection type</dt>
            <dd>{booking.inspectionType}</dd>
          </div>
          <div className="detail-item">
            <dt>Priority</dt>
            <dd>{booking.priority}</dd>
          </div>
        </dl>
      </article>

      <article className="detail-card">
        <h3>Requested visit window</h3>
        <dl className="detail-window">
          <div className="detail-item">
            <dt>Earliest date</dt>
            <dd>{formatDate(booking.earliestDate)}</dd>
          </div>
          <div className="detail-item">
            <dt>Latest date</dt>
            <dd>{formatDate(booking.latestDate)}</dd>
          </div>
          <div className="detail-item">
            <dt>Current workflow note</dt>
            <dd className="workflow-note">{STATUS_NOTES[booking.status]}</dd>
          </div>
        </dl>
      </article>

      <article className="detail-card">
        <h3>Change status</h3>
        <form
          className="detail-status-form"
          onSubmit={(event) => {
            event.preventDefault()
            void onSave(draftStatus)
          }}
        >
          <label>
            <span className="field-label">Status</span>
            <select
              className="status-select"
              value={draftStatus}
              onChange={(event) =>
                setDraftStatus(event.target.value as BookingStatus)
              }
              aria-label="Status"
            >
              {BOOKING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="primary-button"
            disabled={!hasStatusChanged || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save status'}
          </button>
        </form>
      </article>
    </section>
  )
}
