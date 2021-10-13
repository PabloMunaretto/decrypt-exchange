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
            // Prevent duplicate orders
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
        // depositedEth: (state, action) => {
        //     const previousBalance = Number(state.etherBalance)
        //     const newDeposit = Number(action.payload.amount)
        //     const etherBalance = previousBalance + newDeposit
        //     console.log("deposit", etherBalance, action.payload)
        //     return {
        //         ...state,
        //         balancesLoading: false,
        //         etherBalance
        //     }
        // },
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
        },
        etherDepositAmountChange: (state, action) => {
            return { ...state, etherDepositAmount: action.payload }
        },
        etherWithdrawAmountChange: (state, action) => {
            return { ...state, etherWithdrawAmount: action.payload }
        },
        tokenDepositAmountChange: (state, action) => {
            return { ...state, tokenDepositAmount: action.payload }
        },
        tokenWithdrawAmountChange: (state, action) => {
            return { ...state, tokenWithdrawAmount: action.payload }
        },
        // BUY ORDERS
        buyOrderAmountChanged: (state, action) => {
            return { ...state, buyOrder: { ...state.buyOrder, amount: action.payload }}
        },
        buyOrderPriceChanged: (state, action) => {
            return { ...state, buyOrder: { ...state.buyOrder, price: action.payload }}
        },
        buyOrderMaking: (state, action) => {
            return { ...state, buyOrder: { ...state.buyOrder, amount: null, price: null, making: true }}
        },
        orderMade: (state, action) => {
            const { payload } = action
            // Prevent duplicate orders
            let data;
            const index = state.allOrders.data.findIndex(order => order.id === payload.id )
            if (index === -1) {
                data = [ ...state.allOrders.data, payload ]
            } else {
                data = state.allOrders.data
            }
            return {
                ...state,
                allOrders: {
                    ...state.allOrders,
                    data
                },
                buyOrder: {
                    ...state.buyOrder,
                    making: false
                },
                sellOrder: {
                    ...state.sellOrder,
                    making: false
                }
            }
        },
        // SELL ORDERS
        sellOrderAmountChanged: (state, action) => {
            return { ...state, sellOrder: { ...state.sellOrder, amount: action.payload }}
        },
        sellOrderPriceChanged: (state, action) => {
            return { ...state, sellOrder: { ...state.sellOrder, price: action.payload }}
        },
        sellOrderMaking: (state, action) => {
            return { ...state, sellOrder: { ...state.sellOrder, amount: null, price: null, making: true }}
        },
    }
})

export const { loadWeb3, web3AccountLoaded, etherBalanceLoaded } = web3Slice.actions;
export const { tokenLoaded, tokenBalanceLoaded } = tokenSlice.actions
export const { 
    dexLoaded, 
    cldOrdersLoaded, 
    filledOrdersLoaded, 
    allOrdersLoaded, 
    orderCancelling, 
    orderFilling, 
    orderCancelled, 
    orderFilled, 
    // depositedEth,
    balancesLoading, 
    balancesLoaded, 
    exchangeEtherBalanceLoaded, 
    exchangeTokenBalanceLoaded,
    etherDepositAmountChange,
    etherWithdrawAmountChange,
    tokenDepositAmountChange,
    tokenWithdrawAmountChange,
    buyOrderAmountChanged,
    buyOrderPriceChanged,
    buyOrderMaking,
    orderMade,
    sellOrderAmountChanged,
    sellOrderPriceChanged,
    sellOrderMaking
} = exchangeSlice.actions

export const web3Reducer = web3Slice.reducer
export const tokenReducer = tokenSlice.reducer;
export const exchangeReducer = exchangeSlice.reducer;

