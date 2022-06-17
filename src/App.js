import React from "react";
import styles from './Wallet.module.css';
import { useState } from "react";
const Utils = require("./web3client");


function App() {
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState({
    text: "",
    color: "",
    txLink: "",
  });
  const [errorMessage1, setErrorMessage1] = useState("");

  const claim = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let transactionHash;
    await Utils.init();
    setDisplayText({
      text: "",
      color: "",
      txLink: "",
    });

    setLoading(true);

    let whiteListCheck = await Utils.isWhitelisted();

    if (!whiteListCheck[0]) {
      console.log("This address is not whitelisted");
      setLoading(false);
      setDisplayText({
        text: "Your address is not whitelisted for the airdrop",
        color: "red",
      });
    } else if (await Utils.isProcessed()) {
      setLoading(false);
      console.log("This address has already claimed the airdrop");
      setDisplayText({
        text: "Your address has already claimed the airdrop",
        color: "green",
      });
    } else if (parseInt(whiteListCheck[1]) < parseInt(data.get("amount")) ){
      setLoading(false);
      console.log("Invalid Amount");
      setDisplayText({
        text: `Invalid Amount. Your allocated amount is ${whiteListCheck[1]}`,
        color: "red",
      });
    } else {
      await Utils.claimToken(data.get("amount"))
        .then((tx) => {
          console.log(tx);
          transactionHash = tx.transactionHash;
        })
        .catch((err) => {
          console.error(err);
        });

      setLoading(false);

      setDisplayText({
        text: `Airdrop Completed. Check the transaction at`,
        txLink: `https:/ropsten.etherscan.io/tx/${transactionHash.toLowerCase()}`,
        color: "blue",
      });
    }
  };

 const whitelistAddress = async (e) => {
    e.preventDefault();
    setErrorMessage1("");
    await Utils.init();
    if (await Utils.checkAdmin()) {
      const data = new FormData(e.target);

      await Utils.addAddressForAirDrop(data.get("address"), data.get("amount"))
        .then((tx) => {
          console.log(tx);
          console.log(typeof tx);
          console.log(tx.transactionHash);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setErrorMessage1(
        "Only Admin of the contract can add address to whitelist"
      );
    }
  };

  return (
    <div className={styles.grid}>
      <div>
        <form onSubmit={claim}>
          <div className={styles.walletCard3}>
            <main className="mt-4 p-4">
              <h1 className= {styles.h1}>
                                  Token Airdrop
              </h1>
              <br />
              <div className={styles.walletCard}>
                <div className="my-3">
                  <h2 className="drop">
                    Enter the Airdrop Amount
                  </h2>
                  <div className={styles.addressInput}>
                    <input
                      type="number"
                      name="amount"
                      className="input input-bordered block w-full focus:ring focus:outline-none"
                      placeholder="Enter the Airdrop Amount"
                    />
                  </div>
                  <div className="p-4"></div>
                </div>
                {loading ? (
                  <p className="card-text text-green-700 text-center font-bold">
                    Processing....
                  </p>
                ) : null}
                
                {displayText.text && (
                  <p
                    className={
                      "error text-" +
                      displayText.color +
                      "-700 text-center font-bold"
                    }
                  >
                    {" "}
                    {displayText.text}{" "}
                  </p>
                )}
                <div className = {styles.link}>
                {displayText.txLink && (
                  <a
                    href={displayText.txLink}
                    className={
                      "error text-" +
                      displayText.color +
                      "-200 text-left font-bold"
                    }
                    style={{ whiteSpace: "pre" }}
                  >
                    {" "}
                    {displayText.txLink}{" "}
                  </a>
                )}</div>
              </div>
            </main>
            <footer className="p-4">
              <button
                type="submit"
                className={styles.btn}
              >
                Claim Airdrop
              </button>
            </footer>
          </div>
        </form>
      </div>
      <div>
        <div className={styles.walletCard1}>
          <div className="mt">
            <h2 className="">
              For Admin Only
            </h2>
            <form onSubmit={whitelistAddress}>
              <div className="my-3">
                <input
                  type="text"
                  name="address"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Add Address"
                />
              </div>
              <div className="my-3">
                <input
                  type="number"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to transfer"
                />
              </div>
              <div>
                {errorMessage1 && (
                  <p className="error text-red-700 text-center font-bold">
                    {" "}
                    {errorMessage1}{" "}
                  </p>
                )}
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className={styles.btn1}
                >
                  Whitelist An Address
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;