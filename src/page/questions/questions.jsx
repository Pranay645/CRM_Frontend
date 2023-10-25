import 'bootstrap/dist/css/bootstrap.css';
import React,{useState} from 'react';
import { Box } from "@mui/material";
import {FormControlLabel,Radio,RadioGroup} from '@mui/material'
import './../questions/questions.css'
import {useForm,Controller} from 'react-hook-form'
import Cookies from 'js-cookie';
import FileDownload from 'js-file-download';
import axios from 'axios';
import { useEffect } from 'react';
import FileInput from './FileInput';

const Questions = ({searchId}) => {
    const {register,handleSubmit,control,setValue}=useForm();
    const[addressFile,setAddressFile]=useState(null)
    const[preInstallationImage,setPreInstallationImage]=useState(null)
    const[oldUnitImage,setOldUnitImage]=useState(null)
    const[oldCompliance,setOldCompliance]=useState(null)
    const[lightBill,setLightBill]=useState(null)
    const[request,setRequest]=useState(false)
    const[viewMode,setViewMode]=useState(false)
    const[premiseSignage,setPremiseSignage]=useState(null)
    const [uploadedImage, setUploadedImage] = useState(null);
    const[lat,setLat]=useState(null);
    const[lon,setLon]=useState(null)
    const[questionId,setQuestionId]=useState(null)
    let ext=null;

    //*Add Black Strip to Before Installation Image
    const handlePreInstallationImage=async(file)=>{
      // e.preventDefault();
      // const file=e.target.files[0];
      const reader = new FileReader();
  
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
          ctx.fillText(`Longitude: ${lon}__Latitude: ${lat}__Time: 23:23:12__Date:2002-12-12`, 10, uploadedImage.height + 30);
  
          // Draw the uploaded image on top
          ctx.drawImage(uploadedImage, 0, 0);
          canvas.toBlob(async(blob)=>{
            const editedFile=new File([blob],file.name.split('.')[0],{type:'image/jpeg'})

            setPreInstallationImage(editedFile)
          },'image/jpeg')
          
            
          const editedImage = canvas.toDataURL('image/jpeg');
  
          setUploadedImage(editedImage);
        };
      };
  
      reader.readAsDataURL(file);
    };
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
        navigator.geolocation.getCurrentPosition((position)=>{
          setLat(position.coords.latitude)
          setLon(position.coords.longitude)
          console.log(lat)
          console.log(lon)
        })
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
    // fdata.append('outsidePremisesSignage',premiseSignage);
    // fdata.append('currentHWUnitCompliancePlate',oldCompliance);
    // fdata.append('currentHWUnit',oldUnitImage);
    // fdata.append('beforeInstallation',preInstallationImage)
    // fdata.append('electricityBill',lightBill)
    // fdata.append(lightBill,'electricityBill')
    fdata.append('uploadQuestions',JSON.stringify(data))
    fdata.append('projectId',projectId)
    // fdata.append('questionId',questionId)
    const formDataObject={}
    fdata.forEach((value,key)=>{formDataObject[key]=value})
    console.log(formDataObject)
      console.log(data);
     
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

const downloadFile=async(e,fileName)=>{
  e.preventDefault();
  const api=`http://localhost:8080/questions/${fileName}?projectId=${searchId}`
  const token=Cookies.get('jwtToken')
  const config = {
    headers: { "responseType":'blob',"Authorization": `Bearer ${token}` 
  }
  }
  fetch(`http://localhost:8080/questions/${fileName}?projectId=${searchId}`)
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
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
   a.style.display = 'none';
   a.href = url;
   // the filename you want
   a.download = `${fileName}.${ext}`;
   document.body.appendChild(a);
   a.click();
   window.URL.revokeObjectURL(url);
   // or you know, something with better UX...
  //  alert('your file has downloaded!'); 
 })
 .catch(() => alert('oh no!'));

//   try{
//     const response =await axios.get(api,config)
//     console.log(response.headers.get('Content-Type'))
//   const blob = new Blob([response.data]);
//   const href = window.URL.createObjectURL(blob);
//   const anchorElement = document.createElement('a');
//   anchorElement.href = href;
//   // anchorElement.setAttribute('download', `${document}.${response.headers['content-type'].split('/')[1]}`);

//   // anchorElement.download = `${fileName}.png`;
//   anchorElement.setAttribute('download',`${fileName}.png`)
//   document.body.appendChild(anchorElement);
//   anchorElement.click();
//   anchorElement.remove()
//   // document.body.removeChild(anchorElement);
//   // window.URL.revokeObjectURL(href);
//   setTimeout(function(){
//     // document.body.removeChild(anchorElement);
//     // window.URL.revokeObjectURL(href);  
// }, 100);  
//   }catch(E){
//     console.log("Message"+E)
//   }
  // try{
  //       const response=await axios.get(`http://localhost:8080/questions/${fileName}?projectId=${searchId}`,config)
  //   if(response.status==200){
  //     console.log("File Reieved Sucessfully");
  //     // try{

  //     //   FileDownload(response.data,`${fileName}.png`)
  //     // }catch(E){
  //     //   console.error(E)
  //     // }
  //     try{
  //       // console.log(response.headers.get('Content-Type'))
  //     const blob = new Blob([response.data]);
  //     // const file = new File([response.data], 'filename.png', {type: 'image/png'});
  //     const href = window.URL.createObjectURL(blob);
  //     const anchorElement = document.createElement('a');
  //     anchorElement.href = `http://localhost:8080/questions/${fileName}?projectId=${searchId}`;
  //     // anchorElement.setAttribute('download', `${document}.${response.headers['content-type'].split('/')[1]}`);

  //     anchorElement.download = `${fileName}.png`;
  //     document.body.appendChild(anchorElement);
  //     anchorElement.click();
  //     // document.body.removeChild(anchorElement);
  //     // window.URL.revokeObjectURL(href);
  //     setTimeout(function(){
  //       document.body.removeChild(anchorElement);
  //       window.URL.revokeObjectURL(href);  
  //   }, 100);  
  //     }catch(E){
  //       console.log("Message"+E)
  //     }
      
  //   }else{
  //     throw new Error("Error Downloading File")
  //   }
  // }catch(E){
  //   console.log("Error Sending File Request")
  // }
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
              <input disabled={viewMode} type="text" className="form-control" id="inputtitle" {...register("titleOfCustomer")} />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">What is the full name of the Customer that will sign the Nomination Form?*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputname" {...register("fullNameOfCustomer")} />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Serial Number of Tank :*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputname" {...register("tankSerialNumber")} />
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Volumetric Capacity of Tank :*</label>
              </div>
              <input disabled={viewMode} type="text" className="form-control" id="inputname" {...register("volumetricCapacity")} />
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
                <label className="fw-bold mb-0">Geo-tagged photo installation environment  before the product is installed(including exsitng product replaced if applicable)?*<label>
                  </label></label></div>
              <div className="input-group" >
                {/* <input type="file" accept="image/*"className="form-control" id="preInstalledImage" onChange={(e)=>handlePreInstallationImage(e.target.files[0])}  /> */}
                <FileInput onFileUpload={handlePreInstallationImage}/>
                <label className="input-group-text" htmlFor="preInstalledImage">Choose File</label>
                {/* {generateDownloadLink(preInstallationImage)} */}
                <button 
                className='btn btn-primary'
                style={{visibility:viewMode?"visible":'hidden'}}
                onClick={e=>downloadFile(e,'beforeinstallation')}
                >
                Download
                </button>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Geo-tagged photo of the current (OLD) HW unit(in situ)*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="oldUnitImage" onChange={(e)=>setOldUnitImage(e.target.files[0])} />
                <label className="input-group-text" htmlFor="oldUnitImage">Choose File</label>
                <div className='btn btn-primary' 
                style={{visibility:viewMode?"visible":'hidden'}}
                onClick={e=>downloadFile(e,'currenthwunit')}

                >Download</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Geo-tagged photo of the current (OLD) HW unit compilance plate (showing brand and model)*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="oldCompliance" onChange={(e)=>(setOldCompliance(e.target.files[0]))} />
                <label className="input-group-text" htmlFor="oldCompliance">Choose File</label>
                <div className='btn btn-primary' style={{visibility:viewMode?"visible":'hidden'}}
                     onClick={e=>downloadFile(e,'currentHWUnitCompliancePlate')}
                >Download</div>

              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Please take a photo of the electricity bill<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="bill" onChange={(e)=>{setLightBill(e.target.files[0])}}/>
                <label className="input-group-text" htmlFor="bill">Electricity Bill</label>
                <div className='btn btn-primary' style={{visibility:viewMode?"visible":'hidden'}}
                onClick={e=>downloadFile(e,'electricitybill')}

                >Download</div>

              </div>
            </div>
           
            <div className="mb-4">
              <div className="d-flex align-items-center">
                <label className="fw-bold mb-0">Please take a photo of the outside of premise including signage if possible*<label>
                  </label></label></div>
              <div className="input-group">
                <input type="file" className="form-control" id="premiseSignage" onChange={(e)=>setPremiseSignage(e.target.files[0])}/>
                <label className="input-group-text" htmlFor="premiseSignage">Choose File</label>
                <div className='btn btn-primary' style={{visibility:viewMode?"visible":'hidden'}}
                  onClick={e=>downloadFile(e,'outsidePremisesSignage')}
                >Download</div>

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
        </div>
      </div>
    </div>
    </Box>
  );
};

export default Questions;
