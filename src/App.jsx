import { Link } from "react-router-dom";
// import AdminLogin from "./pages/AdminLogin";
import AssistantForm from "./components/AssistantForm";


// import AdminPanel from "./pages/AdminPanel";
// import RegisterDoctor from "./pages/RegisterDoctor";
// import RegisterEquipment from "./pages/RegisterEquipment";
// import DoctorLogin from "./pages/DoctorLogin";
// import DoctorDashboard from "./pages/DoctorDashboard";

function Home(){

return(

<div className="container text-center mt-5">

<h1>Smart Healthcare Scheduler</h1>

<img
src="https://cdn-icons-png.flaticon.com/512/4712/4712105.png"
width="120"
/>

<h3 className="mt-3">AI Patient Assistant</h3>

<AssistantForm/>

<div className="row mt-5">

<div className="col">

<Link to="/admin/login">
<button className="btn btn-dark">
Admin Panel
</button>
</Link>

</div>

<div className="col">

<Link to="/doctor/login">
<button className="btn btn-primary">
Doctor Panel
</button>
</Link>

</div>

</div>

</div>

);

}

export default Home;