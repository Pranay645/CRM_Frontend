import { Box,Snackbar } from '@mui/material';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { AuthContext } from './../../contexts/AuthContext';
import {useForm,Controller} from 'react-hook-form'
import { Alert } from 'react-bootstrap';
import axios from 'axios'
import { useOutletContext,useLocation ,useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie'
import './../job/JobForm.css'
import { useState } from 'react';

const Job = ({setSearchId,searchId}) => {
  
  const {register,handleSubmit,control,formState:{errors},setValue}=useForm();
  const token=Cookies.get('jwtToken')
  const location=useLocation();
  const customerDetail=location.state;
  const[readOnly,setReadOnly]=React.useState(false);
  const [open,setOpen]=React.useState(false)
  const handleClose=(event,reason)=>{
    if (reason=='clickaway'){
      return;
    }
    setOpen(false)
  }
  const navigate=useNavigate();
  React.useEffect(()=>{
    if(customerDetail){
      console.log("Customer Id :"+customerDetail.project.projectId)
      setReadOnly(true)
      setSearchId(customerDetail.project.projectId)
      setValue('projectTitle',customerDetail.project.projectTitle)
      setValue('customerFirstName',customerDetail.project.customerFirstName)
      setValue('customerLastName',customerDetail.project.customerLastName)
      setValue('customerMobileNumber',customerDetail.project.customerMobileNumber)
      setValue('customerPhoneNumber',customerDetail.project.customerPhoneNumber)
      setValue('customerType',customerDetail.project.customerType)
      setValue('companyName',customerDetail.project.companyName)
      setValue('abnNumber',customerDetail.project.abnNumber)
      setValue('buildingName',customerDetail.buildingName)
      setValue('lotNumber',customerDetail.lotNumber)
      setValue('unitNumber',customerDetail.unitNumber)
      setValue('streetTypeSuffix',customerDetail.streetTypeSuffix)
      setValue('streetName',customerDetail.streetName)
      setValue('streetNumber',customerDetail.streetNumber);
      setValue('suburb',customerDetail.suburb)
      setValue('state',customerDetail.state)
      setValue('postcode',customerDetail.postcode)
      setValue('emailId',customerDetail.project.emailId)
      setValue('systemBrand',customerDetail.project.systemBrand)
    }else{
      console.log("No Customer ID")
    }
  },[])
// * Update Handling Method
  const handleUpdatedData=async(data)=>{
    data.address.project.projectId=searchId;
    const api=`http://localhost:8080/editBasicDetail/${searchId}`
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try{
      console.log("Just Before Request"+config.headers.Authorization)
      const response=await axios.put(api,data,config)
      if(response.status==200){
        setOpen(true)
        setReadOnly(true)
        console.log(response.data)
    
        
      }else{
        console.log("Fail"+response.data)
      }
    
    }
    catch(error){
      console.log("Error from Catch "+error)
    }
  }
  //* Handling Submit Method
  const onSubmit=async(data)=>{
    const dataObject={
      "address":
  {
      
      "project":
      {
          "projectTitle" :data.projectTitle,
          "customerFirstName" : data.customerFirstName,
          "customerLastName" : data.customerLastName,
          "customerPhoneNumber": data.customerPhoneNumber,
          "customerMobileNumber" :data.customerMobileNumber,
          "customerType" :data.customerType ,
          "companyName" : data.companyName,
          "abnNumber":data.abnNumber ,
          "gstRegistered": data.gstRegistered,
          "emailId":data.emailId,
          "systemBrand":data.systemBrand
      },
      "buildingName": data.buildingName,
      "unitNumber" : data.unitNumber,
      "lotNumber" : data.lotNumber,
      "streetNumber" : data.streetNumber,
      "streetName" : data.streetName,
      "streetTypeSuffix": data.streetTypeSuffix,
      "suburb" : data.suburb,
      "state":data.state,
      "postcode":data.postcode
    }
}
    if(searchId){
      console.log("Update Case")
      handleUpdatedData(dataObject)
      return;
    }
    // console.log(data.projectTitle)
    const api="http://localhost:8080/saveBasicDetails"
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
   
console.log(dataObject)
try{
  console.log("Just Before Request"+config.headers.Authorization)
  const response=await axios.post(api,dataObject,config)
  if(response.status==200){
    setOpen(true)
    console.log("Success Project Id"+response.data.address.project.projectId);
      // *Storring Project Id in Cookie
      Cookies.set("projectId",response.data.address.project.projectId);

    
  }else{
    console.log("Fail"+response.data)
  }

}
catch(error){
  console.log("Error from Catch "+error)
}
  }
  const onsubmit=async(e)=>{
    e.preventDefault();
    // console.log("Cookies Token :"+token)
    console.log("Token from Submit :  "+token)
    
    const api="http://localhost:8080/saveBasicDetails"
    console.log("Token above config :  "+token)
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    console.log(config.headers.Authorization)
      const dataObject={
        "address":
    {
        
        "project":
        {
            "projectTitle" :"Pump",
            "customerFirstName" : "Astha",
            "customerLastName" : "Patel",
            "customerPhoneNumber": 9898989898,
            "customerMobileNumber" : 98989898998,
            "customerType" : "xyz",
            "companyName" : "mojo365",
            "abnNumber": 123456,
            "gstRegistered": 45454545
        },
        "buildingName": "abcd",
        "unitNumber" : "123",
        "lotNumber" : "10",
        "streetNumber" : "5",
        "streetName" : "ParkStreet",
        "streetTypeSuffix": "Park",
        "suburb" : "pqr",
        "state":"MP",
        "postcode":"391700"
      }
  }

  try{
    console.log("Just Before Request"+token)
    const response=await axios.post(api,dataObject,config)
    if(response.status==200){
      console.log("Success Project Id"+response.data.address.project.projectId);
      // *Storring Project Id in Cookie
      Cookies.set("projectId",response.data.address.project.projectId);
    }else{
      console.log("Fail"+response.data)
    }

  }
  catch(error){
    console.log("Error from Catch "+error)
  }
}
//* ---------------------------VALIDATION-------------------------------------
  const formValidation={
    projectTitle:{
      required:"Input is required!!!",
      pattern:{
        value:/^[A-Za-z]+$/,
        message:"This input is letters only"
      }
    },
    mobileNumber:{
      required:"Input is Required",
      pattern:{
        value:/^\d{10}$/,
        message:"Input should be number with length 10"
      }
    }
  }
  const handleUpdate=(e)=>{
    e.preventDefault();
    setReadOnly(false)
  }

  return (
  
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
    
{/*------------------------------------- Form Starting-------------------------------- */}
    <form id="job-form" onSubmit={handleSubmit(onSubmit)} >
 
    <div className="col-lg-12">
      <div className="card mb-4">
        <div className="card-body">
          <div className="col-md-12 text-center">
            <h3>
              <b style={{display:readOnly? 'none' : 'block'}}>Create New Job</b>
              <b style={{display:readOnly? 'block' : 'none'}}>JOB ID : {customerDetail?.project?.projectId}</b>
            </h3>
          </div>
        
            <h3 className="h6 mb-4">
              <b>
              Customer Detail
              </b>
            </h3>
            <div className="row">
             
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  {/* <input type="text"  name ="title" className="form-control"{...register("projectTitle",formValidation.projectTitle)}  readOnly={readOnly}/> */}
                  <Controller
                
          name="projectTitle" // This should match the name of the field in your data object
          control={control}
          defaultValue="mr" // Set the default value if needed
          render={({ field }) => (
            <select {...field}
            className="select2 form-control select2-hidden-accessible"
            data-select2-placeholder="Select Customer Type"
            data-select2-id="select2-data-7-809c"
            tabIndex={-1}
            aria-hidden="true"
            disabled={readOnly}
            
            >
              <option value="mr"  >Mr</option>
              <option value="mrs">Mrs</option>
              <option value="miss">Miss</option>
            </select>
          )}
        />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email"  name ="mail" className="form-control"  {...register("emailId")} readOnly={readOnly}/>

                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">First Name</label>
                  <input type="text"  name ="fname" className="form-control"  {...register("customerFirstName",formValidation.projectTitle)} readOnly={readOnly}/>
                  {errors?.customerFirstName?.type==='pattern' && (<small className='errorMsg'>{formValidation.projectTitle.pattern.message}</small>) } 
                  {errors?.customerFirstName?.type==='required' && (<small className='errorMsg'>{formValidation.projectTitle.required}</small>) } 
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Last Name</label>
                  <input type="text"  name ="lname" className="form-control" {...register("customerLastName",formValidation.projectTitle)} readOnly={readOnly}/>
                  {errors?.customerLastName?.type==='pattern' && (<small className='errorMsg'>{formValidation.projectTitle.pattern.message}</small>) } 
                  {errors?.customerLastName?.type==='required' && (<small className='errorMsg'>{formValidation.projectTitle.required}</small>) } 
                </div>
              </div>
            </div>
            <div className="row">
              
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input type="text"  name ="mobileNo" className="form-control" {...register("customerMobileNumber",formValidation.mobileNumber)} readOnly={readOnly}/>
                  {errors?.customerMobileNumber?.type==='pattern' && (<small className='errorMsg'>{formValidation.mobileNumber.pattern.message}</small>) } 
                  {errors?.customerMobileNumber?.type==='required' && ( <small className='errorMsg'>{formValidation.mobileNumber.required}</small>) } 
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text"  name ="mobileNo" className="form-control" {...register("customerPhoneNumber",formValidation.mobileNumber)} readOnly={readOnly}/>
                  {errors?.customerPhoneNumber?.type==='pattern' && (<small className='errorMsg'>{formValidation.mobileNumber.pattern.message}</small>) } 
                  {errors?.customerPhoneNumber?.type==='required' && ( <small className='errorMsg'>{formValidation.mobileNumber.required}</small>) } 
                </div>
              </div>
            </div>
            
            <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                {/* ----------------CUSTOMER TYPE------------------------- */}
            <label className="form-label">Customer Type</label>
                <Controller
                
          name="customerType" // This should match the name of the field in your data object
          control={control}
          defaultValue="business" // Set the default value if needed
          render={({ field }) => (
            <select {...field}
            className="select2 form-control select2-hidden-accessible"
            data-select2-placeholder="Select Customer Type"
            data-select2-id="select2-data-7-809c"
            tabIndex={-1}
            aria-hidden="true"
            disabled={readOnly}
            >
              <option value="business"  >Business</option>
              <option value="residential">Residential</option>
            </select>
          )}
        />







                
                <span
                  className="select2 select2-container select2-container--bootstrap-5"
                  dir="ltr"
                  data-select2-id="select2-data-8-3peu"
                  style={{ width: 391 }}
                >
                  <span className="selection">
                    <span
                      className="select2-selection select2-selection--single"
                      role="combobox"
                      aria-haspopup="true"
                      aria-expanded="false"
                      tabIndex={0}
                      aria-disabled="false"
                      aria-labelledby="select2-jdfi-container"
                      aria-controls="select2-jdfi-container"
                    >
                      <span
                        className="select2-selection__rendered"
                        id="select2-jdfi-container"
                        role="textbox"
                        aria-readonly="true"
                        title="Select city"
                      >
                        <span className="select2-selection__placeholder">
                   
                        </span>
                      </span>
                      <span
                        className="select2-selection__arrow"
                        role="presentation"
                      >
                        <b role="presentation" />
                      </span>
                    </span>
                  </span>
                  <span className="dropdown-wrapper" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label className="form-label">Company Name</label>
                <input type="text"  name ="companyName" className="form-control" {...register("companyName",formValidation.projectTitle)} readOnly={readOnly}/>
                {errors?.companyName?.type==='pattern' && (<small className='errorMsg'>{formValidation.projectTitle.pattern.message}</small>) } 
                  {errors?.companyName?.type==='required' && (<small className='errorMsg'>{formValidation.projectTitle.required}</small>) } 
              </div>
            </div>
            
            </div>
            
            <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                {/* --------------GST Registered------------------ */}
                <label className="form-label">GST Registered</label>
                <Controller
          name="gstRegistered" // This should match the name of the field in your data object
          control={control}
          defaultValue="yes" // Set the default value if needed
          render={({ field }) => (
            <select {...field}
            className="select2 form-control select2-hidden-accessible"
            data-select2-placeholder="Select Customer Type"
            data-select2-id="select2-data-7-809c"
            tabIndex={-1}
            aria-hidden="true"
            disabled={readOnly}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          )}
        />





                
                <span
                  className="select2 select2-container select2-container--bootstrap-5"
                  dir="ltr"
                  data-select2-id="select2-data-8-3peu"
                  style={{ width: 391 }}
                >
                  <span className="selection">
                    <span
                      className="select2-selection select2-selection--single"
                      role="combobox"
                      aria-haspopup="true"
                      aria-expanded="false"
                      tabIndex={0}
                      aria-disabled="false"
                      aria-labelledby="select2-jdfi-container"
                      aria-controls="select2-jdfi-container"
                    >
                      <span
                        className="select2-selection__rendered"
                        id="select2-jdfi-container"
                        role="textbox"
                        aria-readonly="true"
                        title="Select city"
                      >
                        <span className="select2-selection__placeholder">
                   
                        </span>
                      </span>
                      <span
                        className="select2-selection__arrow"
                        role="presentation"
                      >
                        <b role="presentation" />
                      </span>
                    </span>
                  </span>
                  <span className="dropdown-wrapper" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label className="form-label">ABN</label>
                <input type="text" className="form-control" {...register("abnNumber")} readOnly={readOnly}/>
              </div>
            </div>
            
            
            </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-3">
                  <label className="form-label">System Brand</label>
                <input type="text" className="form-control" {...register("systemBrand")} readOnly={readOnly}/>
                  </div>
                </div>
              </div>

            <div className="row">
              {/* Product Options dropdown */}
            {/* <div className="col-lg-6">
              <div className="mb-3">
                <label className="form-label">Select Product</label>
                <Controller
          name="productName" // This should match the name of the field in your data object
          control={control}
          defaultValue="hotwater" // Set the default value if needed
          render={({ field }) => (
            <select {...field}
            className="select2 form-control select2-hidden-accessible"
            data-select2-placeholder="Select Customer Type"
            data-select2-id="select2-data-7-809c"
            tabIndex={-1}
            aria-hidden="true"
            >
              <option value="hotwater" >HotWater</option>
              <option value="coldwater">ColdWater</option>
            </select>
          )}
        />
                <span
                  className="select2 select2-container select2-container--bootstrap-5"
                  dir="ltr"
                  data-select2-id="select2-data-8-3peu"
                  style={{ width: 391 }}
                >
                  <span className="selection">
                    <span
                      className="select2-selection select2-selection--single"
                      role="combobox"
                      aria-haspopup="true"
                      aria-expanded="false"
                      tabIndex={0}
                      aria-disabled="false"
                      aria-labelledby="select2-jdfi-container"
                      aria-controls="select2-jdfi-container"
                    >
                      <span
                        className="select2-selection__rendered"
                        id="select2-jdfi-container"
                        role="textbox"
                        aria-readonly="true"
                        title="Select city"
                      >
                        <span className="select2-selection__placeholder">
                   
                        </span>
                      </span>
                      <span
                        className="select2-selection__arrow"
                        role="presentation"
                      >
                        <b role="presentation" />
                      </span>
                    </span>
                  </span>
                  <span className="dropdown-wrapper" aria-hidden="true" />
                </span>
              </div>
            </div> */}
            <div className="col-lg-6">
              {/* Wiring Work Needed Dropdown */}
              {/* <div className="mb-3">
                <label className="form-label">System required wiring working?</label>
                <Controller
          name="isWireWork" // This should match the name of the field in your data object
          control={control}
          defaultValue="yes" // Set the default value if needed
          render={({ field }) => (
            <select {...field}
            className="select2 form-control select2-hidden-accessible"
            data-select2-placeholder="Select Customer Type"
            data-select2-id="select2-data-7-809c"
            tabIndex={-1}
            aria-hidden="true"
            >
              <option value="yes" >Yes</option>
              <option value="no">No</option>
            </select>
          )}
        />
                <span
                  className="select2 select2-container select2-container--bootstrap-5"
                  dir="ltr"
                  data-select2-id="select2-data-8-3peu"
                  style={{ width: 391 }}
                >
                  <span className="selection">
                    <span
                      className="select2-selection select2-selection--single"
                      role="combobox"
                      aria-haspopup="true"
                      aria-expanded="false"
                      tabIndex={0}
                      aria-disabled="false"
                      aria-labelledby="select2-jdfi-container"
                      aria-controls="select2-jdfi-container"
                    >
                      <span
                        className="select2-selection__rendered"
                        id="select2-jdfi-container"
                        role="textbox"
                        aria-readonly="true"
                        title="Select city"
                      >
                        <span className="select2-selection__placeholder">
                   
                        </span>
                      </span>
                      <span
                        className="select2-selection__arrow"
                        role="presentation"
                      >
                        <b role="presentation" />
                      </span>
                    </span>
                  </span>
                  <span className="dropdown-wrapper" aria-hidden="true" />
                </span>
              </div> */}

            </div>
            
            </div>
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h6 mb-4">
            <b>
             Property Address
            </b>
          </h3>
          <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Building Name</label>
                  <input type="text"  name ="buildingName" className="form-control" {...register("buildingName",{required:true})} readOnly={readOnly} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Lot No</label>
                  <input type="number"  name ="lotNo" className="form-control" {...register("lotNumber")} readOnly={readOnly} />
                </div>
              </div>
            </div>
            <div className="row">
             
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Unit No</label>
                  <input type="number"  name ="unitNo" className="form-control" {...register("unitNumber")} readOnly={readOnly}/>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Street Type</label>
                  <input type="number"  name ="streetType" className="form-control" {...register("streetTypeSuffix")} readOnly={readOnly}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Street Name</label>
                  <input type="text" name ="streetName"  className="form-control" {...register("streetName")} readOnly={readOnly} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Street No</label>
                  <input type="number" name ="streetNo" className="form-control" {...register("streetNumber")} readOnly={readOnly}/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label className="form-label">Suburb</label>
                  <input type="text" name ="streetName"  className="form-control" {...register("suburb")} />
                </div>
              </div>
              
              
            </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <label className="form-label">State</label>
               {/* States Field */}
               <Controller
          name="state" // This should match the name of the field in your data object
          control={control}
          defaultValue="NewSouthVales" // Set the default value if needed
          render={({ field }) => (
            <select {...field}
            className="select2 form-control select2-hidden-accessible"
            data-select2-placeholder="Select Customer Type"
            data-select2-id="select2-data-7-809c"
            tabIndex={-1}
            aria-hidden="true"
            disabled={readOnly}
            >
              <option value="NewSouthVales">New South Vales</option>
              <option value="Victoria">Victoria</option>
              <option value="Queensland">Queensland</option>
              <option value="WesternAustralia">Western Australia</option>

            </select>
          )}
        />

                <span
                  className="select2 select2-container select2-container--bootstrap-5"
                  dir="ltr"
                  data-select2-id="select2-data-8-3peu"
                  style={{ width: 391 }}
                >
                  <span className="selection">
                    <span
                      className="select2-selection select2-selection--single"
                      role="combobox"
                      aria-haspopup="true"
                      aria-expanded="false"
                      tabIndex={0}
                      aria-disabled="false"
                      aria-labelledby="select2-jdfi-container"
                      aria-controls="select2-jdfi-container"
                    >
                      <span
                        className="select2-selection__rendered"
                        id="select2-jdfi-container"
                        role="textbox"
                        aria-readonly="true"
                        title="Select State"
                      >
                        <span className="select2-selection__placeholder">
                          Select State
                        </span>
                      </span>
                      <span
                        className="select2-selection__arrow"
                        role="presentation"
                      >
                        <b role="presentation" />
                      </span>
                    </span>
                  </span>
                  <span className="dropdown-wrapper" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label className="form-label">Post code</label>
                <input type="number" name="postCode" className="form-control" {...register("postcode")} readOnly={readOnly}/>
              </div>
            </div>
            <div className="container">
              <div className="col-md-12 text-center">
                <button 
                className="btn btn-light btn-medium-3 btn-icon-text"
                disabled={!readOnly}  
                onClick={(e)=>handleUpdate(e)}
                style={{ marginRight: '10px' }}>
                  {/* ------------------SAVE-------------------------- */}
                  <i className="bi bi-x" /> <span className="text">Update</span>
                </button>
                {/* -------------------SUBMIT-------------------------------- */}
                <button className="btn btn-primary btn-medium btn-icon-text" type='submit' disabled={readOnly}>
                  <i className="bi bi-save" /> <span className="text" >Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
          Project created successfully
        </Alert>
      </Snackbar>
  </Box>
  );
};

export default Job;
