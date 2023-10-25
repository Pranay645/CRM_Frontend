import React from "react";
import Divider from "@mui/material/Divider";

import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme, Avatar, Tooltip } from "@mui/material/";
import List from "@mui/material/List";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
// @ts-ignore
import logoImage from "./../components/solar-logo.png";
import Cookies from "js-cookie";
import { AuthContext } from "./../contexts/AuthContext";
import './../components/sidebar.css'
const drawerWidth = 240;

const Array1 = [
  { text: "Home", icon: <HomeOutlinedIcon />, path: "/app" },
  {
    text: "Create New Job",
    icon: <EngineeringOutlinedIcon />,
    path: "salesman/StepWizard",
  },

  {
    text: "Customers List",
    icon: <ContactsOutlinedIcon />,
    path: "salesman/customer",
  },
  
];

const Array2 = [
  { text: "Kanban", icon: <ViewKanbanOutlinedIcon />, path: "salesman/kanban" },
  {
    text: "Calendar",
    icon: <CalendarMonthOutlinedIcon />,
    path: "salesman/calendar",
  },
  
  { text: "Logout", icon: <LogoutIcon />, path: "/" },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
  // @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const SideBar = ({ open, handleDrawerClose }) => {
  const {userRole} =React.useContext(AuthContext);
  const[loading,setLoading]=React.useState(true)
  const [hoveredIcon, setHoveredIcon] = React.useState(null);
  React.useEffect(()=>{
    // console.log("SIde bar loaded")
    const role=Cookies.get("userRole")
    // console.log("UserRole :"+role)
  if(role=='admin'){
    Array1.push({
      text: "Manage Users",
      icon: <ManageAccountsOutlinedIcon />,
      path: "salesman/users",
    })
    Array2.unshift({
      text: "Add User",
      icon: <PersonAddAltOutlinedIcon />,
      path: "salesman/form",
    })
    setLoading(false)
  } else if(role=='installer'){
    Array1.pop();
    Array1.pop()
    setLoading(false)
  }
  return ()=>{
    if(role=='admin'){
      Array1.pop();
      Array2.shift()
      setLoading(false)
    }else if(role=='installer'){
      Array1.push({
        text: "Customers List",
        icon: <ContactsOutlinedIcon />,
        path: "salesman/customer",
      })
      Array1.push({
        text: "Create New Job",
        icon: <EngineeringOutlinedIcon />,
        path: "salesman/StepWizard",
      })
      setLoading(false)
    }
  }
},[loading])
  //*Role based rendering
  //TODO Add protection to routes also
   

  let location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  return (
<Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoImage}
              alt="Solar CRM Logo"
              style={{ width: 35, height: 35, marginLeft: 5 }}
            />
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Lato, sans-serif",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#03a9f4",
                fontSize: "1.0rem",
                marginTop: "5px",
                marginLeft: 1,
                fontWeight: "bold",
              }}
            >
              TRUE HOT WATER
            </Typography>
          </div>
        </div>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />

      <List>
        {Array1.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onMouseEnter={() => setHoveredIcon(item.path)}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => {
                 
                  navigate(item.path);
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  position: 'relative',
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                {hoveredIcon === item.path && (
                  <div className="hovered-icon-border"></div>
                )}
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {Array2.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? null : item.text} placement="left">
              <ListItemButton
                onMouseEnter={() => setHoveredIcon(item.path)}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => {
                  if(item.text=='Logout'){
                    // console.log("Logging out")
                    Cookies.remove('jwtToken');
                    Cookies.remove("userRole")
                    Cookies.remove('refreshToken');
                    Cookies.remove('projectId')
                    Cookies.remove('userName')
                    navigate(item.path);
                  }
                  navigate(item.path);
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  position: 'relative',
                  bgcolor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[800]
                        : grey[300]
                      : null,
                }}
              >
                {hoveredIcon === item.path && (
                  <div className="hovered-icon-border"></div>
                )}
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />
 </Drawer>
  );
};

export default SideBar;
