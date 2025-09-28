require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // default Ganache RPC URL
      accounts: ["969BF18dFdEEF29293301BECb6Cd36fcc744917f"] // replace with actual private key
    }
  }
};




