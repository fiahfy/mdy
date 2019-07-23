import React from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Loader() {
  return (
    <Box mt={8} display="flex" flexDirection="column" alignItems="center">
      <CircularProgress />
    </Box>
  )
}
