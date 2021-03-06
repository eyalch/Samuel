import { CircularProgress } from "@material-ui/core"
import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import ConfirmLeftOverOrderDialog from "./ConfirmLeftOverOrderDialog"
import ConfirmOrderDialog from "./ConfirmOrderDialog"
import { fetchDishes as _fetchDishes, orderPendingDish } from "./dishesSlice"
import DishesSnackbars from "./DishesSnackbars"
import FutureDishes from "./FutureDishes"
import { allowOrdersUntilSelector } from "./OrderTimer"
import TodayDishes from "./TodayDishes"

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

const DishesPage = () => {
  const { loading } = useSelector((state) => state.dishes)
  const { authenticated, initialAuthentication } = useSelector(
    (state) => state.auth
  )
  const allowOrdersUntil = useSelector(allowOrdersUntilSelector)
  const dispatch = useDispatch()

  const fetchDishes = useCallback(async () => {
    if (initialAuthentication) return

    return dispatch(_fetchDishes())
  }, [dispatch, initialAuthentication])

  // Fetch dishes for the first time and when the user authenticates,
  // also try to order any pending dish
  useEffect(() => {
    fetchDishes().then(() => dispatch(orderPendingDish()))
  }, [authenticated, dispatch, fetchDishes])

  // Refresh the dishes every 30 minutes
  useEffect(() => {
    const interval = setInterval(fetchDishes, 1000 * 60 * 30)
    return () => clearInterval(interval)
  }, [fetchDishes])

  return (
    <>
      {loading || allowOrdersUntil === undefined ? (
        <StyledProgress color="inherit" />
      ) : (
        <>
          <TodayDishes />
          <FutureDishes />
        </>
      )}

      <ConfirmOrderDialog />
      <ConfirmLeftOverOrderDialog />

      <DishesSnackbars />
    </>
  )
}

export default DishesPage
