import React from "react";
import styles from "../../pages/main/Home.module.css";

const LandingPart3 = ({ activePage }) => {
  return (
    <section className={activePage === 3 ? styles.active : ""}>
      <img
        className={styles.fondo2}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698346151/exe%20digital/hy7fpughyyqvflxmzz96.jpg"
        alt="fondo2"
      />
      <img
        className={styles.farmacia}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382655/exe%20digital/wwlwcemxdvjwhlvjpz8q.png"
        alt="farmacia"
      />
      <img
        className={styles.kativa}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382660/exe%20digital/hv7rg0ko2iamyyzimvfs.png"
        alt="kativa"
      />
      <img
        className={styles.ucv}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382663/exe%20digital/pb5cuelsqa4z73ozgnt2.png"
        alt="ucv"
      />
      <img
        className={styles.ekono}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382721/exe%20digital/gk8imgmtblvqy799fooz.png"
        alt="ekono"
      />
      <img
        className={styles.olva}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698393748/exe%20digital/avmmttjhg69xxjujmps7.png"
        alt="olva"
      />
      <img
        className={styles.universidad}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382669/exe%20digital/kdyglsrb0ciihg652oga.png"
        alt="universidad"
      />
      <img
        className={styles.fos}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382671/exe%20digital/gwgnmrhpcfq38axmjrtz.png"
        alt="fos"
      />
      <img
        className={styles.bengala}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382673/exe%20digital/b6o6zksnlvpvhleigfzk.png"
        alt="bengala"
      />
      <img
        className={styles.opcion}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382675/exe%20digital/tk0dcc0m6l1vbqgczz0l.png"
        alt="opcion"
      />
      <img
        className={styles.b}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382677/exe%20digital/yuzxkf0w5fpjnadpfd2r.png"
        alt="b"
      />
      <p className={styles.text5}>MARCAS QUE</p>
      <p className={styles.text6}>CONFÍAN EN NOSOTROS</p>
      <p className={styles.text4}>PERÚ • ECUADOR • MÉXICO</p>
    </section>
  );
};

export default LandingPart3;
