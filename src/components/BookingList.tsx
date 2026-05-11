import type { InspectionBooking } from '../types/booking'
import { formatDate, toToken } from '../utils/bookingFormat'

type BookingListProps = {
  bookings: InspectionBooking[]
  selectedBookingId: string | null
  isLoading: boolean
  onSelect: (bookingId: string) => void
}

export function BookingList({
  bookings,
  selectedBookingId,
  isLoading,
  onSelect,
}: BookingListProps) {
  return (
    <section
      className="panel list-panel"
      aria-labelledby="inspection-bookings-heading"
      role="region"
    >
      <div className="panel-heading">
        <div>
          <h2 id="inspection-bookings-heading">Inspection bookings</h2>
          <p>Choose a booking to review dates, assignment, and workflow status.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-list" aria-label="Loading bookings">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : bookings.length ? (
        <div className="booking-list">
          {bookings.map((booking) => {
            const isSelected = booking.id === selectedBookingId

            return (
              <button
                key={booking.id}
                type="button"
                className={
                  isSelected ? 'booking-row booking-row--selected' : 'booking-row'
                }
                onClick={() => onSelect(booking.id)}
              >
                <div className="booking-row__top">
                  <div>
                    <span className="booking-id">{booking.id}</span>
                    <h3>{booking.customerName}</h3>
                  </div>
                  <div className="badge-row">
                    <span className={`pill pill--${toToken(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className={`pill pill--${toToken(booking.priority)}`}>
                      {booking.priority}
                    </span>
                  </div>
                </div>

                <div className="booking-row__bottom">
                  <div>
                    <span className="meta-label">Inspection type</span>
                    <span className="meta-value">{booking.inspectionType}</span>
                  </div>
                  <div>
                    <span className="meta-label">Booked date</span>
                    <span className="meta-value">{formatDate(booking.bookedDate)}</span>
                  </div>
                  <div>
                    <span className="meta-label">Assigned inspector</span>
                    <span className="meta-value">{booking.assignedInspector}</span>
                  </div>
                  <div>
                    <span className="meta-label">Earliest date</span>
                    <span className="meta-value">{formatDate(booking.earliestDate)}</span>
                  </div>
                  <div>
                    <span className="meta-label">Latest date</span>
                    <span className="meta-value">{formatDate(booking.latestDate)}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__card">
            <h3>No bookings match this filter</h3>
            <p className="subtle">
              Try another status to review the rest of the inspection pipeline.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
