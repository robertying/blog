import React from 'react';
import styles from './Copyright.module.scss';

const Copyright = ({ copyright }) => (
  <div
    className={styles['copyright']}
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
  >
    <div style={{ marginRight: 10 }}>{copyright}</div>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
      <img
        alt="Creative Commons License"
        src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png"
      />
    </a>
  </div>
);

export default Copyright;
