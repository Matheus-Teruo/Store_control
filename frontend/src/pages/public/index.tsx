import styles from "./Public.module.scss";
import Home from "./Home";
import About from "./About";

const Public = () => {
  return (
    <div className={styles.background}>
      <Home />
      <About />
    </div>
  );
};

export default Public;
