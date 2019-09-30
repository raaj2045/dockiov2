import web3 from './web3';
import Address from '../config';
import SchoolContract from '../ethereum/build/SchoolContract.json';
const instance = new web3.eth.Contract(
    JSON.parse(SchoolContract.interface),
    Address.schoolContractAddress
);

export default instance;