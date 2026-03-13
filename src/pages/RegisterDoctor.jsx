import { useState } from "react";
import { registerDoctor } from "../services/doctorService";

function RegisterDoctor(){

const [name,setName]=useState("");
const [specialization,setSpecialization]=useState("");

const submit = async ()=>{

await registerDoctor({
name,
specialization
});

alert("Doctor registered");

};

return(

<div className="container mt-5">

<h2>Register Doctor</h2>

<input
className="form-control mb-3"
placeholder="Doctor Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
className="form-control mb-3"
placeholder="Specialization"
onChange={(e)=>setSpecialization(e.target.value)}
/>

<button className="btn btn-primary" onClick={submit}>
Register
</button>

</div>

);

}

export default RegisterDoctor;