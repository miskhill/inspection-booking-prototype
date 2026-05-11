import { useEffect, useState } from 'react'
import './App.css'
import { BookingDetails } from './components/BookingDetails'
import { BookingList } from './components/BookingList'
import { StatusFilter } from './components/StatusFilter'
import { listBookings, updateBookingStatus } from './services/bookingService'
import {
  BOOKING_STATUSES,
  type BookingStatus,
  type InspectionBooking,
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
  const [bookings, setBookings] = useState<InspectionBooking[]>([])
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<BookingFilter>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)
  const [banner, setBanner] = useState<BannerState>()

  useEffect(() => {
    let isActive = true

    async function loadBookings() {
      setIsLoading(true)
      setLoadError(undefined)

      try {
        const initialBookings = await listBookings()

        if (!isActive) {
          return
        }

        setBookings(initialBookings)
        setSelectedBookingId(initialBookings[0]?.id ?? null)
      } catch {
        if (isActive) {
          setLoadError('The prototype could not load bookings. Refresh and try again.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadBookings()

    return () => {
      isActive = false
    }
  }, [])

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

    setIsSaving(true)
    setBanner(undefined)

    try {
      const updatedBooking = await updateBookingStatus(selectedBooking.id, nextStatus)

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking,
        ),
      )

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
    } finally {
      setIsSaving(false)
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
