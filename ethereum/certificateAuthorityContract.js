import web3 from "./web3";
import Address from "../config";
import CertificateAuthorityContract from "../ethereum/build/CertificateAuthority.json";
const instance = new web3.eth.Contract(
	JSON.parse(CertificateAuthorityContract.interface),
	Address.certificateAuthorityContractAddress
);

export default instance;
