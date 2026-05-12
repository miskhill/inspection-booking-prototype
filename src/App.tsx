import { useState } from 'react'
import './App.css'
import { BookingDetails } from './components/BookingDetails'
import { BookingList } from './components/BookingList'
import { StatusFilter } from './components/StatusFilter'
import { useBookings } from './hooks/useBookings'
import {
  BOOKING_STATUSES,
  type BookingStatus,
} from './types/booking'

type BookingFilter = 'All' | BookingStatus

type BannerState =
  | {
      tone: 'success' | 'error'
      text: string
    }
  | undefined

const FILTER_OPTIONS: BookingFilter[] = ['All', ...BOOKING_STATUSES]

function App() {
  const { bookings, isLoading, loadError, isSaving, saveBookingStatus } = useBookings()
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingFilter>('All')
  const [banner, setBanner] = useState<BannerState>()

  const filteredBookings =
    statusFilter === 'All'
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter)

  const selectedBooking =
    filteredBookings.find((booking) => booking.id === selectedBookingId) ??
    filteredBookings[0] ??
    null

  async function handleStatusSave(nextStatus: BookingStatus) {
    if (!selectedBooking) {
      return
    }

    setBanner(undefined)

    try {
      const updatedBooking = await saveBookingStatus(selectedBooking.id, nextStatus)

      const movedOutOfFilter =
        statusFilter !== 'All' && updatedBooking.status !== statusFilter

      setSelectedBookingId(movedOutOfFilter ? null : updatedBooking.id)

      setBanner({
        tone: 'success',
        text: movedOutOfFilter
          ? `${updatedBooking.id} moved out of the ${statusFilter} filter after saving.`
          : `${updatedBooking.id} is now marked as ${updatedBooking.status}.`,
      })
    } catch {
      setBanner({
        tone: 'error',
        text: 'The status update failed. The booking list is unchanged.',
      })
    }
  }

  const urgentCount = bookings.filter((booking) => booking.priority === 'Urgent').length
  const unassignedCount = bookings.filter(
    (booking) => booking.assignedInspector === 'Unassigned',
  ).length

  return (
    <main className="app-shell">
      <header className="app-header panel">
        <div className="eyebrow">Inspection operations prototype</div>
        <div className="header-copy">
          <div>
            <h1>Inspection bookings</h1>
            <p className="lede">
              A small prototype for triaging inspection demand, reviewing booking
              windows, and progressing each job through its workflow.
            </p>
          </div>
          <StatusFilter
            options={FILTER_OPTIONS}
            activeFilter={statusFilter}
            onChange={(nextFilter) => {
              setStatusFilter(nextFilter)
              setSelectedBookingId(null)
              setBanner(undefined)
            }}
          />
        </div>
        <div className="overview-grid" aria-label="Portfolio overview">
          <article className="overview-card">
            <span className="overview-label">Total bookings</span>
            <strong>{bookings.length}</strong>
          </article>
          <article className="overview-card">
            <span className="overview-label">Visible in filter</span>
            <strong>{filteredBookings.length}</strong>
          </article>
          <article className="overview-card">
            <span className="overview-label">Urgent priority</span>
            <strong>{urgentCount}</strong>
          </article>
          <article className="overview-card">
            <span className="overview-label">Unassigned</span>
            <strong>{unassignedCount}</strong>
          </article>
        </div>
      </header>

      {banner ? (
        <p className={`banner banner--${banner.tone}`} role="status">
          {banner.text}
        </p>
      ) : null}

      {loadError ? (
        <section className="panel state-panel">
          <h2>Unable to load bookings</h2>
          <p>{loadError}</p>
        </section>
      ) : (
        <section className="app-layout">
          <BookingList
            bookings={filteredBookings}
            selectedBookingId={selectedBooking?.id ?? null}
            isLoading={isLoading}
            onSelect={setSelectedBookingId}
          />
          <BookingDetails
            booking={selectedBooking}
            isSaving={isSaving}
            onSave={handleStatusSave}
          />
        </section>
      )}
    </main>
  )
}

export default App
