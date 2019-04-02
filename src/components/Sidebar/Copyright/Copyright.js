import React from 'react';
import styles from './Copyright.module.scss';

const Copyright = ({ copyright }) => (
  <div
    className={styles['copyright']}
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
  >
    <div style={{ marginRight: 10 }}>{copyright}</div>
    <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
      CC BY-NC-SA 4.0
    </a>
  </div>
);

export default Copyright;
