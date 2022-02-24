import styles from "@styles/Home.module.css";

type TProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const Textbox = (props: TProps) => {
  return <textarea {...props} className={styles.textarea} />;
};

export default Textbox;
