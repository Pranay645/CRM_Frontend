import * as React from "react";
import { styled, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import { ThemeProvider } from "@emotion/react";
import { Outlet,useLocation } from "react-router-dom";
import getDesignTokens from "./theme";
import { AuthContext } from "./contexts/AuthContext";
import AuthContextProvider from "./contexts/AuthContext";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function App() {
  const [open, setOpen] = React.useState(false);
  const{userRole}=React.useContext(AuthContext)
  
 React.useEffect(()=>{
  console.log("App Loaded");
  // console.log("UserRole"+userRole)

 },[])
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [mode, setMode] = React.useState(
    localStorage.getItem("currentMode")
      ? localStorage.getItem("currentMode")
      : "light"
  );
  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>

      <Box sx={{ display: "cover"}}>
        <CssBaseline />
        <TopBar
          setMode={setMode}
          handleDrawerOpen={handleDrawerOpen}
          open={open}
        />
        <SideBar handleDrawerClose={handleDrawerClose} open={open}  />
            <Box component="main" sx={{ flexGrow: 1, p: 0, m: 0 }}>
          <DrawerHeader />
          {/* <Context.Provider value={{jwt:jwtToken}}> */}
            {<Outlet />}
          {/* </Context.Provider>      */}
         
          
        </Box>
      </Box>
</ThemeProvider>
  );
}
