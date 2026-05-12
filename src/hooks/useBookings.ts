import { useEffect, useState } from 'react'
import { listBookings, updateBookingStatus } from '../services/bookingService'
import type { BookingStatus, InspectionBooking } from '../types/booking'

export function useBookings() {
  const [bookings, setBookings] = useState<InspectionBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)

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

  async function saveBookingStatus(id: string, status: BookingStatus) {
    setIsSaving(true)

    try {
      const updatedBooking = await updateBookingStatus(id, status)

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking,
        ),
      )

      return updatedBooking
    } finally {
      setIsSaving(false)
    }
  }

  return {
    bookings,
    isLoading,
    loadError,
    isSaving,
    saveBookingStatus,
  }
}
