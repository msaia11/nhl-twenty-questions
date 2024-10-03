import React from "react";

import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.text}>
        <p>
          Chel Guesser &copy; 2024
        </p>
      </div>
    </footer>
  )
}