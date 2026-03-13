import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = () => {

if(username === "admin" && password === "admin123"){
navigate("/admin");
}
else{
alert("Invalid credentials");
}

};

return (

<div className="container mt-5">

<h2>Admin Login</h2>

<input
className="form-control mb-3"
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
className="form-control mb-3"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="btn btn-dark"
onClick={handleLogin}
>

Login

</button>

</div>

);

}

export default AdminLogin;