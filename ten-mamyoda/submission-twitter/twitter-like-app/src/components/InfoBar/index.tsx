import { Link } from 'react-router-dom';
import topPicture from '../../assets/topPicture.png';
import styles from './InfoBar.module.css';
import { ROUTES } from '../../constants';

type InfoBarProps = {
  headline: string;
  description: React.ReactNode;
};

export function InfoBar({ headline, description }: InfoBarProps) {
  return (
    <div className={styles.infoBar}>
      <header className={styles.header}>
        <div className={styles.title}>
          <Link to={ROUTES.HOME}>
            <img src={topPicture} className={styles.titleImg} alt="titleImage" />
            <h1 className={styles.titleContent}>Black Box</h1>
          </Link>
        </div>
      </header>
      <div className={styles.contents}>
        <h2 className={styles.information}>
          {headline}
        </h2>
        <p className={styles.description}>
          {description}
        </p>
      </div>
      <footer className={styles.footer}>
        <p className={styles.footerContent}>© こぴーらいと</p>
      </footer>
    </div>
  );
}
