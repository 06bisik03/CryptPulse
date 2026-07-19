import { Link } from "react-router-dom";
import Navbar from "../UI/Navbar";
import styles from "./MentoringSystems.module.css";

const curriculum = ["Market regimes and liquidity", "Narrative versus price", "Position sizing and invalidation", "Execution plans and trade review", "Portfolio construction", "Building a personal playbook"];

const MentoringSystems = () => (
  <div className={styles.page}>
    <Navbar />
    <main className={styles.main}>
      <header><span>Intelligence program / 01</span><h1>A six-part operating system for crypto markets.</h1><p>Self-directed modules, scenario reviews, and a practical journal designed to sharpen process rather than promise outcomes.</p></header>
      <section className={styles.curriculum}>{curriculum.map((item,index) => <div key={item}><span>0{index+1}</span><strong>{item}</strong><small>{index < 2 ? "Foundation" : index < 4 ? "Practice" : "Integration"}</small></div>)}</section>
      <section className={styles.enroll}><div><span>Next cohort</span><h2>Build a process you can defend.</h2></div><p>Program access is being prepared. Contact the CryptPulse team to register your interest and receive curriculum updates.</p><Link to="/contact">Contact support <span>↗</span></Link></section>
    </main>
  </div>
);

export default MentoringSystems;
