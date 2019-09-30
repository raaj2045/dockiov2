(async () => {
	const encrypt = require("eciesjs").encrypt;
	const decrypt = require("eciesjs").decrypt;
	const PrivateKey = require("eciesjs").PrivateKey;

	const fs = require("fs");

	const k1 = new PrivateKey();
	const k2 = new PrivateKey();
	console.log(k2.toHex());
	console.log(k2.publicKey.toHex());

	const data = fs.readFileSync("./.env");
	const encryptedData = encrypt(k1.publicKey.toHex(), data);

	try {
		var text = decrypt(k1.toHex(), encryptedData);
		console.log(text);
	} catch (err) {
		console.log(err.message);
	}
})().catch((err) => {
	console.log(err.message);
});
