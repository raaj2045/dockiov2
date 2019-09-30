import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  //We are on server OR user is not using metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/04280dc3e8a2405db2111ac4490d86be"
  );

  web3 = new Web3(provider);
}

export default web3;
