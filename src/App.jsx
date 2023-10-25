import * as React from "react";
import { styled, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import { ThemeProvider } from "@emotion/react";
import { Outlet,useLocation ,useNavigate} from "react-router-dom";
import getDesignTokens from "./theme";
import { AuthContext } from "./contexts/AuthContext";
import AuthContextProvider from "./contexts/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function App() {
  const [open, setOpen] = React.useState(false);
  const{userRole,loginStatus}=React.useContext(AuthContext)
  const navigate=useNavigate();
 React.useEffect(()=>{
  console.log("App Loaded");
  // console.log("UserRole"+userRole)

 
  return()=>{
    const refreshToken=Cookies.get("refreshToken");
    const getNewToken=async()=>{

      if(refreshToken!=null && loginStatus){
        const date = new Date();
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();
console.log("Token :"+refreshToken)
console.log(hours + ":" + minutes + ":" + seconds);
        const url="http://localhost:8080/refreshToken"
        const data={"uuid":refreshToken}
        try{
          const response=await axios.post(url,data)
          if(response.status==200){
            console.log("Refeshed Token Fetched Sucessfully ")
            console.log(response.data);
            if(response.data=='IMPROPER CREDENTIALS PROVIDED, TRY AGAIN'){
              //*Logout Logic
              Cookies.remove('jwtToken');
              Cookies.remove("userRole")
              Cookies.remove('refreshToken');
              Cookies.remove('projectId')
              Cookies.remove('userName')
              //TODO May be advance the below logic
            window.location.reload(); 
                  navigate("/");
                  return;
            }
            // Cookies.remove("jwtToken");
            Cookies.set("jwtToken",response.data.token)
          }
        }catch(E){
          console.error("Error in sending request at refreshing Token"+E)
        }
      }
    }
    const minute = 1000 * 60;
    // getNewToken();
    setInterval(getNewToken, minute * 1);
    console.log("App Ended")
  }
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
