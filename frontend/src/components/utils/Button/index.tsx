import styles from "./Button.module.scss";
import { ButtonHTMLType } from "./ButtonHTMLType";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLType;
  className?: string;
}

function Button({
  children,
  onClick,
  type = ButtonHTMLType.Button,
  className,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
