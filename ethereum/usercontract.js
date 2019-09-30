import web3 from './web3';
import UserContract from './build/UserContract.json';
import Address from '../config';
const instance = new web3.eth.Contract(
    JSON.parse(UserContract.interface),
    Address.userContractAddress
);

export default instance;