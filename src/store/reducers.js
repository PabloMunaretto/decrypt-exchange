import { createSlice } from '@reduxjs/toolkit'

//----- Web3
const web3Slice = createSlice({
    name: 'web3State',
    initialState: {},
    reducers: {
        loadWeb3: (state, action) => {
            const { payload } = action
            return { ...state, connection: payload }
        },
        web3AccountLoaded: (state, action) => {
            const { payload } = action
            return { ...state, account: payload }
        },
        etherBalanceLoaded: (state, action) => {
            return { ...state, balance: action.payload }
        }
    }
})
//----- Token
const tokenSlice = createSlice({
    name: 'tokenData',
    initialState: {},
    reducers: {
        tokenLoaded: (state, action) => {
            const { payload } = action
            return { ...state, loaded: true, ...payload };
        },
        tokenBalanceLoaded: (state, action) => {
            return { ...state, balance: action.payload }
        }
    }
})
//----- Exchange
const exchangeSlice = createSlice({
    name: 'dexData',
    initialState: {},
    reducers: {
        dexLoaded: (state, action) => {
            const { payload } = action
            return { ...state, loaded: true, ...payload };
        },
        cldOrdersLoaded: (state, action) => {
            const { payload } = action
            return { ...state, cancelledOrders: { loaded: true, data: payload }}
        },
        filledOrdersLoaded: (state, action) => {
            const { payload } = action
            return { ...state, filledOrders: { loaded: true, data: payload }}
        },
        allOrdersLoaded: (state, action) => {
            const { payload } = action
            return { ...state, allOrders: { loaded: true, data: payload }}
        },
        orderCancelling: (state, action) => {
            return { ...state, orderCancelling: true }
        },
        orderCancelled: (state, action) => {
            const { payload } = action
            return { 
                ...state, 
                orderCancelling: false, 
                cancelledOrders: {
                    ...state.cancelledOrders,
                    data: [
                        ...state.cancelledOrders.data,
                        payload
                    ]
                }
            }
        },
        orderFilling: (state, action) => {
            return { ...state, orderFilling: true }
        },
        orderFilled: (state, action) => {
            const { payload } = action
            // Prevent duplucate orders
            const index = state.filledOrders.data.findIndex(order => order.id === payload.id)
            let data;
            if (index === -1) {
                data = [ ...state.filledOrders.data, payload ]
            } else {
                data = state.filledOrders.data
            }
            return {
                ...state,
                orderFilling: false,
                filledOrders: {
                    ...state.filledOrders,
                    data
                }
            }
        },
        balancesLoading: (state, action) => {
            return { ...state, balancesLoading: true }
        },
        balancesLoaded: (state, action) => {
            return { ...state, balancesLoading: false }
        },
        exchangeEtherBalanceLoaded: (state, action) => {
            return { ...state, etherBalance: action.payload }
        },
        exchangeTokenBalanceLoaded: (state, action) => {
            return { ...state, tokenBalance: action.payload }
        }
    }
})

export const { loadWeb3, web3AccountLoaded, etherBalanceLoaded } = web3Slice.actions;
export const { tokenLoaded, tokenBalanceLoaded } = tokenSlice.actions
export const { dexLoaded, cldOrdersLoaded, filledOrdersLoaded, allOrdersLoaded, orderCancelling, orderCancelled, orderFilling, orderFilled, balancesLoading, balancesLoaded, exchangeEtherBalanceLoaded, exchangeTokenBalanceLoaded } = exchangeSlice.actions

export const web3Reducer = web3Slice.reducer
export const tokenReducer = tokenSlice.reducer;
export const exchangeReducer = exchangeSlice.reducer;

