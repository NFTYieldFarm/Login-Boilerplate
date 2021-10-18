import { useState, useEffect } from "react";
import Web3 from "web3";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [account, setAccount] = useState(null);
  let [web3, setWeb3] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [disconnected, setDisconnected] = useState(false);
  console.log(disconnected);
  useEffect(() => {
    checkAccount();
  }, [account]);

  // invoke to connect to wallet account
  async function activate() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        checkAccount();
      } catch (err) {
        console.log("user did not add account...", err);
      }
    }
  }

  // invoke to check if account is already connected
  async function checkAccount() {
    let web3 = new Web3(window.ethereum);
    setWeb3(web3);
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const chainId = await web3.eth.getChainId();
    setChainId(chainId);

    window.ethereum.on("accountsChanged", function (accounts) {
      setAccount(accounts[0]);
    });

    window.ethereum.on("networkChanged", function (networkId) {
      setChainId(networkId);
    });

    setDisconnected(false);
  }

  function disconnect() {
    setDisconnected(true);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>EzBackend Web3 Demo</title>
        <meta name="description" content="Simple Boilerplate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {!account || disconnected ? (
          <button onClick={activate}>Connect</button>
        ) : (
          <div>
            <button onClick={disconnect}>Disconnect</button>
            <p>Connected Wallet: {account && account}</p>
            <p>
              Compact wallet address: {account && account.slice(0, 4)}...
              {account && account.slice(38, 42)}
            </p>
            <p>Network Id: {chainId && chainId}</p>
          </div>
        )}
      </main>
    </div>
  );
}
