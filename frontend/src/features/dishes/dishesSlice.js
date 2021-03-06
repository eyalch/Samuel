import { createSlice } from "@reduxjs/toolkit"
import * as api from "api"
import { setShowAuthDialog } from "features/auth/authSlice"
import { isDishForToday } from "./dishesHelpers"

export const messages = {
  ORDER_SUCCESS: 1,
  CANCEL_ORDER_SUCCESS: 2,
  TIME_IS_UP: 3,
  MAX_ORDERS_FOR_DAY: 4,
  NO_DISHES_LEFT: 5,
  CANCEL_TIME_IS_UP: 6,
}

const ERR_TIME_IS_UP = "time_is_up"
const ERR_MAX_ORDERS_FOR_DAY = "max_orders_for_day"
const ERR_NO_DISHES_LEFT = "no_dishes_left"

const initialState = {
  dishes: [],
  loading: true,
  pendingDish: null,
  confirmOrderDialog: false,
  message: null,
  hasTimeLeft: false,
  confirmLeftOverOrderDialog: false,
}

// Find how many orders the user has made for a given date
const getOrdersCountForDate = (dishes, date) => {
  return dishes
    .filter((dish) => dish.date === date)
    .reduce((count, dish) => count + dish.orders_count, 0)
}

const updateDish = (state, updatedDish) => {
  const dishIndex = state.dishes.findIndex((d) => d.id === updatedDish.id)
  state.dishes[dishIndex] = updatedDish
}

const dishes = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    setMessage(state, { payload: message }) {
      state.message = message
    },
    resetMessage(state) {
      state.message = null
    },

    handleErrors(state, { payload: errorCode }) {
      state.message =
        {
          [ERR_TIME_IS_UP]: messages.TIME_IS_UP,
          [ERR_MAX_ORDERS_FOR_DAY]: messages.MAX_ORDERS_FOR_DAY,
          [ERR_NO_DISHES_LEFT]: messages.NO_DISHES_LEFT,
        }[errorCode] || null
    },

    fetchDishesStart(state) {
      state.loading = true
    },
    fetchDishesEnd(state) {
      state.loading = false
    },
    fetchDishesSuccess(state, { payload: dishes }) {
      state.dishes = dishes
    },

    orderDishSuccess(state, { payload: updatedDish }) {
      updateDish(state, updatedDish)
      state.message = messages.ORDER_SUCCESS
    },

    setPendingDish(state, { payload: dish }) {
      state.pendingDish = dish
    },
    setConfirmPendingDish(state, { payload: dish }) {
      state.confirmOrderDialog = true
      state.pendingDish = dish
    },
    resetConfirmPendingDish(state) {
      state.pendingDish = null
      state.confirmOrderDialog = false
    },

    setConfirmLeftOverOrderDialog(state, { payload: dish }) {
      state.confirmLeftOverOrderDialog = true
      state.pendingDish = dish
    },
    resetConfirmLeftOverOrderDialog(state) {
      state.pendingDish = null
      state.confirmLeftOverOrderDialog = false
    },

    cancelOrderSuccess(state, { payload: updatedDish }) {
      updateDish(state, updatedDish)
      state.message = messages.CANCEL_ORDER_SUCCESS
    },

    setHasTimeLeft(state, { payload: hasTimeLeft }) {
      state.hasTimeLeft = hasTimeLeft
    },
  },
})

const {
  fetchDishesStart,
  fetchDishesEnd,
  fetchDishesSuccess,
  orderDishSuccess,
  setPendingDish,
  setConfirmPendingDish,
  setMessage,
  handleErrors,
  cancelOrderSuccess,
  setConfirmLeftOverOrderDialog,
} = dishes.actions

export const {
  resetConfirmPendingDish,
  resetMessage,
  setHasTimeLeft,
  resetConfirmLeftOverOrderDialog,
} = dishes.actions

export default dishes.reducer

export const fetchDishes = () => async (dispatch) => {
  dispatch(fetchDishesStart())
  try {
    const { data: dishes } = await api.dishes.getDishes()
    dispatch(fetchDishesSuccess(dishes))
  } finally {
    dispatch(fetchDishesEnd())
  }
}

export const orderDish = (dish) => async (dispatch, getState) => {
  const {
    auth: { authenticated },
    dishes: {
      dishes,
      confirmOrderDialog,
      hasTimeLeft,
      confirmLeftOverOrderDialog,
    },
    preferences: { max_orders_per_day },
  } = getState()

  if (!authenticated) {
    dispatch(setPendingDish(dish))
    dispatch(setShowAuthDialog(true))
    return
  }

  const ordersCountForDate = getOrdersCountForDate(dishes, dish.date)

  // Show a message if the user has already made the maximum amount of orders for the day
  if (ordersCountForDate === max_orders_per_day) {
    dispatch(setMessage(messages.MAX_ORDERS_FOR_DAY))
    return
  }

  const _isDishForToday = isDishForToday(dish)

  // Show a confirm dialog if the user has already made an order
  if (
    (!_isDishForToday || hasTimeLeft) &&
    ordersCountForDate > 0 &&
    !confirmOrderDialog &&
    !confirmLeftOverOrderDialog
  ) {
    dispatch(setConfirmPendingDish(dish))
    return
  } else if (confirmOrderDialog) {
    dispatch(resetConfirmPendingDish())
  }

  // Show a confirm dialog when trying to order a left-over dish which can't be canceled
  if (_isDishForToday && !hasTimeLeft && !confirmLeftOverOrderDialog) {
    dispatch(setConfirmLeftOverOrderDialog(dish))
    return
  } else if (confirmLeftOverOrderDialog) {
    dispatch(resetConfirmLeftOverOrderDialog(dish))
  }

  dispatch(resetMessage())

  try {
    const { data: updatedDish } = await api.dishes.orderDish(dish.id)
    dispatch(orderDishSuccess(updatedDish))
  } catch (err) {
    dispatch(handleErrors(err.response.data.code))
  }
}

export const orderPendingDish = () => async (dispatch, getState) => {
  const { pendingDish } = getState().dishes

  if (!pendingDish) return

  dispatch(setPendingDish(null))

  dispatch(orderDish(pendingDish))
}

export const cancelOrder = (dish) => async (dispatch, getState) => {
  const { hasTimeLeft } = getState().dishes

  if (isDishForToday(dish) && !hasTimeLeft) {
    dispatch(setMessage(messages.CANCEL_TIME_IS_UP))
    return
  }

  dispatch(resetMessage())

  try {
    const { data: updatedDish } = await api.dishes.cancelOrder(dish.id)
    dispatch(cancelOrderSuccess(updatedDish))
  } catch (err) {
    dispatch(handleErrors(err.response.data.code))
  }
}
