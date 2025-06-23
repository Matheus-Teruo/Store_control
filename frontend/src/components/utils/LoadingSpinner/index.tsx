import styles from "./LoadignSpinner.module.scss";

const LoadingSpinner = ({ children }: { children?: React.ReactNode }) => {
  return (
    <span className={styles.background}>
      <div className={styles.icon} />
      {children && children}
    </span>
  );
};

export default LoadingSpinner;
