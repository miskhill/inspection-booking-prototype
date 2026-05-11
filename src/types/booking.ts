export const BOOKING_STATUSES = [
  'Requested',
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const BOOKING_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'] as const

export type BookingPriority = (typeof BOOKING_PRIORITIES)[number]

export type InspectionBooking = {
  id: string
  customerName: string
  inspectionType: string
  earliestDate: string
  latestDate: string
  bookedDate: string
  status: BookingStatus
  priority: BookingPriority
  assignedInspector: string
}
