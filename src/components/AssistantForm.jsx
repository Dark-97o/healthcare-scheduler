import { useState } from "react";

function AssistantForm(){

const [name,setName]=useState("");
const [symptoms,setSymptoms]=useState("");
const [date,setDate]=useState("");
const [time,setTime]=useState("");

const submit = ()=>{

alert(`Patient: ${name}
Symptoms: ${symptoms}
Date: ${date}
Time: ${time}`);

};

return(

<div className="card p-4 mt-3">

<input
className="form-control mb-3"
placeholder="Patient Name"
onChange={(e)=>setName(e.target.value)}
/>

<select
className="form-control mb-3"
onChange={(e)=>setSymptoms(e.target.value)}
>

<option>Select Symptoms</option>
<option>Chest Pain</option>
<option>Fever</option>
<option>Headache</option>
<option>Skin Rash</option>

</select>

<input
type="date"
className="form-control mb-3"
onChange={(e)=>setDate(e.target.value)}
/>

<input
type="time"
className="form-control mb-3"
onChange={(e)=>setTime(e.target.value)}
/>

<button className="btn btn-success" onClick={submit}>
Find Appointment
</button>

</div>

);

}

export default AssistantForm;