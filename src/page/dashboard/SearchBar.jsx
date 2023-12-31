import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import axios from "axios";
import Cookies from "js-cookie";
import {data }from './data'



const SearchBar = () => {
  const [loading,setLoading]=React.useState(true);
  const [jobId, setJobId] = useState("");
  const [Name, setName] = useState("");
  const [MobileNumber, setMobileNumber] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(true);
  const [showEmptySearchMessage, setShowEmptySearchMessage] = useState(false);
  const [dialogData, setDialogData] = useState({
    "addressId": 0,
    "project": {
      "projectId": 0,
      "projectTitle": "Dummy Project",
      "customerFirstName": "No Name",
      "customerLastName": "No last Name",
      "customerPhoneNumber": 0,
      "customerMobileNumber": 0,
      "customerType": "null",
      "companyName": "null",
      "abnNumber": 0,
      "gstRegistered": "0"
    },
    "buildingName": "null",
    "unitNumber": "null",
    "lotNumber": "null",
    "streetNumber": "null",
    "streetName": "null",
    "streetTypeSuffix": "null",
    "suburb": "null",
    "state": "null",
    "postcode": "null"
  });
   const[customerData,setCustomerData]=useState([]);
  let fetchedData=[];
  const navigate = useNavigate();
  const searchRef = useRef(null);


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
                setCustomerData(fetchedData)
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
    if(loading){
   fetchData(); 
    }
      // setCustomerData(fetchedData) 
    
    return ()=>{
      console.log("Do Nothing")
      setCustomerData(fetchedData) 

         
    }
  },[])
  
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleInputChange = (event, setStateFunction) => {
    const inputValue = event.target.value;
    setStateFunction(inputValue);

    const filteredSuggestions = customerData.filter(
      (item) =>
        item.project.projectId.toString().includes(inputValue.toLowerCase()) ||
        item.project.customerFirstName.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.project.customerPhoneNumber.toString().includes(inputValue.toLowerCase())
    );
    // const filteredSuggestions=customerData.filter((item)=>{
    //           item.project.projectId.toString().includes(inputValue.toLowerCase()) 

    // })

    setSuggestions(filteredSuggestions);
    setIsSearchButtonDisabled(inputValue.trim() === "");
    setShowEmptySearchMessage(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setDialogData(suggestion);
    setOpenDialog(true);
    clearSuggestions();
  };
  const handleSearchButtonClick = () => {
    if (isSearchButtonDisabled) {
      setShowEmptySearchMessage(true);
      setTimeout(() => setShowEmptySearchMessage(false), 3000); // 
    } else {
      setOpenDialog(true);
  }
  };
  const clearSuggestions = () => {
    setSuggestions([]);
  };
  const handleRedirect=(customerData)=>{
    
    navigate("/app/salesman/StepWizard",{state:customerData})
  }
  const downloadZip=async(id)=>{
    console.log("Id "+id)
    let ext=null;
    const api=`http://localhost:8080/zip?projectId=${id}`
    // try{
    //   const resp=await axios.get(api)
    //   if(resp.status==200){
    //     console.log("SUCESS!!!")
    //     console.log(resp.data)
    //   }
    // }catch(E){
    //   console.error("Error in sending request"+E)
    // }
    fetch(api,{
      method: 'GET', // Replace with the appropriate HTTP method (GET, POST, etc.)
      // headers: {
      //   'Authorization': `Bearer ${token}` 
      // },
    })
    // check to make sure you didn't have an unexpected failure (may need to check other things here depending on use case / backend)
    
   .then(resp =>{
    if(resp.status === 200) {
      //  console.log(resp.headers.get('Content-Type'));
      console.log(resp)
      // if(resp==false){
      //   alert("That document not uploaded yet!!!")
      // }
        ext=resp.headers.get('Content-Type').split('/')[1]
        if(ext=='json'){
             alert("That document not uploaded yet!!!")
            return;
        }
       return resp.blob() }
       else{
         return Promise.reject('something went wrong')}})
         .then(blob => {
          console.log(ext)
            // setSelectedFileForView(URL.createObjectURL(blob));

           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
     a.style.display = 'none';
     a.href = url;
    //  // the filename you want
     a.download = `ZipForId_${id}.zip`;
     document.body.appendChild(a);
     a.click();
     window.URL.revokeObjectURL(url);
     // or you know, something with better UX...
    //  alert('your file has downloaded!'); 
   })
   .catch(() => alert('oh no!'));
  }
  const downloadCSV=async(id)=>{
    console.log("Id "+id)
    let ext=null;
    const api=`http://localhost:8080/getcsvfile/${id}`
    // try{
    //   const resp=await axios.get(api)
    //   if(resp.status==200){
    //     console.log("SUCESS!!!")
    //     console.log(resp.data)
    //   }
    // }catch(E){
    //   console.error("Error in sending request"+E)
    // }
    fetch(api,{
      method: 'GET', // Replace with the appropriate HTTP method (GET, POST, etc.)
      // headers: {
      //   'Authorization': `Bearer ${token}` 
      // },
    })
    // check to make sure you didn't have an unexpected failure (may need to check other things here depending on use case / backend)
    
   .then(resp =>{
    if(resp.status === 200) {
      //  console.log(resp.headers.get('Content-Type'));
      console.log(resp)
      // if(resp==false){
      //   alert("That document not uploaded yet!!!")
      // }
        ext=resp.headers.get('Content-Type').split('/')[1]
        if(ext=='json'){
             alert("That document not uploaded yet!!!")
            return;
        }
       return resp.blob() }
       else{
         return Promise.reject('something went wrong')}})
         .then(blob => {
          console.log(ext)
            // setSelectedFileForView(URL.createObjectURL(blob));

           const url = window.URL.createObjectURL(blob);
           const a = document.createElement('a');
     a.style.display = 'none';
     a.href = url;
    //  // the filename you want
     a.download = `CSVForId_${id}.csv`;
     document.body.appendChild(a);
     a.click();
     window.URL.revokeObjectURL(url);
     // or you know, something with better UX...
    //  alert('your file has downloaded!'); 
   })
   .catch(() => alert('oh no!'));
  }

  return (
    <div className="parent-container2">
    <div className="home-container">
      
    <section className=" py-3 py-md-5 py-xl-10">
    <Container maxWidth="md"  style={{ marginTop: '0rem' }}>

          <div className="container" style={{ marginTop: 200 }}>
          <div className="search" ref={searchRef}>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4">
                <div className="search-box text-center">
                  <i className="bx bx-search-alt"></i>
                  <input
                    type="text"
                    placeholder="By Job ID"
                    value={jobId}
                    onChange={(e) => handleInputChange(e, setJobId)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="search-box text-center">
                  <i className="bx bxs-map"></i>
                  <input
                    type="text"
                    placeholder="By Name"
                    value={Name}
                    onChange={(e) => handleInputChange(e, setName)}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6 col-md-4">
                <div className="search-box text-center">
                  <i className="bx bx-mobile"></i>
                  <input
                    type="text"
                    placeholder="By Mobile Number"
                    value={MobileNumber}
                    onChange={(e) => handleInputChange(e, setMobileNumber)}
                  />
                  <IconButton
                        color="primary"
                        aria-label="Search"
                        onClick={handleSearchButtonClick}
                        disabled={isSearchButtonDisabled}
                      >
                        <SearchIcon />
                    </IconButton>
                  
                </div>
              </div>
            </div>
            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.project.projectId+"ㅤㅤㅤㅤㅤㅤ"+suggestion.project.customerFirstName+" "+suggestion.project.customerLastName+"ㅤㅤㅤㅤㅤㅤ"+ suggestion.project.customerMobileNumber

}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {
                // @ts-ignore
                dialogData.project.customerFirstName+" "+dialogData.project.customerLastName
              }
              {/* <a
                href={`app/salesman/${
                  // @ts-ignore
                  dialogData.project.projectId
                }`}
                style={{ marginLeft: "655px" }}
              >
                {
                  // @ts-ignore
                  dialogData.project.projectId
                }
              </a> */}
              {/* ()=>downloadZip(dialogData.project.projectId) */}
              <button 
              className="btn btn-primary" 
              style={{ marginLeft: "655px" }}
              onClick={()=>handleRedirect(dialogData)}
              >#Project {dialogData.project.projectId}</button>
              <button
                className="btn btn-secondary"
                style={{}}
                onClick={()=>downloadZip(dialogData.project.projectId)}
              >
                Download Zip
              </button>
              <button
                className="btn btn-secondary"
                style={{}}
                onClick={()=>downloadCSV(dialogData.project.projectId)}
              >
                Download CSV
              </button>
            </DialogTitle>

            <DialogContent>
              <p style={{ marginTop: "10px" }}>
                <strong>Job ID:</strong>{" "}
                {
                  // @ts-ignore
                   dialogData.project.projectId
                }
              </p>
              <p style={{ marginTop: "10px" }}>
                <strong>Name:</strong>{" "}
                {
                  // @ts-ignore
                  dialogData.project.customerFirstName+" "+dialogData.project.customerLastName
                }
              </p>
              <p style={{ marginTop: "10px" }}>
                <strong>Mobile Number:</strong>{" "}
                {
                  // @ts-ignore
                  dialogData.project.customerMobileNumber
                }
              </p>
              <Button
                style={{ marginTop: "10px" }}
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(false)}
              >
                Close
              </Button>
            </DialogContent>
          </Dialog>
            </div>
            </Container>
     </section>
   
      </div>
    </div>
  );
};

export default SearchBar;
