import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function Dashboard() {

const [doctors,setDoctors] = useState([]);
const [patients,setPatients] = useState([]);
const [appointments,setAppointments] = useState([]);

useEffect(()=>{

const fetchData = async () => {

try{

const doctorSnapshot = await getDocs(collection(db,"doctors"));
const patientSnapshot = await getDocs(collection(db,"patients"));
const appointmentSnapshot = await getDocs(collection(db,"appointments"));

const doctorList = doctorSnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));

const patientList = patientSnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));

const appointmentList = appointmentSnapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));

setDoctors(doctorList);
setPatients(patientList);
setAppointments(appointmentList);

}
catch(error){
console.error("Error fetching data:",error);
}

};

fetchData();

},[]);

return(

<div className="container mt-4">

<h1 className="mb-4">Healthcare Dashboard</h1>

<div className="row">

<div className="col-md-4">
<div className="card p-3 text-center">
<h4>Total Doctors</h4>
<h2>{doctors.length}</h2>
</div>
</div>

<div className="col-md-4">
<div className="card p-3 text-center">
<h4>Total Patients</h4>
<h2>{patients.length}</h2>
</div>
</div>

<div className="col-md-4">
<div className="card p-3 text-center">
<h4>Total Appointments</h4>
<h2>{appointments.length}</h2>
</div>
</div>

</div>

<h3 className="mt-5">Appointments</h3>

<table className="table table-bordered mt-3">

<thead>

<tr>
<th>Doctor</th>
<th>Patient</th>
<th>Time</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{appointments.map((appt)=>{

const doctor = doctors.find(d => d.id === appt.doctorId);
const patient = patients.find(p => p.id === appt.patientId);

return(

<tr key={appt.id}>

<td>{doctor ? doctor.name : appt.doctorId}</td>

<td>{patient ? patient.name : appt.patientId}</td>

<td>{appt.time}</td>

<td>{appt.status}</td>

</tr>

);

})}

</tbody>

</table>

</div>

);

}

export default Dashboard;