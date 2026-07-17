import React from "react";
function Register(){
    return(
        <div>
            <form action="/register" method="POST">
            <div>
                <label htmlFor="email">email</label>
                <input type="email" name="email" id="email" autoComplete="email"/>
            </div>
            <div>
                <label htmlFor="password">password</label>
                <input type="password" name="password" id="password" autoComplete="new-password"/>
            </div>
            <button type="submit">ok</button>
            </form>
        </div>
    )
};
export default Register;