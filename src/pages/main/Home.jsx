import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {

  const [activePage, setActivePage] = useState(1);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollPosition < windowHeight) {
      setActivePage(1);
    } else if (scrollPosition < windowHeight * 2) {
      setActivePage(2);
    } else {
      setActivePage(3);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.container}>
      <section className={activePage === 1 ? styles.active : ""}>
      <img className={styles.fondo1} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698270354/exe%20digital/vmmpglnqkjmof2bcqbz8.jpg" alt="fondo1" />
      <img className={styles.logo} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698270673/exe%20digital/uubwmilnxnlahvgj6ufl.png" alt="logo" />
      <img className={styles.bot} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698271161/exe%20digital/bkncyocxtsg3oeywvrjr.png" alt="bot" />
      </section>
      <section className={activePage === 2 ? styles.active : ""}>
        <img className={styles.fondo2} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698346151/exe%20digital/hy7fpughyyqvflxmzz96.jpg" alt="fondo2" />
        <img className={styles.branding} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348441/exe%20digital/tudykqggm5nqfqgsuttr.png" alt="branding" />
        <img className={styles.campañas} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348443/exe%20digital/nwetcptylam5itcmovo9.png" alt="campañas" />
        <img className={styles.sistemas} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348444/exe%20digital/srfs6r308v98wgac61dl.png" alt="sistemas" />
        <img className={styles.ecommerce} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348450/exe%20digital/vuyxw4qbly9hxylzzyv4.png" alt="ecommerce" />
        <img className={styles.produccion} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348448/exe%20digital/zuwklkiockl9qr63leyj.png" alt="produccion" />
        <img className={styles.sitioweb} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348447/exe%20digital/w4canhfdj0bwvmjneugj.png" alt="sitioweb" />
        <img className={styles.social} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698348446/exe%20digital/l6hvnfktlfjh2e2faxpd.png" alt="social" />
        <p className={styles.text1} >LO QUE</p>
        <p className={styles.text2} >HACEMOS</p>
        <p className={styles.text3} >PERÚ • ECUADOR • MÉXICO</p>
      </section>
      <section className={activePage === 3 ? styles.active : ""}>
        <img className={styles.fondo2} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698346151/exe%20digital/hy7fpughyyqvflxmzz96.jpg" alt="fondo2" />
        <img className={styles.farmacia} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382655/exe%20digital/wwlwcemxdvjwhlvjpz8q.png" alt="farmacia" />
        <img className={styles.kativa} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382660/exe%20digital/hv7rg0ko2iamyyzimvfs.png" alt="kativa" />
        <img className={styles.ucv} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382663/exe%20digital/pb5cuelsqa4z73ozgnt2.png" alt="ucv" />
        <img className={styles.ekono} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382721/exe%20digital/gk8imgmtblvqy799fooz.png" alt="ekono" />
        <img className={styles.olva} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698393748/exe%20digital/avmmttjhg69xxjujmps7.png" alt="olva" />
        <img className={styles.universidad} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382669/exe%20digital/kdyglsrb0ciihg652oga.png" alt="universidad" />
        <img className={styles.fos} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382671/exe%20digital/gwgnmrhpcfq38axmjrtz.png" alt="fos" />
        <img className={styles.bengala} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382673/exe%20digital/b6o6zksnlvpvhleigfzk.png" alt="bengala" />
        <img className={styles.opcion} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382675/exe%20digital/tk0dcc0m6l1vbqgczz0l.png" alt="opcion" />
        <img className={styles.b} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698382677/exe%20digital/yuzxkf0w5fpjnadpfd2r.png" alt="b" />
        <p className={styles.text5} >MARCAS QUE</p>
        <p className={styles.text6} >CONFÍAN EN NOSOTROS</p>
        <p className={styles.text4} >PERÚ • ECUADOR • MÉXICO</p>
      </section>

      <div class={styles.chatbot}>
        <header>
          <img className={styles.minibot} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1698271161/exe%20digital/bkncyocxtsg3oeywvrjr.png"/>
          <div className={styles.h2s}>
          <h2>Exe Digital</h2>
          <h2>Exe@digital.exe</h2>
          </div>
        </header>
        <ul className={styles.chatbox}>
        <li className={styles.chatincoming}>
          <img className={styles.minibot2} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699065957/exe%20digital/unbrk0uzq1pdvwysiqpg.png"/>
          <p className={styles.texto}>Hi, is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been . Ihe</p>
        </li>
        <li className={styles.chatoutgoing}>
          <p>Preventa</p>
          <p>Emisión y reembolso</p>
          <p>Consulta de servicios</p>
          <p>Precio preventa</p>
          <p>Otras consultas</p>
        </li>
        <div className={styles.area}>
        <hr className={styles.linea} />
        <img className={styles.barras} src="https://res.cloudinary.com/dtl1lhb4j/image/upload/v1699070715/exe%20digital/fyczge5dyxnvxsbz6xyb.png"/>
        </div>
        </ul>
        
      </div>
    </div>

  );

}

export default Home;
