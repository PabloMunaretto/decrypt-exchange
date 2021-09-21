import { createSlice } from '@reduxjs/toolkit'

const initialState = {project: "Pabs Exchange"}
const web3Slice = createSlice({
    name: 'web3State',
    initialState,
    reducers: {
        loadWeb3: (state, action) => {
            const { payload } = action
            return {...state, web3: payload }
        }
    }
})

export const { loadWeb3 } = web3Slice.actions;

export default web3Slice.reducer
