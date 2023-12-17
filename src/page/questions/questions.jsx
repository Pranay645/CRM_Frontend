import 'bootstrap/dist/css/bootstrap.css';
import React,{useState} from 'react';
// import { Box } from "@mui/material";
import { Box,Snackbar } from '@mui/material';
import { Alert } from 'react-bootstrap';

import {FormControlLabel,Radio,RadioGroup} from '@mui/material'
import './../questions/questions.css'
import {useForm,Controller} from 'react-hook-form'
import Cookies from 'js-cookie';
import FileDownload from 'js-file-download';
import axios from 'axios';
import { useEffect } from 'react';
import FileInput from './FileInput';

const Questions = ({searchId}) => {
    const {register,handleSubmit,control,setValue,formState:{errors}}=useForm();
    
    const[request,setRequest]=useState(false)
    const[viewMode,setViewMode]=useState(false)
    const [open,setOpen]=React.useState(false)
  const handleClose=(event,reason)=>{
    if (reason=='clickaway'){
      return;
    }
    setOpen(false)
  }
  
    
    const[questionId,setQuestionId]=useState(null)
    let ext=null;

    
   
    React.useEffect(()=>{
      
      if(searchId){
        setViewMode(true)
        const token=Cookies.get('jwtToken')
        const config = {
          headers: { "Authorization": `Bearer ${token}` }
        };
        const fetchDetails=async(id)=>{
          try{
            console.log("Token from Questions "+token)
            const response=await axios.get(`http://localhost:8080/questions?projectId=${id}`,config)
            if(response.status==200){
               

              console.log("Data Fetched Sucesfully");
              console.log(response.data)
              console.log("Data :"+response.data.questionId)
              setValue('signedNominationFormPast',response.data.signedNominationFormPast)
              setValue('buildingType',response.data.buildingType)
              setValue('occupyByBusiness',response.data.occupyByBusiness)
              setValue('titleOfCustomer',response.data.titleOfCustomer)
              setValue('fullNameOfCustomer',response.data.fullNameOfCustomer)
              setValue('quotingFor',response.data.quotingFor)
              setValue('typeOldSystem',response.data.typeOldSystem)
              setValue('replaceAirSource',response.data.replaceAirSource)
              setValue('solarWaterHeater',response.data.solarWaterHeater)
              setValue('gasReplaceAirSource',response.data.gasReplaceAirSource)
              setValue('gasSolarWaterHeaterElectricBoosted',response.data.gasSolarWaterHeaterElectricBoosted)
              setValue('gasSolarWaterHeaterGasBoosted',response.data.gasSolarWaterHeaterGasBoosted)
              setValue('paid',response.data.paid)
              setValue('tankSerialNumber',response.data.tankSerialNumber);
              setValue('volumetricCapacity',response.data.volumetricCapacity)
              setQuestionId(response.data.questionId)

            }else{
              console.log("Error Recieving Response");
              console.log("Response Status"+response.status)
              console.log("Response Text"+response.statusText)
            }

          }
          catch(E){
            console.log("Error Sending Request"+E)
          }
        }
        
          fetchDetails(searchId)
          // setRequest(false)
        

      }else{
        
      }
      
      return()=>{
          
      }
    },[])
    const onSubmit=async(data)=>{
      let projectId=null

      if(searchId){
        projectId=searchId;
        data['questionId']=questionId;
        
      }else{
        projectId=Cookies.get('projectId')

      }
      console.log("ProjectId :"+projectId)
      const token=Cookies.get("jwtToken")
      const api="http://localhost:8080/save-question"
    // console.log("Token above config :  "+token)
    const config = {
      headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
    };
    let fdata=new FormData();
   
    fdata.append('uploadQuestions',JSON.stringify(data))
    fdata.append('projectId',projectId)
    const formDataObject={}
    fdata.forEach((value,key)=>{formDataObject[key]=value})
    console.log(formDataObject)
      console.log(data);
     
     try{
      const response= await axios.post(api,formDataObject,config);
      if(response.status==200){
           setOpen(true)

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


const handleUpdate=(e)=>{
  e.preventDefault();
  setViewMode(false);
}

  return (

<Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
<div>
  {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" /> */}
    
      <div className="col-lg-12">
        <div className="card p-3">
          <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">What is the postion or title of the Customer that will sign the Nomination Form?*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputtitle" {...register("titleOfCustomer")} placeholder='Director/Mr'/>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">What is the full name of the Customer that will sign the Nomination Form?*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputname" {...register("fullNameOfCustomer")} placeholder='John Williamson' />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Serial Number of Tank :*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputname" {...register("tankSerialNumber",{required:'This Field is required',pattern:{value:/^\d{6}$/,message:"Serial Number should be 6 digit number"}})} placeholder='983911'/>
            </div>
            {errors?.tankSerialNumber?.type==='pattern' && (<small className='errorMsg'>{errors.tankSerialNumber?.message}</small>) } 
                  {errors?.tankSerialNumber?.type==='required' && (<small className='errorMsg'>{errors.tankSerialNumber?.message}</small>) }
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Volumetric Capacity of Tank (in Litres):*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputname" {...register("volumetricCapacity",{required:'This Field is required',pattern:{value:/^[1-9]\d{3,5}$/,message:"Capacity should be between 1000 and 1000000 Litres"}})} placeholder='50,000'/>

              {errors?.volumetricCapacity?.type==='pattern' && (<small className='errorMsg'>{errors.volumetricCapacity?.message}</small>) } 
                  {errors?.volumetricCapacity?.type==='required' && (<small className='errorMsg'>{errors.volumetricCapacity?.message}</small>) }
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Have you signed a nomination form for the energy savings arising from this activity in the past*</label>
              </div>
              <Controller
        name="signedNominationFormPast"
        control={control}
       

        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="NominationSigned"
            {...field}
            className='QuestionRadioGroup'
            
          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode} />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode} />}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
          
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Is the site Residential Building or Business Building?*</label>
              </div>
              <Controller
        name="buildingType"
        control={control}
        defaultValue="residential" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="buildingType"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="residential"
              control={<Radio disabled={viewMode} />}
              label="Residential"
            />
            <FormControlLabel
              value="business"
              control={<Radio disabled={viewMode}/>}
              label="Business"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Is the entirely occupied by the business?*</label>
              </div>
              <Controller
        name="occupyByBusiness"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="businessOccupied"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode} />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode} />}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            

           
            
           
            

            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Are you quoting/replacing Hot Water System?*</label>
              </div>
              <Controller
        name="quotingFor"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="quotingFor"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode} />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode} />}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Type of Old System*</label>
              </div>
              <Controller
        name="typeOldSystem"
        control={control}
        defaultValue="gas" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="businessOccupied"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="gas"
              control={<Radio disabled={viewMode} />}
              label="Gas"
            />
            <FormControlLabel
              value="electric"
              control={<Radio disabled={viewMode} />}
              label="Electric"
            />
            <FormControlLabel
              value="solar"
              control={<Radio  disabled={viewMode}/>}
              label="Solar"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Replace and existing electric water heater with an air source heat pump water heater*</label>
              </div>
              <Controller
        name="replaceAirSource"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="ReplaceExistingElectricThing"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode}/>}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode}/>}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Replace and existing electric water heater with a solar(electric boosted) water heater*</label>
              </div>
              <Controller
        name="gasSolarWaterHeaterElectricBoosted"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="replaceExistingWithSolar"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode}/>}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode}/>}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Replace and existing gas water heater with an air source heat pump water heater*</label>
              </div>
              <Controller
        name="gasReplaceAirSource"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="replaceExistingWithSolar"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode} />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode}/>}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Replace an existing gas water heater with a solar(gas boosted) water heater*</label>
              </div>
              <Controller
        name="gasSolarWaterHeaterGasBoosted"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="replaceExistingWithSolar"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode}/>}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode}/>}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Has the Customer paid for the installation?*</label>
              </div>
              <Controller
        name="paid"
        control={control}
        defaultValue="no" // Set your initial/default value here
        render={({ field }) => (
          <RadioGroup
            aria-label="InstallationPaymentStatus"
            {...field}
            className='QuestionRadioGroup'

          >
            <FormControlLabel
              value="yes"
              control={<Radio disabled={viewMode}/>}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio disabled={viewMode}/>}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="container">
              <div className="col-md-12 text-center">
            <button type="submit" className="btn btn-primary mt-3" disabled={viewMode}>Submit</button>
            <button 
                className="btn btn-light btn-medium-3 btn-icon-text"
                disabled={!viewMode}  
                onClick={(e)=>handleUpdate(e)}
                // onClick={(e)=>handleUpdate(e)}
                style={{ marginRight: '10px' }}>
                  {/* ------------------SAVE-------------------------- */}
                  <i className="bi bi-x" /> <span className="text">Update</span>
                </button>
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
          Questions Uploaded/Updated Succesfully
        </Alert>
      </Snackbar>
        </div>
      </div>
    </div>
    </Box>
  );
};

export default Questions;
