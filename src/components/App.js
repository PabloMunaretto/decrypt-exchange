import React, { useEffect, useCallback } from 'react'
import { useDispatch, connect } from 'react-redux';
import './App.css';
import NavBar from './NavBar';
import Content from './Content';
import { loadProvider, loadAccount, loadToken, loadExchange } from '../store/stateHooks'
import { accountSelector, contractsLoaderSelector } from '../store/storeSelectors'

function App({ contractsLoaded, accountLoaded }) {
  const dispatch = useDispatch()
  
  const loadBlockchainData = useCallback(async() => {
    const web3 = loadProvider(dispatch);
    await loadAccount(web3, dispatch);
    const token = await loadToken(web3, dispatch);
    if (!token) {
      window.alert("Token Smart Contract not detected on the current network, please select another network with Metamask.");
      return
    }
    const exchange = await loadExchange(web3, dispatch);
    if (!exchange) {
      window.alert("Exchange Smart Contract not detected on the current network, please select another network with Metamask.");
      return
    }
  }, [dispatch,])

  useEffect(() => {
    loadBlockchainData()
  }, [loadBlockchainData])

  return (
    <div>
      <NavBar account={accountLoaded}/>
      { contractsLoaded ? <Content /> : <div className="content"></div> }
    </div>
  );
}
const hydrateRedux = (state, props) => { // hydrate App with redux state
  return ({
    contractsLoaded: contractsLoaderSelector(state, props),
    accountLoaded: accountSelector(state)
  })
};

export default connect(hydrateRedux)(App);
