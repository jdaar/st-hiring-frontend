// prices come as numeric(19, 4) decimal strings; the design shows them in USD
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const day = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' })
const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })

export const formatPrice = (...amounts: string[]) =>
  currency.format(amounts.reduce((total, amount) => total + Number(amount), 0))

// Sunday, Nov 08, 2026 · 7:00 PM
export const formatEventDate = (date: Date) => `${day.format(date)} · ${time.format(date)}`

// general admission -> General admission
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
