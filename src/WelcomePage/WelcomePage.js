import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./WelcomePage.module.css";
import Navbar from "../UI/Navbar";
import CryptoChart from "../UI/Exchange/CryptoChart";
import AuthContext from "../Store/user-ctx";
import { fetcherGeneral, fetcherGlobal } from "../redux/Api";
import { formatCompact, formatCurrency, formatPercent } from "../utils/market";

const WelcomePage = () => {
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const coins = useSelector((state) => state.api.generalCoins);
  const global = useSelector((state) => state.api.globalData?.data);
  const featured = coins.slice(0, 3);

  useEffect(() => {
    dispatch(fetcherGeneral());
    dispatch(fetcherGlobal());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={styles.ambient} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span /> Institutional-grade digital markets
            </div>
            <h1>Move at the speed of <em>signal.</em></h1>
            <p>
              A quieter, sharper way to read digital markets, deploy capital,
              and keep your entire crypto portfolio in one considered space.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} to={auth.isLoggedIn ? "/exchange" : "/profile"}>
                {auth.isLoggedIn ? "Open markets" : "Create your account"}
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className={styles.secondaryAction} to="/exchange/showroom">
                Explore the market
              </Link>
            </div>
            <div className={styles.trustLine}>
              <span><strong>24/7</strong> global access</span>
              <span><strong>50+</strong> tracked assets</span>
              <span><strong>Live</strong> price intelligence</span>
            </div>
          </div>

          <div className={styles.terminal}>
            <div className={styles.terminalTop}>
              <div>
                <span className={styles.microLabel}>Market pulse</span>
                <strong>Global overview</strong>
              </div>
              <span className={styles.live}><i /> Live</span>
            </div>

            <div className={styles.heroQuote}>
              <span>Market capitalization</span>
              <strong>{formatCurrency(global?.total_market_cap?.usd, { compact: true })}</strong>
              <small className={global?.market_cap_change_percentage_24h_usd >= 0 ? styles.positive : styles.negative}>
                {formatPercent(global?.market_cap_change_percentage_24h_usd)} today
              </small>
            </div>

            <div className={styles.terminalGrid} aria-hidden="true" />
            <div className={styles.orbit} aria-hidden="true">
              <span /><span /><span />
            </div>

            <div className={styles.assetStack}>
              {featured.map((coin, index) => (
                <Link
                  to={`/exchange/coin=${coin.id}+${coin.name}`}
                  className={styles.assetRow}
                  key={coin.id}
                  style={{ "--delay": `${0.18 + index * 0.09}s` }}
                >
                  <div className={styles.assetIdentity}>
                    <span className={styles.coinMark} style={{ "--coin": coin.accent }}>
                      {coin.symbol.slice(0, 1).toUpperCase()}
                    </span>
                    <span><strong>{coin.symbol.toUpperCase()}</strong><small>{coin.name}</small></span>
                  </div>
                  <div className={styles.assetChart}>
                    <CryptoChart
                      data={coin.sparkline_in_7d?.price}
                      displacement={coin.price_change_percentage_24h < 0}
                      size={{ widthS: 220, heightS: 56, heightT: 38 }}
                    />
                  </div>
                  <div className={styles.assetPrice}>
                    <strong>{formatCurrency(coin.current_price)}</strong>
                    <small className={coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}>
                      {formatPercent(coin.price_change_percentage_24h)}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.marketRibbon}>
          <div><span>Total volume</span><strong>{formatCurrency(global?.total_volume?.usd, { compact: true })}</strong></div>
          <div><span>BTC dominance</span><strong>{global?.market_cap_percentage?.btc?.toFixed(1) || "54.8"}%</strong></div>
          <div><span>Active assets</span><strong>{formatCompact(global?.active_cryptocurrencies || 17240)}</strong></div>
          <div><span>Tracked venues</span><strong>{formatCompact(global?.markets || 1124)}</strong></div>
        </section>

        <section className={styles.principles}>
          <div className={styles.sectionIntro}>
            <span>One operating system</span>
            <h2>Everything essential.<br />Nothing ornamental.</h2>
          </div>
          <div className={styles.principleGrid}>
            <article>
              <span>01 / Clarity</span>
              <h3>Read the market without the noise.</h3>
              <p>High-contrast pricing, momentum, liquidity and market structure organized for immediate decisions.</p>
            </article>
            <article>
              <span>02 / Control</span>
              <h3>Capital and positions in one view.</h3>
              <p>Track wallet balance, entry price, exposure and transaction history across a unified portfolio surface.</p>
            </article>
            <article>
              <span>03 / Continuity</span>
              <h3>Designed to remain available.</h3>
              <p>Cached market snapshots and guarded data states keep your workspace usable when upstream services slow down.</p>
            </article>
          </div>
        </section>

        <section className={styles.cta}>
          <span className={styles.ctaLabel}>The market never pauses</span>
          <h2>Neither should your perspective.</h2>
          <Link to="/exchange">Enter CryptPulse <span>→</span></Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>CRYPTPULSE / 2026</span>
        <span>Digital assets involve risk. Trade with discipline.</span>
      </footer>
    </div>
  );
};

export default WelcomePage;
