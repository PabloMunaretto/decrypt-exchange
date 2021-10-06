import React, { useEffect, useCallback } from "react";
import { useDispatch, connect } from 'react-redux'
import { loadBalances } from '../store/stateHooks'
import { 
    exchangeSelector,
    web3Selector, 
    tokenSelector, 
    accountSelector,
    etherBalanceSelector,
    tokenBalanceSelector,
    exchangeEtherBalanceSelector,
    exchangeTokenBalanceSelector,
    balancesLoadingSelector
 } from '../store/storeSelectors';

// const showForm = (props) => {

//     return (

//     )
// }

function Balance({ web3, exchange, token, account, balancesLoading }) {
    const dispatch = useDispatch()

    const loadBlockchainData = useCallback(async() => {
        await loadBalances(dispatch, web3, exchange, token, account)
    }, [dispatch, web3, exchange, token, account])

    useEffect(() => {
        loadBlockchainData()
    }, [loadBlockchainData])

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">Balance</div>
      <div className="card-body">
          user's Balance
      </div>
    </div>
  );
}
const hydrateRedux = (state) => {
    const balancesLoading = balancesLoadingSelector(state)
    return({
        exchange: exchangeSelector(state),
        account: accountSelector(state),
        token: tokenSelector(state),
        web3: web3Selector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading,
        showForm: !balancesLoading
    })
}

export default connect(hydrateRedux)(Balance);
