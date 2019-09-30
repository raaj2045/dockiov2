import web3 from './web3';
import StudentContract from './build/StudentContract.json';
import Address from '../config';
const instance = new web3.eth.Contract(
    JSON.parse(StudentContract.interface),
    Address.studentContractAddress
);

export default instance;