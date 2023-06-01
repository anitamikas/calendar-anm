import React from "react";
import Calendar from "./components/Calendar";
import styles from "./page.module.scss";

export default async function App() {
  return (
    <div className={styles.app}>
      <Calendar />
    </div>
  );
}
