import { ReactNode, useCallback, useId, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import { Button } from '../../atoms'

export interface ExpandableProps {
  children: ReactNode
  // height in px shown while collapsed
  collapsedHeight?: number
}

// collapsed from the first render: the collapsed size follows the content up to collapsedHeight, so content that
// grows later (images loading) stops at the cap instead of opening and animating shut; the toggle's row is always
// reserved and the toggle only becomes visible once the content overflows
export const Expandable = ({ children, collapsedHeight = 160 }: ExpandableProps) => {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const observer = useRef<ResizeObserver>()

  const measure = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect()
    if (!node) return
    const check = () => setContentHeight(node.scrollHeight)
    check()
    observer.current = new ResizeObserver(check)
    observer.current.observe(node)
  }, [])

  const overflows = contentHeight > collapsedHeight
  // 0 means no layout to measure (jsdom), keep the cap rather than hiding the content
  const collapsedSize = Math.min(contentHeight, collapsedHeight) || collapsedHeight

  return (
    <Box>
      <Collapse
        id={id}
        in={expanded}
        collapsedSize={collapsedSize}
        sx={overflows && !expanded ? { maskImage: 'linear-gradient(to bottom, black 60%, transparent)' } : undefined}
      >
        <Box ref={measure}>{children}</Box>
      </Collapse>
      <Button
        size="small"
        aria-expanded={expanded}
        aria-controls={id}
        aria-hidden={!overflows}
        tabIndex={overflows ? undefined : -1}
        onClick={() => setExpanded(!expanded)}
        sx={{ visibility: overflows ? 'visible' : 'hidden' }}
      >
        {expanded ? 'Less' : 'More...'}
      </Button>
    </Box>
  )
}
