import React, { useState } from "react";
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import { useRef } from "react";
import SignaturePad from "react-signature-pad";
import Cookies from "js-cookie";
import axios from "axios";

const Installer = () => {
  const [document1File, setDocument1File] = useState(null);
  const [document2File, setDocument2File] = useState(null);
  const [document3File, setDocument3File] = useState(null);
  const [document4File, setDocument4File] = useState(null);
  const [document5File, setDocument5File] = useState(null);
  const [document6File, setDocument6File] = useState(null);
  const [document7File, setDocument7File] = useState(null);

  const generateDownloadLink = (file) => {
    if (file) {
      const downloadUrl = URL.createObjectURL(file);
      return (
        <a href={downloadUrl} download>
          Download
        </a>
      );
    }
    return null;
  };

  const installerSignatureRef = useRef(null);
  const customerSignatureRef=useRef(null)
  const [installerSignatureData, setInstallerSignatureData] = useState(null);
  const [customerSignatureData, setCustomerSignatureData] = useState(null);
  

  const handleInstallerClear = (e) => {
    e.preventDefault()
    installerSignatureRef.current.clear();
    setInstallerSignatureData(null);
  };
  const handleCustomerClear = (e) => {
    e.preventDefault()
    customerSignatureRef.current.clear();
    setCustomerSignatureData(null);
  };

  const handleSaveInstaller = (e) => {
    e.preventDefault()
    const dataURL = installerSignatureRef.current.toDataURL();
    setInstallerSignatureData(dataURL);
  };
  const handleSaveCustomer = (e) => {
    e.preventDefault()
    const dataURL = customerSignatureRef.current.toDataURL();
    setCustomerSignatureData(dataURL);
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const projectId=Cookies.get('projectId')
     const token=Cookies.get('jwtToken')
    const url="http://localhost:8080/upload-installation-document"
const config = {
  headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
};
const fdata=new FormData();
fdata.append('projectId',projectId);
fdata.append('installerSign',installerSignatureData.substring(22));
fdata.append('customerSign',customerSignatureData.substring(22))
fdata.append('exisitingsystemsitu ',document1File)
fdata.append('exisitingsystemcomplianceplate',document2File)
fdata.append('exisitingsystemdecommisioning',document3File)
fdata.append('newsystem',document4File)
fdata.append('newsystemsitu',document5File)
fdata.append('installerselfie',document6File)
fdata.append('outsidepremises',document7File)


const formDataObject={}
  fdata.forEach((value,key)=>{formDataObject[key]=value})
  console.log(formDataObject)
try{
  const response=await axios.post(url,formDataObject,config)
  if(response.status==200){
    console.log("Installer Details Updated Sucessfully");
    console.log(response.data)
  }else{
    console.log("Error in recieving Response")
  }
}catch(e){
  console.error("Error in Sending Request"+e)

}
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
      <div>
        <div className="col-lg-12">
          <div className="card p-3">
            <form>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Take the photo of existing system in situ
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document1"
                    onChange={(e) => setDocument1File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document1"
                  ></label>
                  {generateDownloadLink(document1File)}
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Take the photo of existing system compliance plate showing
                    rated heating capacity (kW)
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document2"
                    onChange={(e) => setDocument2File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document2"
                  ></label>
                  {generateDownloadLink(document2File)}
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Take the photo of existing system decommissioning Make
                    whole in tank with address of property
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document3"
                    onChange={(e) => setDocument3File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document3"
                  ></label>
                  {generateDownloadLink(document3File)}
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Take the photo of New installed system compliance plate
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document4"
                    onChange={(e) => setDocument4File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document4"
                  ></label>
                  {generateDownloadLink(document4File)}
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Take the photo of new installed system in situ
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document5"
                    onChange={(e) => setDocument5File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document5"
                  ></label>
                  {generateDownloadLink(document5File)}
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                   Take the photo of Installer(s) selfie
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document6"
                    onChange={(e) => setDocument6File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document6"
                  ></label>
                  {generateDownloadLink(document6File)}
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Take the photo of outside of premises
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="document7"
                    onChange={(e) => setDocument7File(e.target.files[0])}
                    // @ts-ignore
                    capture="camera"
                    accept="image/*"
                  />
                  <label
                    className="input-group-text"
                    htmlFor="document7"
                  ></label>
                  {generateDownloadLink(document7File)}
                </div>
              </div>
              <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h3>Customer Signature</h3>
          <div className="border p-3">
            <SignaturePad ref={customerSignatureRef} width={400} height={200} />
            <div></div>
          </div>
          <div className="mt-3">
            <button
              className="btn btn-info mr-6"
              style={{
                color: "white",
                marginRight: "7px",
              }}
              onClick={e=>handleCustomerClear(e)}
            >
              Clear
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "#03a9f4",
                color: "white",
              }}
              onClick={e=>handleSaveCustomer(e)}
            >
              Save
            </button>

            {customerSignatureData && (
              <div>
                <h5 style={{ marginTop: "15px" }}>
                  Assessor Signature Result:
                </h5>
                <img src={customerSignatureData} alt="Salesman Signature" />
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <h3>Installer Signature</h3>
          <div className="border p-3">
            <SignaturePad ref={installerSignatureRef} width={600} height={200} />
          </div>
          <div className="mt-3">
            <button
              className="btn btn-info mr-6"
              style={{
                color: "white",
                marginRight: "7px",
              }}
              onClick={e=>handleInstallerClear(e)}
            >
              Clear
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "#03a9f4",
                color: "white",
              }}
              onClick={e=>handleSaveInstaller(e)}
            >
              Save
            </button>
            {installerSignatureData && (
              <div>
                <h5 style={{ marginTop: "15px" }}>
                  {" "}
                  Customer Signature Result:
                </h5>
                <img src={installerSignatureData} alt="Customer Signature" />
              </div>
            )}
          </div>
        </div>
       
      </div>
    </div>

           
            <button
                type="submit"
                className="btn mt-3"
                style={{
                  backgroundColor: "#03a9f4",
                  marginTop: "15px",
                  color: "white",
                }}
                onClick={(e)=>handleSubmit(e)}
              >
                Submit
              </button>
              </form>

          </div>
        </div>
      </div>
    </Box>
  );
};

export default Installer;
