import { Link } from "react-router-dom";
import Navbar from "../UI/Navbar";
import styles from "./Mentoring.module.css";

const modules = [
  ["01", "Market structure", "Understand liquidity, trend, regime shifts and why price moves before adding indicators."],
  ["02", "Risk architecture", "Build position sizing, invalidation and drawdown rules that survive volatile markets."],
  ["03", "Execution discipline", "Turn a market thesis into a repeatable plan with entries, exits and review."],
];

const Mentoring = () => (
  <div className={styles.page}>
    <Navbar />
    <main>
      <section className={styles.hero}>
        <div className={styles.heroCopy}><span>CryptPulse intelligence</span><h1>Trade less.<br /><em>Understand more.</em></h1><p>A structured learning environment for people who want a defensible process, not another stream of market predictions.</p><Link to="/mentoringsystems">Explore the program <span>↗</span></Link></div>
        <div className={styles.signalMap} aria-hidden="true"><span>THESIS</span><span>RISK</span><span>EXECUTION</span><i /><i /><i /></div>
      </section>

      <section className={styles.modules}>
        <header><span>The framework</span><h2>From information<br />to judgment.</h2></header>
        <div className={styles.moduleGrid}>{modules.map(([number,title,body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className={styles.method}>
        <div><span>Built for practice</span><h2>Research. Rehearse. Review.</h2></div>
        <p>Each module pairs concise theory with real market scenarios and a decision journal. The objective is not certainty. It is a process that stays coherent when the market does not.</p>
        <Link to="/mentoringsystems">View curriculum →</Link>
      </section>
    </main>
  </div>
);

export default Mentoring;
