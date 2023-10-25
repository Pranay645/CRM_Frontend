import Box from '@mui/material/Box';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const Files = ({searchId}) => {

    const [proofOfAddressFile, setProofOfAddressFile] = useState(null);
    const [installationEnvironmentFile, setInstallationEnvironmentFile] = useState(null);
    const [oldHWUnitFile, setOldHWUnitFile] = useState(null);
    const [compliancePlateFile, setCompliancePlateFile] = useState(null);
    const [electricityBillFile, setElectricityBillFile] = useState(null);
    const [premisePhotoFile, setPremisePhotoFile] = useState(null);
    const [selectedFileForView, setSelectedFileForView] = useState(null);
    const[viewMode,setViewMode]=useState(false);
  
    useEffect(()=>{
        if(searchId){
          setViewMode(true)
        }
    },[])
    const handleViewFile = (file) => {
      if (file) {
        setSelectedFileForView(URL.createObjectURL(file));
      }
    };
  


  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4" style={{ marginTop: "20px" }}>
            <div className="card-body">
              <h3 className="h6 mb-4">
                <b>Upload Files</b>
              </h3>

              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <label className="fw-bold mb-0">
                    Proof of customer address (i.e., Letter or Mailbox)
                    (Install)*:
                  </label>
                </div>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setProofOfAddressFile(e.target.files[0])}
                  />
                  <span
                    className="btn btn-link"
                    onClick={() => handleViewFile(proofOfAddressFile)}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
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
                    className="form-control"
                    onChange={(e) =>
                      setInstallationEnvironmentFile(e.target.files[0])
                    }
                  />
                  <span
                    className="btn btn-link"
                    onClick={() =>
                      handleViewFile(installationEnvironmentFile)
                    }
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
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
                    onChange={(e) =>
                      setCompliancePlateFile(e.target.files[0])
                    }
                  />
                  <span
                    className="btn btn-link"
                    onClick={() => handleViewFile(compliancePlateFile)}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
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
                    onChange={(e) =>
                      setElectricityBillFile(e.target.files[0])
                    }
                  />
                  <span
                    className="btn btn-link"
                    onClick={() => handleViewFile(electricityBillFile)}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
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
                    onChange={(e) => setOldHWUnitFile(e.target.files[0])}
                  />
                  <span
                    className="btn btn-link"
                    onClick={() => handleViewFile(oldHWUnitFile)}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
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
                    onChange={(e) => setPremisePhotoFile(e.target.files[0])}
                  />
                  <span
                    className="btn btn-link"
                    onClick={() => handleViewFile(premisePhotoFile)}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "blue",
                    }}
                  >
                    View
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card mb-4" style={{ marginTop: "20px" }} >
            <div className="card-body">
              <h3 className="h6 mb-4">
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
