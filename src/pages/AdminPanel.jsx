import { Link } from "react-router-dom";

function AdminPanel(){

return(

<div className="container mt-5">

<h2>Admin Panel</h2>

<Link to="/admin/register-doctor">
<button className="btn btn-primary m-2">
Register Doctor
</button>
</Link>

<Link to="/admin/register-equipment">
<button className="btn btn-success m-2">
Register Equipment
</button>
</Link>

</div>

);

}

export default AdminPanel;