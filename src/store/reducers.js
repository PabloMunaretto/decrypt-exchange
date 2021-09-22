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
        }
    }
})

export const { loadWeb3, web3AccountLoaded } = web3Slice.actions;
export const { tokenLoaded } = tokenSlice.actions
export const { dexLoaded, cldOrdersLoaded, filledOrdersLoaded, allOrdersLoaded } = exchangeSlice.actions

export const web3Reducer = web3Slice.reducer
export const tokenReducer = tokenSlice.reducer;
export const exchangeReducer = exchangeSlice.reducer;

