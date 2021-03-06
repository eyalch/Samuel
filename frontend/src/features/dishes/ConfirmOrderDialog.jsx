import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core"
import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPrettyWeekday } from "./dishesHelpers"
import { orderPendingDish, resetConfirmPendingDish } from "./dishesSlice"

const ConfirmOrderDialog = () => {
  const { confirmOrderDialog, pendingDish } = useSelector(
    (state) => state.dishes
  )
  const dispatch = useDispatch()

  const hideConfirmOrderDialog = useCallback(
    () => dispatch(resetConfirmPendingDish()),
    [dispatch]
  )

  const prettyWeekday = pendingDish
    ? getPrettyWeekday(new Date(pendingDish.date))
    : ""

  return (
    <Dialog
      open={confirmOrderDialog}
      onClose={hideConfirmOrderDialog}
      aria-labelledby="confirm-second-order-dialog-title"
      aria-describedby="confirm-second-order-dialog-description"
    >
      <DialogTitle id="confirm-second-order-dialog-title">
        להזמין מנה נוספת?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-second-order-dialog-description">
          כבר קיימת הזמנה ל{prettyWeekday}. להזמין מנה נוספת?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={hideConfirmOrderDialog}>לא</Button>
        <Button
          onClick={() => dispatch(orderPendingDish())}
          variant="contained"
        >
          כן
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmOrderDialog
