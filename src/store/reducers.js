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
        }
    }
})

export const { loadWeb3, web3AccountLoaded } = web3Slice.actions;
export const { tokenLoaded } = tokenSlice.actions
export const { dexLoaded } = exchangeSlice.actions

export const tokenReducer = tokenSlice.reducer;
export const exchangeReducer = exchangeSlice.reducer;
export default web3Slice.reducer
