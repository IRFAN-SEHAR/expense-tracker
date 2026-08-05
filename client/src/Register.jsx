import React, { useState } from "react";
import { API_URL } from "./config";
function Register({onRegisterSuccess}){
    const [items , setItems] = useState({
        username:"",
        password:""
    });
    function handleChange(event){
        const {name , value} = event.target;
        setItems(prevItems=>({
            ...prevItems,
            [name]:value
        }))
    }
   async function handleClick(event){
    event.preventDefault()
          const response =    await fetch((`${API_URL}/signup`),{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json",
                  "ngrok-skip-browser-warning": "true"
    
                },
                credentials: "include",
                body:JSON.stringify(items)
             })
           
    if (response.ok) {
        onRegisterSuccess();
    }else{
        console.log("error login show!")
    }
    
            
        
    }
    return(
        <div className="auth-card">
            <form className="auth-form">
            <div className="field">
                <label className="field-label" htmlFor="email">email</label>
                <input className="field-input" onChange={handleChange} type="email" name="username" id="email" value={items.username} autoComplete="email" required/>
            </div>
            <div className="field">
                <label className="field-label" htmlFor="password">password</label>
                <input className="field-input" onChange={handleChange} type="password" name="password" id="password" value={items.password} autoComplete="new-password" required/>
            </div>
            <button className="btn btn-primary btn-block" type="submit" onClick={(event)=>{handleClick(event)}}>ok</button>
            </form>
        
            <a
  className="btn btn-google"
  href={`${API_URL}/auth/google`}
  role="button"
>
  <i className="fab fa-google"></i>
  Sign Up with Google
</a>
          </div>
       
    )
};
export default Register;
