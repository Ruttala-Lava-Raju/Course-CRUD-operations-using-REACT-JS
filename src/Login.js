import React, { useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

export default function Login()
{
    var history = useHistory();
    const[userName, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[errorMessage, setErrorMessage] = useState("");
    const onUserNameChange = (event) =>
    {
        setUsername(event.target.value);
    }

    const onPasswordChange = (event) =>
    {
        setPassword(event.target.value);
    }

    const handleLogin = () =>
    {
        const path = "http://localhost:8002/api/syllabus/signIn";
        Axios.post(path,  {
            "userName": userName,
            "password": password
        }).then((result) =>
        {
            if(result.status === 200)
            {
                const data = result.data[0]
                const token = data.token;
                const userName = data.userName;
                console.log(token.token);
                window.sessionStorage.setItem("token", token);
                window.sessionStorage.setItem("userName", userName);
                history.push("/Course");
            }
        }).catch((error) =>
        {
            console.log(error, error.response);
            if(error.response.status === 404)
            {
                setErrorMessage("Incorrect username/password.");
            }
        })
    }
    
    return(
        <div>
            <label>User Name: </label>
            <input type="text" onChange={onUserNameChange}></input>
            <br></br>
            <label>Password: </label>
            <input type="password" onChange={onPasswordChange}></input>
            <br></br>
            <br></br>
            <button onClick={handleLogin}>Log In</button>
            <br></br>
            <label>{errorMessage}</label>
        </div>
    )
}
