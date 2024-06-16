import Navbar from "../UI/Navbar";
import styles from "./MentoringSystems.module.css";
const MentoringSystems = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.welcome}>
        <h1>Welcome to CryptoPulse Mentoring Systems!</h1>
      </div>
    </div>
  );
};
export default MentoringSystems;
