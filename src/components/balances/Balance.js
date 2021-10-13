import React, { useEffect, useCallback } from "react";
import { useDispatch, connect } from "react-redux";
import Spinner from "../Spinner";
import ShowForm from './Tab'

import { subscribeToEvents, loadBalances } from "../../store/stateHooks";
import {
  exchangeSelector,
  web3Selector,
  tokenSelector,
  accountSelector,
  etherBalanceSelector,
  tokenBalanceSelector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  balancesLoadingSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector
} from "../../store/storeSelectors";


function Balance(props) {
  const { web3, exchange, token, account, showForm } = props;
  const dispatch = useDispatch();

  const loadBlockchainData = useCallback(async () => {
    await loadBalances(dispatch, web3, exchange, token, account);
    await subscribeToEvents(exchange, dispatch);
  }, [dispatch, web3, exchange, token, account]);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">Balance</div>
      <div className="card-body">
        {showForm ? ShowForm(props, dispatch) : <Spinner type="table" />}
      </div>
    </div>
  );
}

const hydrateRedux = (state) => {
  const balancesLoading = balancesLoadingSelector(state);
  return {
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    etherBalance: etherBalanceSelector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
    showForm: !balancesLoading,
    etherDepositAmount: etherDepositAmountSelector(state),
    etherWithdrawAmount: etherWithdrawAmountSelector(state),
    tokenDepositAmount: tokenDepositAmountSelector(state),
    tokenWithdrawAmount: tokenWithdrawAmountSelector(state)
  };
};

export default connect(hydrateRedux)(Balance);


// Falta modificar el estado de redux (si se puede) para updatear los balances sin refreshear.
// depositar y retirar eth y token. Para el token necesito: 1-aprobar al exchange para hacer uso de mis tokens. 2- depositar
