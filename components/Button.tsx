import styles from "@styles/Home.module.css";

type TProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = (props: TProps) => {
  return (
    <button {...props} className={`${styles.button} ${props.className}`} />
  );
};

export default Button;
