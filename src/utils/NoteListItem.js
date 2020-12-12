// TODO:
import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'

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

// eslint-disable-next-line react/display-name
const NoteListItem = React.forwardRef(function (props, ref) {
  const classes = useStyles()

  const { note } = props

  function title() {
    const match = (note.content || '').match(/# (.*)\n?/)
    return match && match[1] ? match[1] : '(Untitled)'
  }

  function body() {
    const replaced = (note.content || '').replace(/# (.*)\n?/, '')
    return replaced
  }

  return (
    <ListItem {...props} alignItems="flex-start" ref={ref}>
      <ListItemText
        primary={title()}
        primaryTypographyProps={{
          variant: 'subtitle1',
        }}
        secondary={body()}
        secondaryTypographyProps={{
          className: classes.listItemSecondaryText,
        }}
      />
    </ListItem>
  )
})

NoteListItem.defaultProps = {
  selected: false,
}

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired,
  selected: PropTypes.bool,
}

export default NoteListItem
