import { useSelector } from 'react-redux';
import { loadWeb3 } from './reducers';
import Web3 from 'web3';

export const loadProvider = (dispatch) => {
    const web3 = new Web3(window.ethereum);
    dispatch(loadWeb3(web3))
    // dispatch(loadWeb3("hola"))
    return web3;
}

// export const estado = () => {
//     const web3State = useSelector(state => state.web3State)
//     console.log("web3state", web3State)
//     return web3State;
// }