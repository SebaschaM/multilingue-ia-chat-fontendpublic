import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  BsPower,
  BsBarChartLine,
  BsChatLeftDots,
  BsClipboard2Pulse,
  BsFileText,
  BsList,
  BsArrowBarRight,
  BsArrowBarLeft,
} from "react-icons/bs";

import styles from "./Aside.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function Aside() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [linkSelected, setLinkSelected] = useState(pathname);
  const [collapse, setCollapse] = useState(false);
  const [broken, setBroken] = useState(false);
  const [toggled, setToggled] = useState(false);

  const onClickLink = (path) => {
    setLinkSelected(path);
    navigate(`/exe-digital/${path}`);
  };

  useEffect(() => {
    const collapseLocal = localStorage.getItem("collapse");

    if (collapseLocal) {
      setCollapse(JSON.parse(collapseLocal));
    }
  }, []);

  return (
    <div className={styles.container_pr}>
      <Sidebar
        className={styles.sidebar}
        collapsed={collapse}
        onBreakPoint={setBroken}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            className={styles.navbar_img}
            onClick={() => onClickLink("dashboard")}
          >
            <Link to="/exe-digital/dashboard">
              {collapse ? (
                <img
                  style={{
                    width: "100%",
                    height: "80%",
                    objectFit: "contain",
                  }}
                  src="/src/assets/logo-sm.png"
                  alt="logo"
                />
              ) : (
                <img src="/src/assets/logo.png" alt="logo" />
              )}
            </Link>
          </div>
          <div style={{ flex: 1 }}>
            <Menu className={styles.sidebar_menu} closeOnClick={false}>
              <MenuItem
                active={linkSelected.includes("dashboard")}
                component={<Link to="/exe-digital/dashboard" />}
                onClick={() => onClickLink("dashboard")}
                className={
                  linkSelected.includes("dashboard")
                    ? styles.navbar_link_2_active
                    : styles.navbar_link_2
                }
                icon={<BsBarChartLine />}
              >
                Dashboard
              </MenuItem>

              <MenuItem
                active={linkSelected.includes("metrics")}
                // component={<Link to="/exe-digital/metrics" />}
                onClick={() => onClickLink("metrics")}
                className={
                  linkSelected.includes("metrics")
                    ? styles.navbar_link_2_active
                    : styles.navbar_link_2
                }
                icon={<BsClipboard2Pulse />}
              >
                Metricas del agente
              </MenuItem>

              <MenuItem
                active={linkSelected.includes("chats")}
                // component={<Link to="/exe-digital/chats" />}
                onClick={() => onClickLink("chats")}
                className={
                  linkSelected.includes("chats")
                    ? styles.navbar_link_2_active
                    : styles.navbar_link_2
                }
                icon={<BsChatLeftDots />}
              >
                Gestion de chats
              </MenuItem>

              <MenuItem
                active={linkSelected.includes("requests")}
                // component={<Link to="/exe-digital/requests" />}
                onClick={() => onClickLink("requests")}
                className={
                  linkSelected.includes("requests")
                    ? styles.navbar_link_2_active
                    : styles.navbar_link_2
                }
                icon={<BsFileText />}
              >
                Solicitudes
              </MenuItem>

              {/* <SubMenu
              className={styles.navbar_link_2}
              label="Operaciones"
              icon={<BsSliders />}
            >
              <MenuItem
                className={styles.navbar_link_2}
                icon={<BsPersonWorkspace />}
              >
                Unidades de servicio
              </MenuItem>
            </SubMenu> */}
            </Menu>
          </div>
          {collapse ? (
            <Button
              onClick={() => {
                setCollapse(false);
                localStorage.setItem("collapse", false);
              }}
            >
              <BsArrowBarRight size={30} />
            </Button>
          ) : (
            <Button
              onClick={() => {
                setCollapse(true);
                localStorage.setItem("collapse", true);
              }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <BsArrowBarLeft size={30} />
              Colapsar
            </Button>
          )}
          {/* <Button>Colapsar</Button> */}
          <div className={styles.navbar_user}>
            <img src="/src/assets/avatar.jpg" alt="avatar" />
            <div className={styles.navbar_user_data}>
              <h3>Sebastian</h3>
              <span>sebas@gmail.com</span>
            </div>
            <Link to="/">
              <BsPower
                className={styles.navbar_icon_power}
                size={20}
                cursor="pointer"
              />
            </Link>
          </div>
        </div>
      </Sidebar>

      <div
        style={{
          marginTop: "10px",
          marginLeft: "16px",
          position: "absolute",
          zIndex: 10,
        }}
      >
        {broken && (
          <BsList
            className=""
            size={30}
            onClick={() => {
              setToggled(!toggled);
              setCollapse(true);
            }}
          />
          // <button className="sb-button" >
          // </button>
        )}
      </div>
    </div>
  );
}
