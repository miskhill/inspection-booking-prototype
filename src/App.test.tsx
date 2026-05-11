import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from './App'
import { resetBookings } from './services/bookingService'
import { formatDate } from './utils/bookingFormat'

describe('Inspection booking prototype', () => {
  beforeEach(() => {
    resetBookings()
  })

  it('filters bookings by status', async () => {
    render(<App />)

    const listRegion = await screen.findByRole('region', {
      name: /inspection bookings/i,
    })

    await within(listRegion).findByRole('button', {
      name: /Acme Electrical Ltd/i,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Scheduled' }))

    await waitFor(() => {
      expect(
        within(listRegion).queryByRole('button', { name: /Acme Electrical Ltd/i }),
      ).not.toBeInTheDocument()
    })

    expect(
      within(listRegion).getByRole('button', { name: /Beacon Housing Association/i }),
    ).toBeInTheDocument()
    expect(
      within(listRegion).getByRole('button', { name: /Marlow Health Campus/i }),
    ).toBeInTheDocument()
  })

  it('updates a booking status and reselects when it leaves the active filter', async () => {
    render(<App />)

    const listRegion = await screen.findByRole('region', {
      name: /inspection bookings/i,
    })

    await within(listRegion).findByRole('button', {
      name: /Acme Electrical Ltd/i,
    })
    fireEvent.click(screen.getByRole('button', { name: 'Requested' }))

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Scheduled' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save status/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/moved out of the Requested filter after saving/i),
      ).toBeInTheDocument()
    })

    const detailsRegion = screen.getByRole('region', { name: /booking details/i })

    expect(within(detailsRegion).getByText('Delta Facilities Group')).toBeInTheDocument()
    expect(
      within(listRegion).queryByRole('button', { name: /Acme Electrical Ltd/i }),
    ).not.toBeInTheDocument()
  })

  it('formats stored booking dates as date-only values', () => {
    expect(formatDate('2026-05-01')).toBe('1 May 2026')
  })
})
