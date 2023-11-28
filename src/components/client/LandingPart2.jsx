import React from "react";
import styles from "../../pages/main/Home.module.css";

const LandingPart2 = ({ activePage }) => {
  return (
    <section className={activePage === 2 ? styles.active : ""}>
      <img
        className={styles.fondo2}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698346151/exe%20digital/hy7fpughyyqvflxmzz96.jpg"
        alt="fondo2"
      />

      <img
        className={styles.branding}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348441/exe%20digital/tudykqggm5nqfqgsuttr.png"
        alt="branding"
      />
      <img
        className={styles.campañas}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348443/exe%20digital/nwetcptylam5itcmovo9.png"
        alt="campañas"
      />
      <img
        className={styles.sistemas}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348444/exe%20digital/srfs6r308v98wgac61dl.png"
        alt="sistemas"
      />
      <img
        className={styles.ecommerce}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348450/exe%20digital/vuyxw4qbly9hxylzzyv4.png"
        alt="ecommerce"
      />
      <img
        className={styles.produccion}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348448/exe%20digital/zuwklkiockl9qr63leyj.png"
        alt="produccion"
      />
      <img
        className={styles.sitioweb}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348447/exe%20digital/w4canhfdj0bwvmjneugj.png"
        alt="sitioweb"
      />
      <img
        className={styles.social}
        src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348446/exe%20digital/l6hvnfktlfjh2e2faxpd.png"
        alt="social"
      />
      <p className={styles.text1}>LO QUE</p>
      <p className={styles.text2}>HACEMOS</p>
      <p className={styles.text3}>PERÚ • ECUADOR • MÉXICO</p>
    </section>
  );
};

export default LandingPart2;
