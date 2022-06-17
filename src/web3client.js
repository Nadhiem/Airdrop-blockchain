import Web3 from "web3";
import ERC20ADROPBuild from "./ERC20ADROP.json";

let smartContractAddresses = "0x340Bb767cA5053c3A0FD6CC5A08AF63a58f7104F";
let adminAddress = "0xFCbE22d38293dd8536868c0Adbfb7e407e353E4a";
let selectedAccount;
let tokenContract;
let isInitialized = false;
let accountList = [];
let amountList = [];


export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    // Metamask is Installed

    await provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected Account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  window.ethereum.on("accountChange", function (accounts) {
    selectedAccount = accounts[0];
    console.log(`Selected Account changed to ${selectedAccount}`);
  });

  const web3 = new Web3(provider);

  tokenContract = new web3.eth.Contract(
    ERC20ADROPBuild.abi,
    smartContractAddresses
  );


  isInitialized = true;
};


export const addAddressForAirDrop = async (address, amount) => {
    if (!isInitialized) {
      await init();
    }
  
    return tokenContract.methods
      .addAddressForAirDrop(address, Web3.utils.toWei(`${amount}`, "ether"))
      .send({ from: selectedAccount });
  };

export const claimToken = async (amount) => {
  if (!isInitialized) {
    await init();
  }

  return tokenContract.methods
    .claimToken(selectedAccount,amount)
    .send({ from: selectedAccount });
};


export const isProcessed = async () => {
  if (!isInitialized) {
    await init();
  }

  return await tokenContract.methods
    .getProcessedAirdrop(selectedAccount)
    .call();
};


export const isWhitelisted = async () => {
  if (!isInitialized) {
    await init();
  }

  accountList = await tokenContract.methods.getWhitelistedAddress().call();
  amountList = await tokenContract.methods.getAllocatedAmount().call();

  let flag = false;
  let i;

  for (i = 0; i < accountList.length; i++) {
    if (
      accountList[i]
        .toLowerCase()
        ===selectedAccount.toLowerCase()
    ) {
      flag = true;
      return await [flag, Web3.utils.fromWei(`${amountList[i]}`, "ether")];
    }
  }

  return await [flag, null];
};

export const checkAdmin = async () => {
  if (!isInitialized) {
    await init();
  }

  let flag = false;

  if (
    selectedAccount.toLowerCase()===adminAddress.toLowerCase()
  ) {
    flag = true;
    return flag;
  } else {
    return flag;
  }
};

