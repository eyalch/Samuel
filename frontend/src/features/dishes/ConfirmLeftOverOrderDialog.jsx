import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

import {
  resetConfirmLeftOverOrderDialog,
  orderPendingDish,
} from './dishesSlice'

const ConfirmLeftOverOrderDialog = () => {
  const { confirmLeftOverOrderDialog } = useSelector(state => state.dishes)
  const dispatch = useDispatch()

  const hideConfirmLeftOverOrderDialog = useCallback(
    () => dispatch(resetConfirmLeftOverOrderDialog()),
    [dispatch]
  )

  return (
    <Dialog
      open={confirmLeftOverOrderDialog}
      onClose={hideConfirmLeftOverOrderDialog}
      aria-labelledby="confirm-left-over-order-dialog-title"
      aria-describedby="confirm-left-over-order-dialog-description">
      <DialogTitle id="confirm-left-over-order-dialog-title">
        שימו לב!
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-left-over-order-dialog-description">
          לא יהיה ניתן לבטל הזמנה של מנה זו. האם ברצונכם להמשיך?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideConfirmLeftOverOrderDialog} color="primary">
          לא
        </Button>
        <Button onClick={() => dispatch(orderPendingDish())} color="primary">
          כן
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmLeftOverOrderDialog