import { usePrefetchQuery } from '@tanstack/react-query'
import { settingsQueryOptions } from '../../../hooks/use-settings'
import { useAppSelector } from '../../../store/hooks'
import { selectMaxTicketsPerOrder } from '../../../store/settings.slice'
import { OrderLimitBanner } from './OrderLimitBanner'

// the limit comes from the redux copy of the settings, hidden until one is set
export const OrderLimitBannerContainer = () => {
  usePrefetchQuery(settingsQueryOptions())
  const maxTickets = useAppSelector(selectMaxTicketsPerOrder)

  return maxTickets === undefined ? null : <OrderLimitBanner maxTickets={maxTickets} />
}
