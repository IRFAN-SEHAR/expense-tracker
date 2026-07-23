import React, { useState } from "react";
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
          const response =    await fetch(("http://localhost:3000/signup"),{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
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
        <div>
            <form >
            <div>
                <label htmlFor="email">email</label>
                <input onChange={handleChange} type="email" name="username" id="email" value={items.username} autoComplete="email" required/>
            </div>
            <div>
                <label htmlFor="password">password</label>
                <input onChange={handleChange} type="password" name="password" id="password" value={items.password} autoComplete="new-password" required/>
            </div>
            <button type="submit" onClick={(event)=>{handleClick(event)}}>ok</button>
            </form>
        
            <a className="btn btn-block" href="http://localhost:3000/auth/google"role="button">
              <i className="fab fa-google"></i>
              Sign Up with Google
            </a>
          </div>
       
    )
};
export default Register;