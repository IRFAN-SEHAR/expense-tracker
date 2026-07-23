import React ,{useState} from "react";
function Login({onLoginSuccess}){
    const [items , setItems]=useState({
        username:"",
        password:""
    })
function handleChange(event){
    const {name , value}=event.target
    setItems(prevItems=>({
        ...prevItems,
        [name]:value
}))
}
async function handleClick(event){
    event.preventDefault();
   const response =  await fetch(("http://localhost:3000/login"),{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        credentials: "include",
        body:JSON.stringify(items)
    });
    console.log(response.status);
    const data = await response.json();
    if (response.ok && data.success) {
        onLoginSuccess(data.user);
    }else{
        console.log("error login show!")
    }
    
console.log(data);
}
return(
    <div>
        <form>
            <div>
                <label htmlFor="email">email</label>
                <input onChange={handleChange} type="email" name="username" id="email" value={items.username} autoComplete="email" required/>
            </div>
            <div>
                <label htmlFor="password" name="password" >password</label>
                <input onChange={handleChange} type="password" name="password" id="password" value={items.password} autoComplete="current-password" required/>
            </div>
            <button type="submit" onClick={event=>handleClick(event)} >Login</button>
        </form>
         
          
            <a className="btn btn-block" href="http://localhost:3000/auth/google" role="button">
              <i className="fab fa-google"></i>
              Sign In with Google
            </a>
          </div>
       
)
};
export default Login;