import React from "react";
function Login(){
return(
    <div>
        <form action="login" method="POST">
            <div>
                <label htmlFor="email">email</label>
                <input type="email" name="email" id="email" autoComplete="email" />
            </div>
            <div>
                <label htmlFor="password" name="password" >password</label>
                <input type="password" name="password" id="password" autoComplete="current-password" />
            </div>
            <button type="submit" >ok</button>
        </form>
    </div>
)
};
export default Login;