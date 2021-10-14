import React, { useEffect, useCallback } from 'react'
import { useDispatch, connect } from 'react-redux';
import './App.css';
import NavBar from './NavBar';
import Content from './Content';
import { loadProvider, loadAccount, loadToken, loadExchange } from '../store/stateHooks'
import { accountSelector, contractsLoaderSelector, web3Selector } from '../store/storeSelectors'
import detectEthereumProvider from '@metamask/detect-provider';

function App({ contractsLoaded, accountLoaded, web3 }) {
  const dispatch = useDispatch()
  const provider = async() => await detectEthereumProvider()

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
  }, [dispatch])

  // Metamask events
  window.ethereum.on('accountsChanged', async() => { 
    if (web3) { await loadAccount(web3, dispatch) }
  });
  window.ethereum.on('chainChanged', () => { window.location.reload() });
  
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
    accountLoaded: accountSelector(state),
    web3: web3Selector(state)
  })
};

export default connect(hydrateRedux)(App);
