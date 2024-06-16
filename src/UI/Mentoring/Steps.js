import styles from "./Steps.module.css";
const Steps = () => {
  return (
    <div className={styles.container}>
      <div className={styles.step}>
        <h4>Mentor Selection</h4>
        <i className="fa-solid fa-chalkboard-user"></i>
        <div className={styles.expl}>
          Identify and invite knowledgeable mentors with expertise in various
          aspects of the crypto industry to join the program.
        </div>
      </div>
      <div className={styles.step}>
        <h4>Browse Mentor Profiles</h4>
        <i class="fa-solid fa-lock-open"></i>
        <div className={styles.expl}>
          Users are given the opportunity to explore mentor profiles and
          expertise to find the right match for their crypto needs.
        </div>
      </div>
      <div className={styles.step}>
        <h4>Facilitate Mentorship Sessions</h4>
        <i class="fa-solid fa-arrow-pointer"></i>
        <div className={styles.expl}>
          We provide a user-friendly booking system for users to schedule
          mentorship sessions with their chosen mentors.
        </div>
      </div>

      <div className={styles.step}>
        <h4>Collect User Feedback</h4>
        <i class="fa-solid fa-comment"></i>
        <div className={styles.expl}>
          We gather user feedback after mentorship sessions ensure a valuable
          experience for all users.
        </div>
      </div>
    </div>
  );
};
export default Steps;
