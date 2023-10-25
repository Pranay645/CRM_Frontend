import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-pad";
import SignatureCanvas from "react-signature-canvas";
import { useTheme } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.css";
import Cookies from "js-cookie";
import axios from "axios";

const SignaturePage = ({searchId}) => {
  const salesmanSignatureRef = useRef(null);
  const customerSignatureRef = useRef(null);


  const [salesmanSignatureData, setSalesmanSignatureData] = useState(null);
  const [customerSignatureData, setCustomerSignatureData] = useState(null);
  const theme=useTheme()
  // const penColor=theme.palette.mode==='dark' ?"white":"black";
  const penColor='cyan'

  const handleSalesmanClear = () => {
    salesmanSignatureRef.current.clear();
    setSalesmanSignatureData(null);
  };

  const handleCustomerClear = () => {
    customerSignatureRef.current.clear();
    setCustomerSignatureData(null);
  };

  const handleSaveSalesman = () => {
    const dataURL = salesmanSignatureRef.current.toDataURL();
    setSalesmanSignatureData(dataURL);
  };

  const handleSaveCustomer = () => {
    const dataURL = customerSignatureRef.current.toDataURL();
    setCustomerSignatureData(dataURL);
  };

  const handleSubmit=async()=>{
    
    let projectId=null;
    if(searchId){
      projectId=searchId
    }else{
      projectId=Cookies.get("projectId")
    }
     const token=Cookies.get('jwtToken')
    const url="http://localhost:8080/sign"
const config = {
  headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
};
const fdata=new FormData();
fdata.append('projectId',projectId);
fdata.append('siteacessor',salesmanSignatureData.substring(22));
fdata.append('customer',customerSignatureData.substring(22))
const formDataObject={}
  fdata.forEach((value,key)=>{formDataObject[key]=value})
  console.log(formDataObject)
try{
  const response=await axios.post(url,formDataObject,config)
  if(response.status==200){
    console.log("Signature Uploaded Sucessfully");
    console.log(response.data)
  }else{
    console.log("Error in recieving Response")
  }
}catch(e){
  console.error("Error in Sending Request"+e)

}

  }
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h3>Site Assessor Signature</h3>
          <div className="border p-3">
          <SignatureCanvas
              ref={salesmanSignatureRef}
              penColor={penColor}
              canvasProps={{ width: 600, height: 200 }}
            />
           
          </div>
          <div className="mt-3">
            <button
              className="btn btn-light "
              style={{
               
                marginRight: "7px",
              }}
              onClick={handleSalesmanClear}
            >
              Clear
            </button>
            <button
              className="btn btn-light"
             
              onClick={handleSaveSalesman}
            >
              Save
            </button>

            {salesmanSignatureData && (
              <div>
                <h5 style={{ marginTop: "15px" }}>
                  Assessor Signature Result:
                </h5>
                <img src={salesmanSignatureData} alt="Salesman Signature" />
              </div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <h3>Customer Signature</h3>
          <div className="border p-3">
          <SignatureCanvas
              ref={customerSignatureRef}
              penColor={penColor}
              canvasProps={{ width: 600, height: 200 }}
            />
          </div>
          <div className="mt-3">
            <button
              className="btn btn-light"
              style={{
                marginRight: "7px",
              }}
              onClick={handleCustomerClear}
            >
              Clear
            </button>
            <button
              className="btn btn-light"
             
              onClick={handleSaveCustomer}
            >
              Save
            </button>
            <button

              className="btn btn-light"
              style={{
                
                marginLeft: "425px",
              }}
              onClick={handleSubmit}
              disabled={!(salesmanSignatureData && customerSignatureData)}
              >
              Submit
              </button>
            {customerSignatureData && (
              <div>
                <h5 style={{ marginTop: "15px" }}>
                  {" "}
                  Customer Signature Result:
                </h5>
                <img src={customerSignatureData} alt="Customer Signature" />
              </div>
            )}
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default SignaturePage;
