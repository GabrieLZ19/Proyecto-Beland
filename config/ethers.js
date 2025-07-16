const { ethers } = require("ethers");
const abi = require("../contractABI.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = "0xec53c7721aa58afc0ad380b70d32453c453f031b";
const contract = new ethers.Contract(contractAddress, abi, wallet);

module.exports = {
  provider,
  wallet,
  contract,
};
