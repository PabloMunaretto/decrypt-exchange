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
module.exports = { ETHER_ADDRESS, ether, tokens, wait }