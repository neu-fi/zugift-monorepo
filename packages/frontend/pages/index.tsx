/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../assets/logo.png";
import nft from "../assets/nft.svg";
import pass from "../assets/pass.png";
import { useAccount } from "wagmi";
import { useState } from "react";
import mintNft from "../hooks/useMint";
import GiftModal from "../components/GiftModal";

const Home: NextPage = () => {
  const [isMinted, setIsMinted] = useState(true);
  const { status, address } = useAccount();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        {status == "connected" ? <ConnectButton showBalance={false} /> : null}
      </div>

      <main className={styles.main}>
        <h1 className={styles.passport}>ENSbound Zugift NFTs</h1>
        <img src={logo.src} alt="logo" className={styles.logo} />
        <p className={styles.zuzalu}>Funding Zuzalu through creating an endorsement network</p>
        {status != "connected" ? <ConnectButton showBalance={false} /> : null}
        {status == "connected" ? (
          <>
            {isMinted ? (
              <div className={styles.area}>
                <div className={styles.passItem}>
                  <img src={pass.src} alt="nftImg" className={styles.nft} />
                  <p className={styles.passname}>Abdurrahman Louisana Wings</p>
                  <button onClick={() => setOpenModal(true)} className={styles.giftBtn}>
                    Gift
                  </button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
                <div className={styles.item}>
                  <img src={nft.src} alt="nftImg" className={styles.nft} />
                  <button className={styles.giftBtn}>Gift</button>
                </div>
              </div>
            ) : (
              <>
                <input type="text" className={styles.input} placeholder="Name" />
                <button className={styles.button}>Mint a Zupass</button>
              </>
            )}
          </>
        ) : null}
      </main>
      {openModal ? <GiftModal closeModal={() => setOpenModal(false)} /> : null}
    </div>
  );
};

export default Home;
