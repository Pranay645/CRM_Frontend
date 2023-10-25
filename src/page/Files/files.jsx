import Box from '@mui/material/Box';
import React,{ useEffect,useState }  from 'react';
import Cookies from 'js-cookie';
import {useForm,Controller} from 'react-hook-form'
import axios from 'axios';
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

  
    useEffect(()=>{
        if(searchId){
          setViewMode(true)
        }
    },[])
    const handleViewFile =async (e,fileName) => {
      e.preventDefault();
      const token=Cookies.get("jwtToken")
      console.log("Name "+fileName)
      const projectId=Cookies.get("projectId")
      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };
      let ext='.txt';
      const api=`http://localhost:8080/questions/${fileName}?projectId=${searchId}`
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
  

    const onSubmit=async()=>{
      const token=Cookies.get("jwtToken")
      let projectId=null;
      if(searchId){
        projectId=searchId
      }else{

        projectId=Cookies.get("projectId")
      }
      const api="http://localhost:8080/save-question-document?projectId="+projectId
    // console.log("Token above config :  "+token)
    const config = {
      headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
    };
    let fdata=new FormData();
    fdata.append('outsidePremisesSignage',premisePhotoFile);
    fdata.append('currentHWUnitCompliancePlate',compliancePlateFile);
    fdata.append('currentHWUnit',oldHWUnitFile);
    fdata.append('beforeInstallation',installationEnvironmentFile)
    fdata.append('electricityBill',electricityBillFile)
    // fdata.append(lightBill,'electricityBill')
    const formDataObject={}
    fdata.forEach((value,key)=>{formDataObject[key]=value})
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
                  <input
                    type="file"
                    accept='image/*'
                    className="form-control"
                    onChange={(e) =>
                      setInstallationEnvironmentFile(e.target.files[0])
                    }
                  />
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
                  <input
                    type="file"
                    className="form-control"
                    accept='image/*'

                    onChange={(e) =>
                      setCompliancePlateFile(e.target.files[0])
                    }
                  />
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
                  <input
                    type="file"
                    className="form-control"
                    accept='image/*'

                    onChange={(e) =>
                      setElectricityBillFile(e.target.files[0])
                    }
                  />
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
                  <input
                    type="file"
                    className="form-control"
                    accept='image/*'

                    onChange={(e) => setOldHWUnitFile(e.target.files[0])}
                  />
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
                  <input
                    type="file"
                    className="form-control"
                    accept='image/*'

                    onChange={(e) => setPremisePhotoFile(e.target.files[0])}
                  />
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
              <button className='btn btn-primary' type='submit'>Upload Files</button>
            </div>
          </div>
        </form>
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
