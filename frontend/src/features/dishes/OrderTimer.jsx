import { Typography } from "@material-ui/core"
import { createSelector } from "@reduxjs/toolkit"
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { todayDishesSelector } from "./dishesSelectors"
import { setHasTimeLeft } from "./dishesSlice"

const StyledContainer = styled.div`
  margin-top: -${(p) => p.theme.spacing(1)}px;
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${(p) => p.theme.breakpoints.up("sm")} {
    margin-top: -${(p) => p.theme.spacing(2)}px;
  }
`

export const allowOrdersUntilSelector = createSelector(
  (state) => state.preferences.allow_orders_until,
  (allow_orders_until) => {
    if (!allow_orders_until) return

    const endTime = new Date()
    endTime.setHours(...allow_orders_until.split(":"))
    return endTime
  }
)

const hasDishesLeftForTodaySelector = createSelector(
  todayDishesSelector,
  (state) => state.preferences.show_today_dishes_until,
  (todayDishes, show_today_dishes_until) => {
    const showTodayDishesUntil = new Date()
    showTodayDishesUntil.setHours(...show_today_dishes_until.split(":"))

    if (new Date() > showTodayDishesUntil) return false

    return todayDishes.some((dish) => dish.has_dishes_left)
  }
)

const OrderTimer = () => {
  const { hasTimeLeft } = useSelector((state) => state.dishes)
  const allowOrdersUntil = useSelector(allowOrdersUntilSelector)
  const hasDishesLeftForToday = useSelector(hasDishesLeftForTodaySelector)
  const dispatch = useDispatch()

  const [timeLeftToOrderInMillis, setTimeLeftToOrderInMillis] = useState(
    allowOrdersUntil - new Date()
  )

  const updateTimeLeft = useCallback(() => {
    const millisLeft = allowOrdersUntil - new Date()

    setTimeLeftToOrderInMillis(millisLeft)

    if (!hasTimeLeft && millisLeft > 0) {
      dispatch(setHasTimeLeft(true))
    } else if (hasTimeLeft && millisLeft <= 0) {
      dispatch(setHasTimeLeft(false))
    }
  }, [allowOrdersUntil, dispatch, hasTimeLeft])

  useEffect(updateTimeLeft, [])

  useEffect(() => {
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [updateTimeLeft])

  return (
    <StyledContainer>
      {timeLeftToOrderInMillis < 0 ? (
        <>
          <Typography variant="h4" component="h2">
            ההזמנה להיום נסגרה
          </Typography>
          {hasDishesLeftForToday && (
            <Typography variant="subtitle1" component="p">
              (ניתן להזמין מנות עודפות)
            </Typography>
          )}
        </>
      ) : (
        <>
          <Typography variant="subtitle2">זמן שנותר לביצוע הזמנה:</Typography>
          <Typography variant="h4" component="h2">
            {new Date(timeLeftToOrderInMillis).toISOString().slice(11, 19)}
          </Typography>
        </>
      )}
    </StyledContainer>
  )
}

export default OrderTimer
