/*
 * @Author: lixiang 
 * @Date: 2018-05-13 15:15:32 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-13 21:03:29
 */

import React from 'react';
import styles from './HomePage.css';

function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yo!欢迎来到麦谷后台管理系统</h1>
      <div className={styles.welcome} />
      {/* <ul className={styles.list}>
        <li>To organizate your system</li>
      </ul> */}
    </div>
  );
}

IndexPage.propTypes = {
};

export default IndexPage;
