import web3 from "./web3";
import RequestContract from "./build/RequestContract.json";
import Address from "../config";
const instance = new web3.eth.Contract(
  JSON.parse(RequestContract.interface),
  Address.requestContractAddress
);

export default instance;
