import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function DoctorDashboard(){

const [appointments,setAppointments] = useState([]);
const [equipment,setEquipment] = useState([]);
const [beds,setBeds] = useState([]);
const [nurses,setNurses] = useState([]);

useEffect(()=>{

const fetchData = async () => {

try{

const appointmentSnap = await getDocs(collection(db,"appointments"));
const equipmentSnap = await getDocs(collection(db,"equipment"));
const bedSnap = await getDocs(collection(db,"beds"));
const nurseSnap = await getDocs(collection(db,"nurses"));

setAppointments(
appointmentSnap.docs.map(doc=>({id:doc.id,...doc.data()}))
);

setEquipment(
equipmentSnap.docs.map(doc=>({id:doc.id,...doc.data()}))
);

setBeds(
bedSnap.docs.map(doc=>({id:doc.id,...doc.data()}))
);

setNurses(
nurseSnap.docs.map(doc=>({id:doc.id,...doc.data()}))
);

}
catch(error){
console.log(error);
}

};

fetchData();

},[]);

return(

<div className="container mt-4">

<h2>Doctor Dashboard</h2>

<h4 className="mt-4">Today's Appointments</h4>

<table className="table table-bordered">

<thead>

<tr>

<th>Patient</th>
<th>Time</th>
<th>Assign Equipment</th>
<th>Assign Bed</th>
<th>Assign Nurse</th>

</tr>

</thead>

<tbody>

{appointments.map((appt)=>(

<tr key={appt.id}>

<td>{appt.patientId}</td>

<td>{appt.time}</td>

<td>

<select className="form-select">

<option>Select Equipment</option>

{equipment.map(eq=>(
<option key={eq.id}>{eq.name}</option>
))}

</select>

</td>

<td>

<select className="form-select">

<option>Select Bed</option>

{beds.map(bed=>(
<option key={bed.id}>
Room {bed.room}
</option>
))}

</select>

</td>

<td>

<select className="form-select">

<option>Select Nurse</option>

{nurses.map(nurse=>(
<option key={nurse.id}>
{nurse.name}
</option>
))}

</select>

</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default DoctorDashboard;