import React, { useEffect } from 'react'
import { useDispatch, useSelector, connect } from 'react-redux';
import { get } from 'lodash'; 
import './App.css';
import NavBar from './NavBar';
import Content from './Content';
import { loadProvider, loadAccount, loadToken, loadExchange } from '../store/stateHooks'
import { accountSelector, contractsLoaderSelector } from '../store/storeSelectors'

function App({ contracts, accountLoaded }) {
  const dispatch = useDispatch()

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async() => {
    const web3 = loadProvider(dispatch);
    const account = loadAccount(web3, dispatch);
    const token = loadToken(web3, dispatch);
    const exchange = loadExchange(web3, dispatch);
  }
  
  const renderContent = () => {
    if (contracts) {
      return <Content />
    }
  }

  return (
    <div>
      <NavBar account={accountLoaded}/>
      {renderContent()}
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
