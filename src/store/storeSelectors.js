import { get } from 'lodash'; 
import { createSelector } from 'reselect';

const account = state => get(state, 'web3State.account'); // using lodash instead of state.web3.account
export const accountSelector = createSelector(account, a => a);

const tokenLoaded = state => get(state, 'tokenData.loaded', false);  
export const tokenSelector = createSelector(tokenLoaded, tkn => tkn);

const dexLoaded = state => get(state, 'dexData.loaded', false);   
export const dexSelector = createSelector(dexLoaded, dex => dex);

export const contractsLoaderSelector = createSelector(
    tokenLoaded,
    dexLoaded,
    (tkn, dex) => (tkn && dex)
)

const exchange = state => get(state, 'dexData.contract');
export const exchangeSelector = createSelector(exchange, ex => ex)


