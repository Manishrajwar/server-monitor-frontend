import React, { useState } from 'react'
import "./page.css"
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";


const ips =["http://localhost:5000"];

function HomePage() {


   const [ip , setIp ]  = useState("");
 const navigate = useNavigate();

  return (
    <div className='home'>

       <h2>Server Monitor Application </h2>

       <div className="sermowrap">
     
     <div className="heading">
     <h4>Active Server</h4>
     
      <div className='FaArrowRightLongwrap'>
     <input type="text" placeholder='Enter IP' value={ip} onChange={(e)=>setIp(e.target.value)} />
     <FaArrowRightLong onClick={()=>{
       if(ip){
        navigate(`/serverDetail` , {state:ip})
       }
     }} className='FaArrowRightLong' />
      </div>

     </div>

        <div className="alliips">
          {
            ips.map((ip , index)=>(
              <div onClick={()=>navigate(`/serverDetail` , {state:ip})} key={index} className="sinel_ip">
                    <h5>{ip}</h5>
                    <p>Server {index+1}</p>
              </div>
            ))
          }
        </div>
       </div>

 

    </div>
  )
}

export default HomePage