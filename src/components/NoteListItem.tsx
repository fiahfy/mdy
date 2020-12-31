import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import { Note } from '~/models'

const useStyles = makeStyles(() => ({
  listItemSecondaryText: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: 40,
  },
}))

const NoteListItem: React.ForwardRefRenderFunction<
  any,
  { note: Note; button: boolean }
> = (props, ref) => {
  const { note, button } = props
  console.log(note)

  const classes = useStyles()

  const title = React.useMemo(() => {
    const match = (note.content || '').match(/# (.*)\n?/)
    return match && match[1] ? match[1] : '(Untitled)'
  }, [note.content])

  const body = React.useMemo(() => {
    const replaced = (note.content || '').replace(/# (.*)\n?/, '')
    return replaced
  }, [note.content])

  return (
    <ListItem alignItems="flex-start" button={button as any} ref={ref}>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: 'subtitle1',
        }}
        secondary={body}
        secondaryTypographyProps={{
          className: classes.listItemSecondaryText,
        }}
      />
    </ListItem>
  )
}

export default React.forwardRef(NoteListItem)
