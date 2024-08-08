import React, { FC } from 'react';
import styles from '../../App.module.css';

const Loader: FC = () => (
  <div className={styles.loader}>
    <h1>Loading...</h1>
  </div>
);

export default Loader;
