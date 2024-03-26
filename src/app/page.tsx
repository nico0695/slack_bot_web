import React from 'react';
import { FaArrowDown } from 'react-icons/fa';

import styles from './home.module.scss';
import Section1 from './component/Section1/Section1';
import Section2 from './component/Section2/Section2';
import Header from '@components/Header/Header';

const HomePage = () => {
  return (
    <div>
      <header className={styles.mainSection}>
        <div
          style={{
            position: 'absolute',
            top: 0,
          }}
        >
          <Header />
        </div>

        <h1>Home Page</h1>
        <p>This is the home page</p>

        <a href="#section1" className={styles.navigateButton}>
          <FaArrowDown size={24} />
        </a>
      </header>

      <section id="section1" className={`${styles.mainSection} secondary`}>
        <Section1 />

        {/* scroll button */}
        <a href="#section2" className={styles.navigateButton}>
          <FaArrowDown size={24} />
        </a>
      </section>

      <section id="section2" className={`${styles.mainSection} tertiary`}>
        <Section2 />
      </section>

      <section id="separator" className={styles.sectionSeparator}>
        <h4>SEPARATOR</h4>
      </section>

      <section className={`${styles.mainSection} secondary`}>
        <h2>Section 3</h2>
        <p>Section 3 content</p>
      </section>

      <section className={`${styles.mainSection} tertiary`}>
        <h2>Section 4</h2>
        <p>Section 4 content</p>
      </section>
    </div>
  );
};

export default HomePage;
