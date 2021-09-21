import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers';


const preloadedState = {};

export default configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: {
        web3State: rootReducer,
    },
    preloadedState,
})
