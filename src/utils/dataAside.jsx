import {
  BsBarChartLine,
  BsChatLeftDots,
  BsFileText,
  BsPeople,
} from "react-icons/bs";

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

export default routes;
