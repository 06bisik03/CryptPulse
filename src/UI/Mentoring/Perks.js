import styles from "./Perks.module.css";
const Perks = () => {
  return (
    <div className={styles.leftGrid}>
      <div className={styles.perksContainer}>
        <div className={styles.perk}>
          <h2>Personalized Expertise</h2>
          <div>
            Having mentors to guide users provides them with personalized
            expertise and insights tailored to their specific needs and goals.
            Mentors can offer individualized advice, address unique challenges,
            and help users build a trading or investment strategy that aligns
            with their risk tolerance and financial objectives.
          </div>
        </div>
        <div className={styles.perk}>
          <h2>Reduced Learning Curve</h2>
          <div>
            Okay Okay, we get it. Cryptocurrency markets can be complex and
            rapidly changing. However, mentors can help users navigate this
            intricate landscape and shorten their learning curve. By learning
            from experienced mentors, users can avoid common pitfalls, make more
            informed decisions, and accelerate their understanding of crypto
            trading and investment principles.
          </div>
        </div>
        <div className={styles.perk}>
          <h2>Confidence and Emotional Support</h2>
          <div>
            Crypto markets can be volatile, leading to uncertainty and emotional
            challenges for traders and investors. Mentors provide not only
            technical knowledge but also emotional support and
            confidence-building. They can help users stay grounded during market
            fluctuations, make rational choices, and maintain a disciplined
            approach to crypto trading.
          </div>
        </div>
        <div className={styles.perk}>
          <h2>Real-Time Market Insights</h2>
          <div>
            Mentors, especially those with expertise in the crypto industry,
            stay updated with the latest market trends, news, and developments.
            They can provide users with real-time insights and analysis, helping
            them stay ahead of market movements and make timely decisions. This
            access to up-to-date information can be invaluable in a fast-paced
            and ever-changing crypto market. With mentors' guidance, users can
            gain a better understanding of market dynamics and position
            themselves strategically for potential opportunities.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perks;
