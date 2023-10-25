import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import React, { useState,useEffect,useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Appointment = ({searchId}) => {
  const [installer, setInstaller] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const[loading,setLoading]=useState(false)
  const[list,setList]=useState([])
  const handleInstallerChange = (event) => {
    setInstaller(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const convertDate=(dateObject)=>{
    let year = dateObject.getFullYear();
let month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month since it's zero-based
let day = dateObject.getDate().toString().padStart(2, '0');

// Get the current time components
let hours = dateObject.getHours().toString().padStart(2, '0');
let minutes = dateObject.getMinutes().toString().padStart(2, '0');
let seconds = dateObject.getSeconds().toString().padStart(2, '0');
let milliseconds = dateObject.getMilliseconds().toString().padStart(3, '0');

// Create the formatted date string in "yyyy-mm-ddTHH:mm:ss.sssZ" format
let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
return formattedDate

  }
  const fetchInstallers=useCallback(async()=>{
    const token=Cookies.get('jwtToken')
    const url='http://localhost:8080/getAllInstallers'
    const config = {
      headers: { "Authorization": `Bearer ${token}`}
    };
    try{
      const response= await axios.post(url,config)
      if(response.status==200){
        let installerList=[]

        console.log("Responsed recievde sucesfully of installer detail")
        console.log(response.data)
        response.data.filter(data=>installerList.push(data.userName))
        setList(installerList)
        console.log(installerList)
      }else{
        console.log("Error Recieving")
      }
    }catch(E){
      setLoading(true)
      console.error("Error Sending Request to fetch Installer Detail at appointment")
    }
  },[])
  useEffect(()=>{
    // setLoading(true)
    fetchInstallers()
    return ()=>{

    }
  },[fetchInstallers])
  //* ------------Handle Submit Function Below----------
  const handleSubmit = async (event) => {
    event.preventDefault();
 let dateObject=new Date(date);
 let newDate=convertDate(dateObject);
 const userName=Cookies.get('userName')
 let projectId=null;
 if(searchId){
   projectId=searchId
 }else{
   projectId=Cookies.get("projectId")
 }
 const token=Cookies.get('jwtToken')
const url="http://localhost:8080/scheduleJob"
const config = {
  headers: { "Authorization": `Bearer ${token}` }
};

    const appointmentData = {
      "userNameOfInstaller": installer,
      "userNameOfSalesman": userName,
      "projectId": projectId,
      "scheduleDate": newDate
    }
console.log(appointmentData)
    try{
      const response= await axios.post(url,appointmentData,config)
      if(response.status==200){
        console.log("Installer Scheduled");
        console.log(response.data)
      }else{
        console.log("Error Recieving Response");
      }
    }catch(error){
      console.error("Error Sending Request"+error)
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
      <form onSubmit={handleSubmit}>
        <title>Appointment</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />

        <div className="col-lg-12">
          <div className="card mb-4">
            <div className="card-body">
              <center>
                <h3>Schedule an Appointment</h3>
              </center>
              <div className="row">
                <div className="col-lg-12">
                  <div className="mb-3">
                    <label className="form-label">
                      <b>Select Installer</b>
                    </label>
                    <select
                      className="select2 form-control select2-hidden-accessible"
                      data-select2-placeholder="Select city"
                      data-select2-id="select2-data-7-809c"
                      tabIndex={-1}
                      aria-hidden="true"
                      onChange={handleInstallerChange}
                      value={installer}
                    >
                      <option data-select2-id="select2-data-9-k35n" />
                      
                      {
                        list.map(name=>{ return <option value={name} key={name}>{name}</option> })
                      }
                     
                    </select>
                  </div>
                </div>
              </div>
              <p>Preferred Appointment Date:</p>
              <div className="form-group">
                <label htmlFor="datetimepicker">
                  <b>Select Date:</b>
                </label>
                <div className="input-group date" id="datetimepicker">
                  <input
                    type="date"
                    className="form-control"
                    onChange={handleDateChange}
                    value={date}
                  />
                  <span className="input-group-addon">
                    <span className="" />
                  </span>
                </div>
              </div>
              <label
                style={{ marginTop: "15px" }}
                htmlFor="comments"
                className="form-label"
              >
                <strong>Note:</strong>
              </label>
              <textarea
                className="form-control"
                id="Address"
                rows={5}
                defaultValue={note}
                onChange={handleNoteChange}
              />
              <div className="btn-group">
                <button
                  type="submit"
                  style={{
                    marginTop: 10,
                    marginRight: 5,
                    backgroundColor: "#03a9f4", 
                    color: "white", 
                  }}
                  className="btn"
                >
                  Schedule
                </button>
                <button
                  type="reset"
                  style={{ marginTop: 10 }}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </div>
              <hr />
              <span className="help-block">
                <center>
                  True Hot Water<sup>TM</sup>
                </center>
              </span>
            </div>
          </div>
        </div>
      </form>
    </Box>
  );
};

export default Appointment;
