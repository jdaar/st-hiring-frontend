import { ReactNode, forwardRef } from 'react'
import MuiCardHeader, { CardHeaderProps as MuiCardHeaderProps } from '@mui/material/CardHeader'
import { Paragraph, Title, TitleLevel } from '../../atoms'

export type CardHeaderProps = Omit<MuiCardHeaderProps, 'title' | 'subheader' | 'disableTypography'> & {
  title: ReactNode
  subheader?: ReactNode
  titleLevel?: TitleLevel
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subheader, titleLevel = 2, ...props }, ref) => (
    <MuiCardHeader
      ref={ref}
      disableTypography
      title={
        <Title level={titleLevel} variant="h6">
          {title}
        </Title>
      }
      subheader={
        subheader && (
          <Paragraph size="sm" color="text.secondary">
            {subheader}
          </Paragraph>
        )
      }
      {...props}
    />
  ),
)

CardHeader.displayName = 'CardHeader'
