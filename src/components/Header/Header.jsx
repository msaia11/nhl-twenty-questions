import React from "react";

import styles from "./Header.module.css";
import { getImageUrl } from "../../utils";


export const Header = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Chel Guesser
        </h1>
        <p className={styles.description}>
          See how many hints you need to guess the NHL Player
        </p>
      </div>
      <img src={getImageUrl("header/mainLogo.png")} alt="Logo" className={styles.mainLogo}/>
    </section>
  )
}