import web3 from './web3';
import FileContract from './build/FileContract.json';
import Address from '../config';
const instance = new web3.eth.Contract(
    JSON.parse(FileContract.interface),
    Address.fileContractAddress
);

export default instance;