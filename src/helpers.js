export const EVM_revert = 'VM Exception while processing transaction: revert';
export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
const web3 = require("web3")

export const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    ).toString()
}
// same as ether
export const tokens = (n) => ether(n)

export const wait = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
} 

export const formatToken = (number) => {
    const formatedNumber = web3.utils.fromWei(number, 'Ether') // every other token 18 decimals
    return Number(formatedNumber)
}
export const RED = 'danger'
export const GREEN = 'success'

export const formatEth = (eth) => formatToken(eth)

export default { ETHER_ADDRESS, ether, tokens, wait, formatEth, formatToken, RED, GREEN }