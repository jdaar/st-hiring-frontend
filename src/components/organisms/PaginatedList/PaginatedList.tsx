import { Fragment, Key, ReactNode } from 'react'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Button, Pagination, Paragraph, ProgressBar } from '../../atoms'
import { Card } from '../Card'

export interface PaginatedListProps<T> {
  title: ReactNode
  subheader?: ReactNode
  items: T[]
  getKey: (item: T) => Key
  renderItem: (item: T) => ReactNode
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  // nothing to show yet
  loading?: boolean
  // the items shown belong to the previous page while this one loads
  updating?: boolean
  error?: ReactNode
  onRetry?: () => void
  emptyText?: ReactNode
}

export const PaginatedList = <T,>({
  title,
  subheader,
  items,
  getKey,
  renderItem,
  page,
  totalPages,
  onPageChange,
  loading = false,
  updating = false,
  error,
  onRetry,
  emptyText = 'Nothing here yet.',
}: PaginatedListProps<T>) => {
  if (error) {
    return (
      <Card title={title} subheader={subheader} actions={onRetry && <Button onClick={onRetry}>Retry</Button>}>
        <Paragraph role="alert" color="error">
          {error}
        </Paragraph>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card title={title} subheader={subheader}>
        <ProgressBar aria-label="Loading" />
      </Card>
    )
  }

  return (
    <Card
      title={title}
      subheader={subheader}
      actions={
        totalPages > 1 && (
          <Pagination count={totalPages} page={page} onChange={(_event, next) => onPageChange(next)} />
        )
      }
    >
      {updating && <ProgressBar aria-label="Loading page" />}
      {items.length === 0 ? (
        <Paragraph color="text.secondary">{emptyText}</Paragraph>
      ) : (
        <List disablePadding aria-label={typeof title === 'string' ? title : undefined} aria-busy={updating}>
          {items.map((item, index) => (
            <Fragment key={getKey(item)}>
              {index > 0 && <Divider component="li" />}
              <ListItem disableGutters>{renderItem(item)}</ListItem>
            </Fragment>
          ))}
        </List>
      )}
    </Card>
  )
}
