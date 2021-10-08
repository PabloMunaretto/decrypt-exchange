import React, { useEffect, useCallback } from "react";
import Spinner from "./Spinner";
import { useDispatch, connect } from "react-redux";
import { subscribeToEvents, 
  loadBalances, 
  depositEther, 
  withdrawEther,
  depositToken,
  withdrawToken
} from "../store/stateHooks";
import { 
  etherDepositAmountChange, 
  etherWithdrawAmountChange,
  tokenDepositAmountChange,
  tokenWithdrawAmountChange
} from '../store/reducers'
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
} from "../store/storeSelectors";
import { Tab, Tabs } from "react-bootstrap";

const showFormFunc = (props) => {
  const {
      etherBalance,
      tokenBalance,
      exchangeEtherBalance,
      exchangeTokenBalance,
      exchange,
      token,
      account,
      web3,
      dispatch,
      etherDepositAmount,
      etherWithdrawAmount,
      tokenDepositAmount,
      tokenWithdrawAmount
  } = props;

  return (
    <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
      <Tab eventKey="deposit" title="deposit" className="bg-dark">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>{etherBalance}</td>
              <td>{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className='row' onSubmit={(e) => {
            e.preventDefault()
            depositEther(dispatch, exchange, web3, etherDepositAmount, account)
        }}>
            <div className='col-12 col-sm pr-sm-2'>
                <input
                type='text'
                placeHolder='ETH amount'
                onChange={(e) => dispatch(etherDepositAmountChange(e.target.value))}
                className='form-control form-control-sm bg-dark text-white'
                required
                />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
                <button
                type='submit'
                className='btn btn-primary btn-block btn-sm'>Deposit</button>
            </div>
        </form>

        <table className="table table-dark table-sm small">
          <tbody>
            <tr>
              <td>DAPP</td>
              <td>{tokenBalance}</td>
              <td>{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className='row' onSubmit={(e) => {
            e.preventDefault()
            depositToken(dispatch, exchange, token, web3, tokenDepositAmount, account)
        }}>
            <div className='col-12 col-sm pr-sm-2'>
                <input
                type='text'
                placeHolder='Token amount'
                onChange={(e) => dispatch(tokenDepositAmountChange(e.target.value))}
                className='form-control form-control-sm bg-dark text-white'
                required
                />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
                <button
                type='submit'
                className='btn btn-primary btn-block btn-sm'>Deposit</button>
            </div>
        </form>

      </Tab>
      
      <Tab eventKey="withdraw" title="withdraw" className="bg-dark">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>{etherBalance}</td>
              <td>{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className='row' onSubmit={(e) => {
            e.preventDefault()
            withdrawEther(dispatch, exchange, web3, etherWithdrawAmount, account)
        }}>
            <div className='col-12 col-sm pr-sm-2'>
                <input
                type='text'
                placeHolder='ETH amount'
                onChange={(e) => dispatch(etherWithdrawAmountChange(e.target.value))}
                className='form-control form-control-sm bg-dark text-white'
                required
                />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
                <button
                type='submit'
                className='btn btn-primary btn-block btn-sm'>Withdraw</button>
            </div>
        </form>

        <table className="table table-dark table-sm small">
          <tbody>
            <tr>
              <td>DAPP</td>
              <td>{tokenBalance}</td>
              <td>{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>

        <form className='row' onSubmit={(e) => {
            e.preventDefault()
            withdrawToken(dispatch, exchange, token, web3, tokenWithdrawAmount, account)
        }}>
            <div className='col-12 col-sm pr-sm-2'>
                <input
                type='text'
                placeHolder='Token amount'
                onChange={(e) => dispatch(tokenWithdrawAmountChange(e.target.value))}
                className='form-control form-control-sm bg-dark text-white'
                required
                />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
                <button
                type='submit'
                className='btn btn-primary btn-block btn-sm'>Withdraw</button>
            </div>
        </form>
      </Tab>
    </Tabs>
  );
};

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
        {showForm ? showFormFunc(props, dispatch) : <Spinner type="table" />}
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
