import { useSelector } from 'react-redux';
import { loadWeb3, web3AccountLoaded, tokenLoaded, dexLoaded } from './reducers';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json'

export const loadProvider = (dispatch) => {
    const web3 = new Web3(window.ethereum);
    dispatch(loadWeb3(web3))
    return web3;
}
export const loadAccount = async(web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account))
    return account
}
export const loadToken = async(web3, dispatch) => {
    const abi = Token.abi;
    try {
        const networkId = await web3.eth.net.getId()
        const tokenAddress = Token.networks[networkId].address;
        const tokenContract = new web3.eth.Contract(abi, tokenAddress);

        dispatch(tokenLoaded({ tokenAddress, tokenContract }))
        return tokenContract;
    } catch (error) {
        window.alert("Contract not deployed to the current network, please select another network in Metamask.")
        return null;
    }
}
export const loadExchange = async(web3, dispatch) => {
    const abi = Exchange.abi;
    try {
        const networkId = await web3.eth.net.getId();
        const exchangeAddress = Exchange.networks[networkId].address;
        const exchangeContract = new web3.eth.Contract(abi, exchangeAddress);

        dispatch(dexLoaded({ exchangeAddress, exchangeContract }));
        return exchangeContract;
    } catch (error) {
        window.alert("Contract not deployed to the current network, please select another network in Metamask.")
        return null;
    }
}

// export const estado = () => {
//     const web3State = useSelector(state => state.web3State)
//     console.log("web3state", web3State)
//     return web3State;
// }