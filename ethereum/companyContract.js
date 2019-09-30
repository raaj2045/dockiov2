import web3 from "./web3";
import CompanyContract from "./build/CompanyContract.json";
import Address from "../config";
const instance = new web3.eth.Contract(
  JSON.parse(CompanyContract.interface),
  Address.companyContractAddress
);

export default instance;
