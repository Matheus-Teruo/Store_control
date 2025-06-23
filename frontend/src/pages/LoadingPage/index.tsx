import styles from "./LoadingPage.module.scss";

function LoadingPage() {
  return (
    <div className={styles.container}>
      <h3>Carregando...</h3>
      <div className={styles.loading} />
    </div>
  );
}

export default LoadingPage;
