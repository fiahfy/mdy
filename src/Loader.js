import React from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Loader() {
  return (
    <Box align="center" mt={8}>
      <CircularProgress />
    </Box>
  )
}
