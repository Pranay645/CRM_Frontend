// import Box from '@mui/material/Box';
import { Box,Snackbar } from '@mui/material';
import { Alert } from 'react-bootstrap';

import React,{ useEffect,useState }  from 'react';
import Cookies from 'js-cookie';
import {useForm,Controller} from 'react-hook-form'
import axios from 'axios';
import FileInput from './FileInput'
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';


const Files = ({searchId}) => {

  const {register,handleSubmit}=useForm();


    const [installationEnvironmentFile, setInstallationEnvironmentFile] = useState(null);
    const [oldHWUnitFile, setOldHWUnitFile] = useState(null);
    const [compliancePlateFile, setCompliancePlateFile] = useState(null);
    const [electricityBillFile, setElectricityBillFile] = useState(null);
    const [premisePhotoFile, setPremisePhotoFile] = useState(null);
    const [selectedFileForView, setSelectedFileForView] = useState(null);
    const[viewMode,setViewMode]=useState(false);
    const [scale, setScale] = useState(1);
    const [uploadedImage, setUploadedImage] = useState(null);
    const[longitude,setLongitude]=useState(0);
    const[latitude,setLatitude]=useState(0);
    const [open,setOpen]=React.useState(false)

    const handleClose=(event,reason)=>{
      if (reason=='clickaway'){
        return;
      }
      setOpen(false)
    }

  const functionMap={
    setInstallationEnvironmentFile: setInstallationEnvironmentFile,
    setOldHWUnitFile:setOldHWUnitFile,
    setCompliancePlateFile:setCompliancePlateFile,
    setElectricityBillFile:setElectricityBillFile,
    setPremisePhotoFile:setPremisePhotoFile
  }
    useEffect(()=>{
      console.log("Files Uplaoded Part Loaded")
      console.log('geolocation' in navigator)
      navigator.geolocation.getCurrentPosition((position)=>{
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
       
      })
        if(searchId){
          setViewMode(true)
        }
    },[])
    const handleViewFile =async (e,fileName) => {
      e.preventDefault();
      let api=`http://localhost:8080/questions/${fileName}?projectId=${searchId}`
      if(fileName=='siteacessor' || fileName=='customer'){
        api=`http://localhost:8080/getsign/${fileName}?projectId=${searchId}`
      }
      const token=Cookies.get("jwtToken")
      console.log("Name "+fileName)
      const projectId=Cookies.get("projectId")
      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };
      let ext='.txt';
      fetch(api,{
        method: 'GET', // Replace with the appropriate HTTP method (GET, POST, etc.)
        headers: {
          'Authorization': `Bearer ${token}` 
        },
      })
      // check to make sure you didn't have an unexpected failure (may need to check other things here depending on use case / backend)
      
     .then(resp =>{
      if(resp.status === 200) {
        //  console.log(resp.headers.get('Content-Type'));
        setOpen(true)
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
              setSelectedFileForView(URL.createObjectURL(blob));

      //        const url = window.URL.createObjectURL(blob);
      //        const a = document.createElement('a');
      //  a.style.display = 'none';
      //  a.href = url;
      //  // the filename you want
      //  a.download = `${fileName}.${ext}`;
      //  document.body.appendChild(a);
      //  a.click();
      //  window.URL.revokeObjectURL(url);
       // or you know, something with better UX...
      //  alert('your file has downloaded!'); 
     })
     .catch(() => alert('oh no!'));
      // if (file) {
      //   setSelectedFileForView(URL.createObjectURL(file));
      // }
    };
    const updateFiles=async(id,filesObject)=>{
      const api="http://localhost:8080/update-question-document?projectId="+searchId
    // console.log("Token above config :  "+token)
    const token=Cookies.get("jwtToken")

    const config = {
      headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
    };
   
    console.log(filesObject)
    try{
      const response= await axios.put(api,filesObject,config);
      if(response.status==200){
          console.log("File Uploaded Sucesfully");
          console.log(response.data)
      }else{
        console.log("error in recieving response")
      }
     }
     catch(error){
        console.log("Error in sending request")
     }
    }

    const onSubmit=async()=>{
      const token=Cookies.get("jwtToken")
      let fdata=new FormData();
      fdata.append('outsidePremisesSignage',premisePhotoFile);
      fdata.append('currentHWUnitCompliancePlate',compliancePlateFile);
      fdata.append('currentHWUnit',oldHWUnitFile);
      fdata.append('beforeInstallation',installationEnvironmentFile)
      fdata.append('electricityBill',electricityBillFile)
      // fdata.append(lightBill,'electricityBill')
      const formDataObject={}
      fdata.forEach((value,key)=>{formDataObject[key]=value})
      let projectId=null;
      if(searchId){
        projectId=searchId
        updateFiles(searchId,formDataObject)
        //TODO Change above logic for projectID
        return;
      }else{

        projectId=Cookies.get("projectId")
      }
      const api="http://localhost:8080/save-question-document?projectId="+projectId
    // console.log("Token above config :  "+token)
    const config = {
      headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
    };
   
    console.log(formDataObject)
    try{
      const response= await axios.post(api,formDataObject,config);
      if(response.status==200){
          console.log("File Uploaded Sucesfully");
          console.log(response.data)
      }else{
        console.log("error in recieving response")
      }
     }
     catch(error){
        console.log("Error in sending request")
     }
    }
    const handleZoomIn = () => {
      
      setScale(scale * 1.2); // Increase the scale factor to zoom in
    };
  
    const handleZoomOut = () => {
      
      setScale(scale / 1.2); // Decrease the scale factor to zoom out
    };
    // *Adding BlackStrip
    const addGeoTag=async(file,funcName)=>{
      // e.preventDefault();
      // const file=e.target.files[0];
      const reader = new FileReader();
      console.log(funcName)
      
  
      reader.onload = (e) => {
        const uploadedImage = new Image();
        uploadedImage.src =URL.createObjectURL(file);
        // uploadedImage.src = URL.createObjectURL(e.target.result);
  
        uploadedImage.onload = () => {
          // Add a black strip with location information
          const canvas = document.createElement('canvas');
          canvas.width = uploadedImage.width;
          canvas.height = uploadedImage.height + 50; // Add 50px for the black strip
          const ctx = canvas.getContext('2d');
          
          // Draw the black strip
          ctx.fillStyle = 'black';
          ctx.fillRect(0, uploadedImage.height, canvas.width, 50);
  
          // Draw the location text
          ctx.fillStyle = 'white';
          ctx.font = '15px Arial';
          ctx.fillText(`Longitude: ${longitude}__Latitude: ${latitude}__Time: 23:23:12__Date:2002-12-12`, 10, uploadedImage.height + 30);
  
          // Draw the uploaded image on top
          ctx.drawImage(uploadedImage, 0, 0);
          canvas.toBlob(async(blob)=>{
            const editedFile=new File([blob],file.name.split('.')[0],{type:'image/jpeg'})
           functionMap[funcName](editedFile)
          },'image/jpeg')
          
            
          const editedImage = canvas.toDataURL('image/jpeg');
  
          setUploadedImage(editedImage);
        };
      };
  
      reader.readAsDataURL(file);
    };
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
      <div className="row">
        <div className="col-lg-6">
          {/* -------------------------FORM BEGINS------------------------------- */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card mb-4" style={{ marginTop: "20px" }}>
            <div className="card-body">
              <h3 className="h6 mb-4">
                <b>Upload Files</b>
              </h3>

              
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Geo-tagged photo installation environment before the
                    product is installed (including existing product replaced
                    if applicable)?*
                  </label>
                </div>
                <div className="input-group">
                <FileInput onFileUpload={addGeoTag} funcName={'setInstallationEnvironmentFile'}/>

                
                  <span
                    className="btn btn-link"
                    onClick={(e) =>
                      handleViewFile(e,'beforeinstallation')
                    }
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                      display:viewMode ? 'inline-block' :'none'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Geo-tagged photo of the current (OLD) HW unit compliance
                    plate (showing brand and model)*
                  </label>
                </div>
                <div className="input-group">
                <FileInput onFileUpload={addGeoTag} funcName={'setCompliancePlateFile'}/>
               
                  <span
                    className="btn btn-link"
                    onClick={(e) =>
                      handleViewFile(e,'currenthwunitcomplianceplate')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                      display:viewMode ? 'inline-block' :'none'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Please take a photo of the electricity bill
                  </label>
                </div>
                <div className="input-group">
                <FileInput onFileUpload={addGeoTag} funcName={'setElectricityBillFile'}/>

                 
                  <span
                    className="btn btn-link"
                    onClick={(e) =>
                      handleViewFile(e,'electricitybill')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                      display:viewMode ? 'inline-block' :'none'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Geo-tagged photo of the current (OLD) HW unit (in situ)*
                  </label>
                </div>
                <div className="input-group">
                <FileInput onFileUpload={addGeoTag} funcName={'setOldHWUnitFile'}/>

                  
                  <span
                    className="btn btn-link"
                    onClick={(e) =>
                      handleViewFile(e,'currenthwunit')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                      display:viewMode ? 'inline-block' :'none'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Please take a photo of the outside of premise including
                    signage if possible*
                  </label>
                </div>
                <div className="input-group">
                <FileInput onFileUpload={addGeoTag} funcName={'setPremisePhotoFile'}/>

                  <span
                    className="btn btn-link"
                    onClick={(e) => handleViewFile(e,'outsidepremisessignage')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                      display:viewMode ? 'inline-block' :'none'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
              <div className="mb-4" style={{ display:viewMode ? 'block' :'none'}}>
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0" style={{ display:'inline-block'}}>
                   Form 17
                  </label>
                </div>
                <div className="input-group">

                  <span
                    className="btn btn-link"
                    onClick={(e) => handleViewFile(e,'form17')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                     display:'inline-block'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
              <div className="mb-4" style={{ display:viewMode ? 'block' :'none'}}>
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                  Form 16
                  </label>
                </div>
                <div className="input-group">

                  <span
                    className="btn btn-link"
                    onClick={(e) => handleViewFile(e,'form16')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                     display:'inline-block'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
              <div className="mb-4" style={{ display:viewMode ? 'block' :'none'}}>
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                   SiteAccesor Sign
                  </label>
                </div>
                <div className="input-group">

                  <span
                    className="btn btn-link"
                    onClick={(e) => handleViewFile(e,'siteacessor')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                     display:'inline-block'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
              <div className="mb-4" style={{ display:viewMode ? 'block' :'none'}}>
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                   Customer Sign
                  </label>
                </div>
                <div className="input-group">

                  <span
                    className="btn btn-link"
                    onClick={(e) => handleViewFile(e,'customer')}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                     display:'inline-block'
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
              <button className='btn btn-primary' type='submit'>Upload Files</button>
            </div>
          </div>
        </form>
        <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          // onClose={handleClose}
          // @ts-ignore
          severity="info"
          sx={{ width: "100%" }}
        >
          Files Uploaded/Updated Succesfully
        </Alert>
      </Snackbar>
        </div>

        <div className="col-lg-6">
          <div className="card mb-4" style={{ marginTop: "20px",display:viewMode ? 'block':'none' }} >
          <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
            <div className="card-body"  >
              <h3 className="h6 mb-4" style={{  }} >
                <b>Image Preview</b>
              </h3>

              <div
                style={{ width: "100%", height: "490px", overflow: "hidden" }}
              >
                <iframe
                  title="Image Preview"
                  src={selectedFileForView || ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    border: "none",
                    transform: `scale(${scale})`
                    
                  }}
                ></iframe>
              </div>
              <a
                href={selectedFileForView}
                download
                className="btn "
                style={{
                  marginLeft: "340px",
                  backgroundColor: "#03a9f4",
                  marginTop: "10px",
                  color: "white",
                }}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
      </Box>
  );
};

export default Files;
