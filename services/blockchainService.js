const { contract } = require("../config/ethers");

const recordActionOnChain = async (userAddress, description) => {
  const tx = await contract.recordAction(userAddress, description);
  await tx.wait();
  return tx.hash;
};

module.exports = {
  recordActionOnChain,
};
