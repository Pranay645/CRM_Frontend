import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-pad";
import "bootstrap/dist/css/bootstrap.css";
import SignatureCanvas from "react-signature-canvas";
import Cookies from "js-cookie";
import axios from "axios";

const SignaturePage = () => {
  const salesmanSignatureRef = useRef(null);
  const customerSignatureRef = useRef(null);

  const [salesmanSignatureData, setSalesmanSignatureData] = useState(null);
  const [customerSignatureData, setCustomerSignatureData] = useState(null);

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
    const projectId=Cookies.get('projectId')
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
            <SignaturePad ref={salesmanSignatureRef} width={400} height={200} />
            <div></div>
          </div>
          <div className="mt-3">
            <button
              className="btn btn-info mr-6"
              style={{
                color: "white",
                marginRight: "7px",
              }}
              onClick={handleSalesmanClear}
            >
              Clear
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "#03a9f4",
                color: "white",
              }}
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
            <SignaturePad ref={customerSignatureRef} width={600} height={200} />
          </div>
          <div className="mt-3">
            <button
              className="btn btn-info mr-6"
              style={{
                color: "white",
                marginRight: "7px",
              }}
              onClick={handleCustomerClear}
            >
              Clear
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "#03a9f4",
                color: "white",
              }}
              onClick={handleSaveCustomer}
            >
              Save
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
        <button

          className="btn btn-info mr-6 col-md-2"
          style={{
            color: "white",
            marginRight: "7px",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SignaturePage;
