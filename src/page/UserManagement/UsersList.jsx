import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialData = [
  {
    id: 1,
    name: "Deep Sharma",
    role: "Admin",
    // mobile: "+617046535398",
    email:"pgupta@675@gmail.com",
    // username: "deepsharma",
    password: "password123",
  },
  {
    id: 2,
    name: "Pal Patel",
    role: "Admin",
    mobile: "+619876543210",
    email:"pgupta@675@gmail.com",
    username: "palpatel",
    password: "mypassword",
  },
];

const UsersList = () => {

  const [isAddUserSaved, setIsAddUserSaved] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const navigate=useNavigate();
  const [editedRole, setEditedRole] = useState("");
  const [editedMobile, setEditedMobile] = useState("");
  const[editedEmail,setEditedEmail]=useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPassword, setEditedPassword] = useState("");

  const [mobileValid, setMobileValid] = useState(null);
  const[emailValid,setEmailValid]=useState(null)
  const [usernameValid, setUsernameValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [nameValid, setNameValid] = useState(null);

  const [data, setData] = useState([]);
  let fetchedData=[];
  const [loading,setLoading]=useState(false)

  const isMobileValid = (mobile) => {
    return /^[+]\d{12}$/.test(mobile);
  };
  const isValidEmail=(email)=>{
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }
  const isUsernameValid = (username) => {
    return username.length >= 4;
  };

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const isNameValid = (name) => {
    return /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const handleEdit = (id) => {
    const userToEdit = data.find((user) => user.userId === id);
    setEditingId(id);
    setEditedName(userToEdit.userName);
    setEditedRole(userToEdit.userRole);
    setEditedEmail(userToEdit.userEmail)
    setEditedUsername(userToEdit.userName);
    setEditedPassword(userToEdit.userPassword);
  };

  const handleSave = async(id) => {
    let isDataValid = true;
    if (!isValidEmail(editedEmail)) {
      setMobileValid("Please enter valid Email address");
      isDataValid = false;
    } else {
      setEmailValid(null);
    }

    if (!isUsernameValid(editedUsername)) {
      setUsernameValid("Username must be at least 4 characters long");
      isDataValid = false;
    } else {
      setUsernameValid(null);
    }

    if (!isPasswordValid(editedPassword)) {
      setPasswordValid("Password must be at least 8 characters long");
      isDataValid = false;
    } else {
      setPasswordValid(null);
    }

    if (!isNameValid(editedName)) {
      setNameValid("Please enter valid name");
      isDataValid = false;
    } else {
      setNameValid(null);
    }

    if (isDataValid) {
      // setLoading(true);
      try{
        const api=`http://localhost:8080/admin/users/edit/${id}`
        const token=Cookies.get('jwtToken')
        const data={
          "userId": id,
          "userName": editedUsername,
          "userEmail": editedEmail,
          "userPassword": editedPassword,
          "userRole": editedRole
        }
        
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response =await axios.put(api,data,config)

        if(response.status==200){
          console.log("User Edited Sucessfully!!!")
          console.log(response.data)
        }
      }catch(e){
        console.error("Error Sending Request to Update")
      }
      const updatedData = data.map((user) => {
        if (user.userId == id) {
          return {
            ...user,
            userId:id,
            userName: editedUsername,
            userRole: editedRole,
            userEmail:editedEmail,
            userPassword:editedPassword,
          };
        }

          return user;
        
      });

      setEditingId(null);
      setData(updatedData);
      setIsAddUserSaved(true);

    }
  };

  const handleCancel = () => {
    if (editingId && !data.find((user) => user.userId === editingId)) {
      const newData = data.filter((item) => item.userId !== editingId);
      setData(newData);
    }
    setEditedName("");
    setEditedRole("");
    setEditedMobile("");
    setEditedUsername("");
    setEditedPassword("");
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.userId !== id);
    setData(newData);
  };

  const handleAddUser = () => {
     navigate("/app/salesman/form");
  };

  React.useEffect(()=>{
    setLoading(true)
    const fetchUrl="http://localhost:8080/admin/users/all"
    const token=Cookies.get('jwtToken')
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const fetchData=async()=>{
      console.log("Token from Users List"+token)
      try{
          const response=await axios.get(fetchUrl,config)
          if(response.status==200){
              console.log("Data Recieved Sucessfully");
              // console.log(response.data[0])
              try{

                fetchedData=response.data;
                setData(response.data)
              }catch(e){
                  console.log("error"+e)
              }
              console.log(fetchedData)
              setLoading(false)
          }else{
            setLoading(false)
            console.error("Error on recieving response")
          }
      }
      catch(e){
        console.error("error Sending request")
        setLoading(false)
      }
    }
   if(!loading){
     fetchData(); 
     setData(fetchedData) 
     setLoading(false)
   }
    
   return ()=>{
    }
  },[loading])
  
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, m: 1 }}>
      <div className="header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#03a9f4", marginRight: "20px" }}
          >
            Users Management
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#03a9f4",
              color: "white",
              marginTop: "10px",
            }}
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </div>
      </div>
      <hr></hr>
      <TableContainer
        component={Paper}
        className="table-container"
        style={{ marginTop: "30px" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#03a9f4",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                USER ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#03a9f4",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                USER ROLE
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#03a9f4",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                E-MAIL
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#03a9f4",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                USERNAME
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#03a9f4",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                PASSWORD
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#03a9f4",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.userId}>
                <TableCell>
                  {editingId === row.userId ? (
                    <div className="input-group">
                      <input
                        type="text"
                        // className={`form-control ${
                        //   nameValid ? "is-invalid" : ""
                        // }`}
                        value={row.userId}
                        // onChange={(e) => setEditedName(e.target.value)}
                        readOnly
                      />
                      {/* {nameValid && (
                        <div className="invalid-feedback">{nameValid}</div>
                      )} */}
                    </div>
                  ) : (
                    row.userId
                  )}
                </TableCell>
                <TableCell className="role-cell">
                  {editingId === row.userId ? (
                    <div className="input-group">
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        className="form-control"
                        style={{ width: "200px" }}
                      >
                        <option value="admin">admin</option>
                        <option value="salesman">salesman</option>
                        <option value="installer">installer</option>
                      </select>
                    </div>
                  ) : (
                    row.userRole
                  )}
                </TableCell>

                <TableCell>
                  {editingId === row.userId ? (
                    <div className="input-group">
                      <input
                        type="text"
                        className={`form-control ${
                          emailValid ? "is-invalid" : ""
                        }`}
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                      />
                      {emailValid && (
                        <div className="invalid-feedback">{emailValid}</div>
                      )}
                    </div>
                  ) : (
                    row.userEmail
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.userId ? (
                    <div className="input-group">
                      <input
                        type="text"
                        className={`form-control ${
                          usernameValid ? "is-invalid" : ""
                        }`}
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                      />
                      {usernameValid && (
                        <div className="invalid-feedback">{usernameValid}</div>
                      )}
                    </div>
                  ) : (
                    row.userName
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.userId ? (
                    <div className="input-group">
                      <input
                        type="password"
                        className={`form-control ${
                          passwordValid ? "is-invalid" : ""
                        }`}
                        value={editedPassword}
                        onChange={(e) => setEditedPassword(e.target.value)}
                      />
                      {passwordValid && (
                        <div className="invalid-feedback">{passwordValid}</div>
                      )}
                    </div>
                  ) : (
                    row.userPassword
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.userId ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleSave(row.userId)}
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "red" }}
                        onClick={handleCancel}
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(row.userId)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        style={{ color: "red" }}
                        onClick={() => handleDelete(row.userId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersList;