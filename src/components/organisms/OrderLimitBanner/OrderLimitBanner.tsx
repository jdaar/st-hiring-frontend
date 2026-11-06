import { Banner, BannerProps } from '../../atoms'

export type OrderLimitBannerProps = Omit<BannerProps, 'children'> & {
  maxTickets: number
}

export const OrderLimitBanner = ({ maxTickets, ...props }: OrderLimitBannerProps) => (
  <Banner {...props}>
    Only {maxTickets} {maxTickets === 1 ? 'ticket' : 'tickets'} can be purchased in the same order
  </Banner>
)
