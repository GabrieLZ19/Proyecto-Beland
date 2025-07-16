const { contract } = require("../config/ethers");

const recordActionOnChain = async (description) => {
  const tx = await contract.recordAction(description);
  await tx.wait();
  return tx.hash;
};

module.exports = {
  recordActionOnChain,
};
