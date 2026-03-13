import { useState } from "react";
import { registerEquipment } from "../services/equipmentService";

function RegisterEquipment(){

const [name,setName]=useState("");
const [type,setType]=useState("");

const submit = async ()=>{

await registerEquipment({
name,
type,
available:true
});

alert("Equipment registered");

};

return(

<div className="container mt-5">

<h2>Register Equipment</h2>

<input
className="form-control mb-3"
placeholder="Equipment Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
className="form-control mb-3"
placeholder="Type"
onChange={(e)=>setType(e.target.value)}
/>

<button className="btn btn-success" onClick={submit}>
Register
</button>

</div>

);

}

export default RegisterEquipment;