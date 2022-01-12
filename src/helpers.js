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

export const formatBalance = (balance) => {
    const precision = 100
    balance = web3.utils.fromWei(balance.toString(), 'ether')
    balance = Math.round(balance * precision) / precision // redondeado a dos decimales
    return balance;
}
export const configureNetwork = async(web3) => {
    if (web3) {
        try {
          // check if the chain to connect to is installed
  
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xfa2' }], // chainId must be in hexadecimal numbers
          });
            // window.location.reload()
        } catch (error) {
          // This error code indicates that the chain has not been added to MetaMask
          // if it is not, then install it into the user MetaMask
          if (error.code === 4902 || error.code === -32603) {
            try {
              await window.ethereum
                .request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0xfa2',
                      chainName: 'Fantom Opera Testnet',
                      rpcUrls: ['https://rpc.testnet.fantom.network/'],
                      nativeCurrency: {
                        name: 'Fantom ETH',
                        symbol: 'FTM',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://testnet.ftmscan.com/'],
                    },
                  ],
                })
            } catch (addError) {
              console.error(addError);
            }
          }
          console.error(error);
        }
    }
}

export const formatAccount = (account) => {
    const A = account.slice(0, 4);
    const B = account.slice(account.length-4);
    const formatedAccount = `${A}...${B}`;
    return formatedAccount;
}

export default { ETHER_ADDRESS, ether, tokens, wait, formatEth, formatToken, RED, GREEN }