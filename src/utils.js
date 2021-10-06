

export const accountsChanged = () => {
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log("accounts", accounts)
    });
}