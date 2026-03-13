import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const registerEquipment = async (equipment)=>{

await addDoc(collection(db,"equipment"),equipment);

};