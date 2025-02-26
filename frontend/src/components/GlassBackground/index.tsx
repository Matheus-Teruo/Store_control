import styles from "./GlassBackground.module.scss";

function GlassBackground({ onClick }: { onClick: () => void }) {
  return <div className={styles.background} onClick={onClick} />;
}

export default GlassBackground;
