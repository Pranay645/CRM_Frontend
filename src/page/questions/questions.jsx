import 'bootstrap/dist/css/bootstrap.css';
import React,{useState} from 'react';
import { Box } from "@mui/material";
import {FormControlLabel,Radio,RadioGroup} from '@mui/material'
import './../questions/questions.css'
import {useForm,Controller} from 'react-hook-form'
import Cookies from 'js-cookie';
import axios from 'axios';

const Questions = () => {
    const {register,handleSubmit,control}=useForm();
    const[addressFile,setAddressFile]=useState(null)
    const[preInstallationImage,setPreInstallationImage]=useState(null)
    const[oldUnitImage,setOldUnitImage]=useState(null)
    const[oldCompliance,setOldCompliance]=useState(null)
    const[lightBill,setLightBill]=useState(null)

    const fileAsByteStream=async(file)=>{
      return new Promise((resolve,reject)=>{
          const reader=new FileReader();
          reader.onload = (event) => {
              resolve(event.target.result);
          };
  
          reader.onerror = (err) => {
              reject(err);
          };
  
          reader.readAsBinaryString(file);
      })
  }

    const onSumbit=async(data)=>{

        console.log(data);
      const newValue={
  
        "signedNominationFormPast": "string",
        "buildingType": "string",
        "occupyByBusiness": "string",
        "titleOfCustomer": "string",
        "fullNameOfCustomer": "string",
        "quotingFor": "string",
        "typeOldSystem": "string",
        "replaceAirSource": "string",
        "solarWaterHeater": "string",
        "gasReplaceAirSource": "string",
      "gasSolarWaterHeaterElectricBoosted": "string",
        "gasSolarWaterHeaterGasBoosted": "string",
        "paid":"string"
      }

      const projectId=Cookies.get('projectId')
      console.log("ProjectId :"+projectId)
      const token=Cookies.get("jwtToken")
      const api="http://localhost:8080/save-question"
    // console.log("Token above config :  "+token)
    const config = {
      headers: { "Authorization": `Bearer ${token}`,"Content-Type":"multipart/form-data","Accept":'application/json' }
    };
    let fdata=new FormData();
    fdata.append('outsidePremisesSignage',preInstallationImage);
    fdata.append('currentHWUnitCompliancePlate',oldCompliance);
    fdata.append('currentHWUnit',oldUnitImage);
    fdata.append('beforeInstallation',preInstallationImage)
    fdata.append('electricityBill',lightBill)
    // fdata.append(lightBill,'electricityBill')
    const uploadQuestions={
      ...data
    }
    fdata.append('uploadQuestions',JSON.stringify(data))
    // fdata.append('projectId',projectId)
    fdata.append('projectId',projectId)
    const formDataObject={}
    fdata.forEach((value,key)=>{formDataObject[key]=value})
    
      // console.log(data);
     const newData={
      
      ...formDataObject
      
        // outsidePremisesSignage:preInstallationImage,
        // currentHWUnitCompliancePlate:oldCompliance,
        // currentHWUnit:oldUnitImage,
        // beforeInstallation:preInstallationImage,
        // electricityBill:lightBill,
      
     }
    //  console.log("NewData"+newData)
    //  fdata.forEach((key,value)=>{console.log(key,value)})
    //  console.log(formDataObject)
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


  return (

<Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
<div>
  {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" /> */}
    
      <div className="col-lg-12">
        <div className="card p-3">
          <form onSubmit={handleSubmit(onSumbit)}>
          
         
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
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
              control={<Radio />}
              label="Residential"
            />
            <FormControlLabel
              value="business"
              control={<Radio />}
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Geo-tagged photo installation environment  before the product is installed(including exsitng product replaced if applicable)?*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="preInstalledImage" onChange={(e)=>setPreInstallationImage(e.target.files[0])} />
                <label className="input-group-text" htmlFor="preInstalledImage">Choose File</label>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Geo-tagged photo of the current (OLD) HW unit(in situ)*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="document" onChange={(e)=>setOldUnitImage(e.target.files[0])} />
                <label className="input-group-text" htmlFor="document">Choose File</label>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Geo-tagged photo of the current (OLD) HW unit compilance plate (showing brand and model)*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="document" onChange={(e)=>(setOldCompliance(e.target.files[0]))} />
                <label className="input-group-text" htmlFor="document">Choose File</label>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Please take a photo of the electricity bill<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="bill" onChange={(e)=>{setLightBill(e.target.files[0])}}/>
                <label className="input-group-text" htmlFor="bill">Electricity Bill</label>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">What is the postion or title of the Customer that will sign the Nomination Form?*</label>
              </div>
              <input type="text" className="form-control" id="inputtitle" {...register("titleOfCustomer")} />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">What is the full name of the Customer that will sign the Nomination Form?*</label>
              </div>
              <input type="text" className="form-control" id="inputname" {...register("fullNameOfCustomer")} />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Please take a photo of the outside of premise including signage if possible*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="document" />
                <label className="input-group-text" htmlFor="document">Choose File</label>
              </div>
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
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
              control={<Radio />}
              label="Gas"
            />
            <FormControlLabel
              value="electric"
              control={<Radio />}
              label="Electric"
            />
            <FormControlLabel
              value="solar"
              control={<Radio />}
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
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
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
        )}
      />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
    </Box>
  );
};

export default Questions;
