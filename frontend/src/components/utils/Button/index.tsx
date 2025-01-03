import styles from "./Button.module.scss";
import { ButtonHTMLType } from "./ButtonHTMLType";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLType;
}

function Button({
  children,
  onClick,
  type = ButtonHTMLType.Button,
}: ButtonProps) {
  return (
    <button className={styles.button} type={type} onClick={onClick}>
      <p>{children}</p>
    </button>
  );
}

export default Button;
