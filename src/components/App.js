import React, { useEffect, useCallback } from 'react'
import { useDispatch, connect } from 'react-redux';
import './App.css';
import NavBar from './NavBar';
import Content from './Content';
import { loadProvider, loadAccount, loadToken, loadExchange } from '../store/stateHooks'
import { accountSelector, contractsLoaderSelector, web3Selector, tokenPriceSelector } from '../store/storeSelectors'
import { configureNetwork } from '../helpers'
// import detectEthereumProvider from '@metamask/detect-provider';

function App({ contractsLoaded, accountLoaded, web3, PBS }) {
  const dispatch = useDispatch()
  // const provider = async() => await detectEthereumProvider()
  if (PBS) { document.title = `Decrypt - $${PBS} ETH` }

  const loadBlockchainData = useCallback(async() => {
    const web3 = loadProvider(dispatch);
    await loadAccount(web3, dispatch);
    await loadToken(web3, dispatch);
    loadExchange(web3, dispatch);
    configureNetwork(web3)
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
    web3: web3Selector(state),
    PBS: tokenPriceSelector(state)
  })
};

export default connect(hydrateRedux)(App);
