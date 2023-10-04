import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Alert, Button, Form, Col, Row } from "react-bootstrap";
import Header from "./../../components/Header";
import { Snackbar } from "@mui/material";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";

const regEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const data = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "salesman",
    label: "Salesman",
  },
  {
    value: "installer",
    label: "Installer",
  },
];

const UserForm = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset
  } = useForm();

  const [open, setOpen] = React.useState(false);

  

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onSubmit = async(data) => {
    const token=Cookies.get("jwtToken")
    console.log("Token from Create User"+token)
    const api="http://localhost:8080/admin/users/create"
  // console.log("Token above config :  "+token)
  const config = {
    headers: { "Authorization": `Bearer ${token}`,'Content-Type':"application/json"}
  };

   
    const modifiedData={
      // "userId": 0,
      "userName": data.firstName+data.lastName,
      "userEmail": data.userEmail,
      "userPassword": data.userPassword,
      "userRole": data.userRole
    }
    console.log(modifiedData)
    try{
      const response=await axios.post(api,modifiedData,config);

      if(response.status==200){
        setOpen(true);
        console.log("User Created Sucessfully")
        console.log("Response :"+response.data)
        reset()
        
      }else{
        console.log("Error Recieving Response")
      }
    }catch(e){
      console.log("Error Sending Request :"+e)
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 2 }}>
      <Header title="CREATE USER" subTitle="Create a New User Profile" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter FirstName" {...register("firstName",{required:true,minLength:3})} />
              {errors?.firstName && (
                <Form.Control.Feedback type="invalid">
                  This field is required & min 3 characters.
                </Form.Control.Feedback>
              )}
              {/* <Form.Control.Feedback type="invalid">
              {errors?.firstName && errors.firstName.message}
              </Form.Control.Feedback> */}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Last Name..." {...register("lastName",{required:true,minLength:3})} />

              {errors?.lastName && (
                <Form.Control.Feedback type="invalid">
                  This field is required & min 3 characters.
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
        <Form.Label style={{ marginTop: '10px' }}>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter Email" {...register("userEmail",{required:true,pattern:regEmail})} />

          {errors?.userEmail && (
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label style={{ marginTop: '10px' }}>Password</Form.Label>
          <Form.Control type="text" placeholder="Enter Password" {...register("userPassword",{required:true,minLength:8})} />

          {errors?.userPassword && (
            <Form.Control.Feedback type="invalid">
              Please provide a valid phone number.
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label style={{ marginTop: '10px' }}>Role</Form.Label>
          <Controller
            name="userRole"
            control={control}
            defaultValue="salesman"
            render={({ field }) => (
              <Form.Select {...field}>
                {data.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            )}
          />
        </Form.Group>

        <div className="text-right">
          <Button
            type="submit"
            style={{
              marginTop: "15px",
              backgroundColor: "#03a9f4",
              color: "white",
            }}
          >
            Create New User
          </Button>
        </div>
      </Form>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          // @ts-ignore
          severity="info"
          sx={{ width: "100%" }}
        >
          Account created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserForm;
