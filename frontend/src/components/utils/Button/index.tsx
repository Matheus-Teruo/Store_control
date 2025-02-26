import styles from "./Button.module.scss";
import { ButtonHTMLType } from "./ButtonHTMLType";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: ButtonHTMLType;
  className?: string;
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  type = ButtonHTMLType.Button,
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
