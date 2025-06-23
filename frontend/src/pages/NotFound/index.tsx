import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1>404</h1>
      <p>Oops! A página que você está procurando não existe.</p>
      <Link to="/" className={styles.homeLink}>
        Voltar para a Home
      </Link>
    </div>
  );
};

export default NotFound;
