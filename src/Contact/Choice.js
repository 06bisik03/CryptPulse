import styles from "./Choice.module.css";

const copy = {
  technical: { eyebrow: "Technical support", title: "Tell us what happened", topic: "Issue summary", message: "Steps, expected result, and what you saw" },
  feedback: { eyebrow: "Product feedback", title: "Help shape CryptPulse", topic: "Area of the product", message: "Your suggestion or feedback" },
  general: { eyebrow: "Member inquiry", title: "Ask us anything", topic: "Question topic", message: "How can our team help?" },
};

const Choice = ({ mode = "general", onCancel, submitHandler }) => {
  const content = copy[mode] || copy.general;
  return (
    <main className={styles.main}>
      <div className={styles.intro}><span>{content.eyebrow}</span><h1>{content.title}</h1><p>Include enough context for the support team to respond without another round of questions.</p></div>
      <form className={styles.form} onSubmit={submitHandler}>
        <label><span>{content.topic}</span><input required placeholder="A short, specific title" /></label>
        <label><span>{content.message}</span><textarea required rows="8" placeholder="Write your message here…" /></label>
        <label><span>Priority</span><select defaultValue="standard"><option value="standard">Standard</option><option value="important">Important</option><option value="urgent">Urgent / access blocked</option></select></label>
        <div className={styles.actions}><button type="button" onClick={onCancel}>Back</button><button type="submit">Send request <span>↗</span></button></div>
      </form>
    </main>
  );
};

export default Choice;
