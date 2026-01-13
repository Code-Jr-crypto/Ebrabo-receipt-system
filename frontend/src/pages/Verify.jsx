import axios from "axios";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";

export default function Verify(){
  const {code}=useParams();
  const [data,setData]=useState([]);

useEffect(()=>{
  axios.get(`http://172.20.10.2:5000/api/verify/${code}`).then(res=>setData(res.data));
}, [code]);

  return(
    <div style={{padding:20}}>
      <h2 style={{background:"rgb(259,229,15)",padding:10}}>TRA Receipt Verification</h2>
      {data.map((r,i)=>(
        <div key={i}>
          <p>Customer: {r.name}</p>
          <p>Total: {r.total_inclusive}</p>
        </div>
      ))}
    </div>
  );
}
