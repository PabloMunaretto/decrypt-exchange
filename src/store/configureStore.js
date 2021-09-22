import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit'
import { web3Reducer, tokenReducer, exchangeReducer } from './reducers';


const preloadedState = {};

export default configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: {
        web3State: web3Reducer,
        tokenData: tokenReducer,
        dexData: exchangeReducer,
    },
    preloadedState,
})
