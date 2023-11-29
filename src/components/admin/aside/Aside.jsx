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
  BsPeople,
} from "react-icons/bs";
import { Button, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import styles from "./Aside.module.css";
import routes from "../../../utils/dataAside";

const Aside = () => {
  const { pathname } = useLocation();
  const router = useNavigate();

  const routes = [
    {
      path: "/admin/dashboard",
      role: ["manager"],
      label: "Dashboard",
      icon: <BsBarChartLine />,
    },
    // {
    //   path: "/admin/dashboard/metrics",
    //   role: ["manager"],
    //   label: "Metricas del agente",
    //   icon: <BsClipboard2Pulse />,
    // },
    {
      path: "/admin/dashboard/chats",
      role: ["manager", "agent"],
      label: "Gestion de chats",
      icon: <BsChatLeftDots />,
    },
    {
      path: "/admin/dashboard/requests",
      role: ["manager"],
      label: "Solicitudes",
      icon: <BsFileText />,
    },
    {
      path: "/admin/dashboard/manager-users",
      role: ["manager"],
      label: "Gestionar Usuarios",
      icon: <BsPeople />,
    },
  ];

  const [linkSelected, setLinkSelected] = useState(pathname);
  const [collapse, setCollapse] = useState(false);
  const [broken, setBroken] = useState(false);
  const [toggled, setToggled] = useState(false);
  const { user, handleLogout, setUserAtom } = useAuth();
  const [validateRole, setValidateRole] = useState();

  const onClickLink = (path) => {
    setLinkSelected(path);
    // router(`/admin/dashboard/${path}`);
    router(path);
  };

  useEffect(() => {
    const user = localStorage.getItem("userData");
    if (user) {
      const userParse = JSON.parse(user);
      setValidateRole(userParse.user.role.name_role);
    }
  }, []);

  useEffect(() => {
    const collapseLocal = localStorage.getItem("collapse");

    if (collapseLocal) {
      setCollapse(JSON.parse(collapseLocal));
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    console.log(userData);
    if (userData) {
      const userParse = JSON.parse(userData);
      console.log(userParse);
      setUserAtom(userParse.user);
    }
  }, []);

  // console.log(user);
  return (
    <div className={styles.container_pr}>
      <Sidebar
        className={styles.sidebar}
        collapsed={collapse}
        onBreakPoint={setBroken}
        breakPoint="xl"
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        backgroundColor="#fff"
        width="300px"
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            className={styles.navbar_img}
            onClick={() => onClickLink("/admin/dashboard")}
          >
            {collapse ? (
              <img
                style={{
                  width: "3rem",
                  height: "5rem",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                src="/logo-sm.png"
                alt="logo"
              />
            ) : (
              <img
                style={{
                  width: "11rem",
                  height: "6rem",
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                src="/logo.png"
                alt="logo"
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Menu className={styles.sidebar_menu} closeOnClick={false}>
              {routes.map((route) => {
                const roleMatch = route.role.includes(validateRole);
                if (roleMatch) {
                  return (
                    <MenuItem
                      key={route.path}
                      active={linkSelected.includes(route.path)}
                      onClick={() => onClickLink(route.path)}
                      className={
                        linkSelected === route.path
                          ? styles.navbar_link_2_active
                          : styles.navbar_link_2
                      }
                      icon={route.icon}
                    >
                      {route.label}
                    </MenuItem>
                  );
                }
                return null;
              })}
            </Menu>
          </div>
          {collapse ? (
            <Button
              onClick={() => {
                setCollapse(false);
                localStorage.setItem("collapse", "false");
              }}
            >
              <BsArrowBarRight size={30} />
            </Button>
          ) : (
            <Button
              onClick={() => {
                setCollapse(true);
                localStorage.setItem("collapse", "true");
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
          <div className={styles.navbar_user}>
            <img src="/avatar.jpg" alt="avatar" />
            <div className={styles.navbar_user_data}>
              <h3>{user?.fullname}</h3>
              <span>{user?.email}</span>
            </div>

            <div
              className={styles.button_logout}
              onClick={() => {
                handleLogout();
                router("/admin/auth");
              }}
            >
              <IconButton aria-label="delete" size="large" color="error">
                <BsPower
                  className={styles.navbar_icon_power}
                  size={20}
                  cursor="pointer"
                />
              </IconButton>
            </div>
          </div>
        </div>
      </Sidebar>

      <IconButton
        style={{
          marginTop: "10px",
          marginLeft: "16px",
          position: "absolute",
          zIndex: 10,
          cursor: "pointer",
        }}
        onClick={() => {
          setToggled(!toggled);
          setCollapse(true);
        }}
      >
        {broken && <BsList className="" size={30} />}
      </IconButton>
    </div>
  );
};

export default Aside;
