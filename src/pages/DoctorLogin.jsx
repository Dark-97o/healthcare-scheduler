import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DoctorLogin(){

const [email,setEmail]=useState("");
const [pass,setPass]=useState("");

const navigate = useNavigate();

const login = ()=>{

if(email==="doctor@test.com" && pass==="123456"){
navigate("/doctor/dashboard");
}
else{
alert("Invalid login");
}

};

return(

<div className="container mt-5">

<h2>Doctor Login</h2>

<input
className="form-control mb-3"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
className="form-control mb-3"
placeholder="Password"
onChange={(e)=>setPass(e.target.value)}
/>

<button className="btn btn-primary" onClick={login}>
Login
</button>

</div>

);

}

export default DoctorLogin;