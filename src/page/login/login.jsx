import React, { useState } from 'react';
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./../../contexts/AuthContext";
import Cookies from 'js-cookie'
// import jw
import './login.css'; 

function Login() {
  const {loginStatus,updateStatus,updateRole}=React.useContext(AuthContext);
  const [showNotification, setShowNotification] = React.useState(false);
    
    const [error, setError] = useState('');
    const{register,handleSubmit}=useForm()
    const navigate=useNavigate()
    // const {updateToken}=React.useContext(AuthContext)
    const loginAPI="http://localhost:8080/login"
    
    
    const onSubmit = async (data) => {
      // console.log("Data"+data)
      try {
        const response = await axios.post(loginAPI,data,{
          
          auth: {
            username: 'mojo',
            password: 'mojo365',
          },
  
          headers: {
            'Content-Type': 'application/json',
            
          },
        });
        console.log("Response Status :"+response.status);
        
        
        if(response.status === 200) {
          if(response.data.token===null){
            console.log("INVALID CREDENTIALS !!!")
            setError("Not a Authorized Personal");
            updateStatus(false)
             setShowNotification(true);
             setTimeout(() => {
              setShowNotification(false);
            }, 3000);
          }else{
            console.log('Login successful:', response.data);
            // updateToken(response.data.token);
            Cookies.set("jwtToken",response.data.token)
            Cookies.set("userRole",response.data.userRole)
            Cookies.set("userName",data.userName)
            Cookies.set("refreshToken",response.data.uuid)
            updateStatus(true)
            updateRole(response.data.userRole);
            navigate("/app"); 
          }
        }
      } catch (err) {
        setError('Error Connecting with Server');
        console.error('Login error:', err);
        setShowNotification(true);
        setTimeout(() => {
         setShowNotification(false);
       }, 1000);
      }
    };

  


  return (
<div className="parent-container">

<div className="login-container">
  <title>Login Page</title>
  <link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Gilroy:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <section className=" py-3 py-md-5 py-xl-10">
    <div className="container" style={{ marginTop: 200 }}>
      <div className="row gy-4 align-items-center">
        <div className="col-12 col-md-6 col-xl-7">
          <div className="d-flex justify-content-center">
            <div className="col-12 col-xl-9">
            <img src="/src/page/login/true1.png" alt="Your Logo" width={178} />
              <hr className="border-secondary-subtle mb-4" />
              <h1
                className="h1 mb-4"
                style={{ color: "white", fontWeight: "bold", fontSize: 42 }}
              >
                Welcome to True Hot Water Solar Customer Portal
              </h1>
              <p style={{ color: "white", fontWeight: "bold" }}>
                Login to access all the information about your solar system.
              </p>
              <div className="container" style={{ marginTop: 50 }}>
                <div className="row">
                  <div className="col-md-4">
                    <h6
                      className="text-center"
                      style={{
                        backgroundColor: "yellow",
                        borderRadius: 10,
                        padding: 10,
                        color: "black"
                      }}
                    >
                      For Home
                    </h6>
                  </div>
                  <div className="col-md-4">
                    <h6
                      className="text-center"
                      style={{
                        backgroundColor: "yellow",
                        borderRadius: 10,
                        padding: 10,
                        color: "black"
                      }}
                    >
                      For Businesses
                    </h6>
                  </div>
                  <div className="col-md-4">
                    <h6
                      className="text-center"
                      style={{
                        backgroundColor: "yellow",
                        borderRadius: 10,
                        padding: 10,
                        color: "black"
                      }}
                    >
                      For Community
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-5">
          <div className="card border-0 rounded-4">
            <div className="card-body p-3 p-md-9 p-xl-5">
              <div className="row">
                <div className="col-12">
                  <div className="mb-4">
                    <h4>Login</h4>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className="col-12">
  <div className="form-floating mb-3">
    <input
      type="username"
      className="form-control"
      name="username"
      id="username"
      placeholder="name@example.com"
      {...register("userName")}
      required
    />
    <label htmlFor="username" className="form-label">
      Username
    </label>
  </div>
</div>

        <div className="col-12">
  <div className="form-floating mb-3">
    <input
      type="password"
      className="form-control"
      name="password"
      id="password"
      defaultValue=""
      placeholder="Password"
      {...register("userPassword")}
      required
    />
    <label htmlFor="password" className="form-label">
      Password
    </label>
  </div>
</div>

        <div className="col-12">
          <div className="d-grid">
            <button className="btn btn-lg btn-primary" type="submit" >
              Log in
            </button>
          </div>
        </div>
      </form>
      {showNotification && (
                        <div className="notification">
                          Wrong Username or Password
                        </div>
                      )}
       
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</div>
  );
}

export default Login;
