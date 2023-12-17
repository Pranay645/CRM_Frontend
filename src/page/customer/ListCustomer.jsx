import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import React from "react";
// import { columns, rows } from "./data";
import Header from "../../components/Header";
import Cookies from "js-cookie";
import axios from "axios";

const Customers = () => {

  const [rows,setRows]=React.useState([]);
  const[customerData,setCustomerData]=React.useState([])
  const [loading,setLoading]=React.useState(true)
  let fetchedData=[]
  let filteredData=[];
  
  const columns = [
    { field: "id", headerName: "ID", width: 33 },
  
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
  
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "pipCode",
      headerName: "Pip Code",
    },
  ];

  // const rows = [
  //   {
  //     id: 1,
  //     name: "Deep Sharma",
  //     email: "sdeep9891@gmail.com",
  //     phone: "7046535398",
  //     address: "Abc",
  //     city: "xyz",
  //     pipCode: "388260",
    
  //   },
  
  // ];


  React.useEffect(()=>{
    const fetchUrl="http://localhost:8080/findAllBasicDetails"
    const token=Cookies.get('jwtToken')
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const fetchData=async()=>{
      console.log("Token from Search bar"+token)
      try{
          const response=await axios.get(fetchUrl,config)
          if(response.status==200){
              console.log("Data Recieved Sucessfully");
              console.log(response.data[0])
              try{

                fetchedData=response.data;
                filteredData=fetchedData.map(row=>({
                  id:row.project.projectId,
                  name:row.project.customerFirstName+" "+row.project.customerLastName,
                  email:" ",
                  phone:row.project.customerPhoneNumber,
                  address:row.streetName+","+row.suburb,
                  city:row.suburb,
                  pipCode:row.postcode
                }))
                setCustomerData(fetchedData)
                setRows(filteredData) 
              }catch(e){
                  console.log("error"+e)
              }
              console.log(fetchedData)
              setLoading(false)
          }else{
            setLoading(false)
            console.error("Error on recieving response")
          }
      }
      catch(e){
        console.error("error Sending request")
        setLoading(false)
      }
    }
   
    return ()=>{
      console.log("Do Nothing")
      if(loading){
        fetchData(); 
         }
        
    }
  },[])
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 0 }}>
      <Header
        title="Customers"
        subTitle="List of Customers"
      />

      <Box sx={{ height: 700, width: "100%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          // @ts-ignore
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Customers;
