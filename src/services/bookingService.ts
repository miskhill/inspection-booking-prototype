import { mockBookings } from '../data/mockBookings'
import type { BookingStatus, InspectionBooking } from '../types/booking'

let bookings = cloneBookings(mockBookings)

function cloneBookings(source: InspectionBooking[]) {
  return source.map((booking) => ({ ...booking }))
}

function pause(durationMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs)
  })
}

export async function listBookings() {
  await pause(80)
  return cloneBookings(bookings)
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await pause(120)

  const nextBooking = bookings.find((booking) => booking.id === id)

  if (!nextBooking) {
    throw new Error(`Booking ${id} was not found.`)
  }

  const updatedBooking = { ...nextBooking, status }

  bookings = bookings.map((booking) =>
    booking.id === id ? updatedBooking : booking,
  )

  return { ...updatedBooking }
}

export function resetBookings() {
  bookings = cloneBookings(mockBookings)
}
