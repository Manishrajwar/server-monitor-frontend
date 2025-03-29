import React, { useEffect, useState } from 'react'
import "./page.css"
import { useNavigate } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";
import ToggleButton from './ToggleButton';
import { IoAlertCircleOutline, IoCaretUpOutline } from "react-icons/io5";
import toast from 'react-hot-toast';

const baseurl = "http://localhost:5500";

function HomePage() {

  const [isOn, setIsOn] = useState(false);

   const [allips , setAllips] = useState([]);

   const [ip , setIp ]  = useState("");
 const navigate = useNavigate();


 const saveIpApi = async () => {
  try {
    const resp = await fetch(`${baseurl}/add-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ip: ip,
        device_type: isOn ? "server":"switch"
      }),
    });

    const data = await resp.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};


const fetchSavedIP = async()=>{
  const resp = await fetch(`${baseurl}/get-devices`);

 const data = await resp.json();
 console.log("Datas",data);
   setAllips(data);
}

  useEffect(() => {
    fetchSavedIP();
        const interval = setInterval(() => {
           fetchSavedIP();
        }, 30000);

        return () => clearInterval(interval); 
    }, []);


    const removeIps = async(device_id)=>{
      const toastId = toast.loading("Loading...");
      const resp = await fetch(`${baseurl}/removeDeviceip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id 
        
        }),
      });

       toast.success("Successfully removed");
       toast.dismiss(toastId);
       fetchSavedIP();
    }

  return (
    <div className='home'>

       <h2>Server Monitor Application </h2>

       <div className="sermowrap">
     
     <div className="heading">
     <h4>Active Server</h4>
     
      <div className='FaArrowRightLongwrap'>
        <ToggleButton  isOn={isOn} setIsOn={setIsOn} />
     <input type="text" placeholder='Enter IP' value={ip} onChange={(e)=>setIp(e.target.value)} />
     <FaArrowRightLong onClick={()=>{
       if(ip){
        saveIpApi();
       }
     }} className='FaArrowRightLong' />
      </div>

     </div>

        <div className="alliips">
          {
            allips?.map((ip , index)=>(
              <div key={index} className="sinel_ip">

                <div   onClick={()=>navigate(`/serverDetail` , {state:ip})} className="flex flex-col gap-2">

              
                    <h5>{ip?.device_ip}</h5>
                    <p>{ip?.device_type} {index+1}</p>

                    {
                      ip?.status === "UP" ? 
                       <div className="up_status">
                        <IoCaretUpOutline className='up_Arrow' />
                         <span>{ip?.uptime}</span>
                       </div>
                       :
                       <div className="up_status">
                          <IoCaretUpOutline className='down_arrow' />
                          <span>Down</span>
                       </div>
                    }

</div>


<button onClick={()=>removeIps(ip?._id)} class="red-white-btn">Remove</button>

              </div>
            ))
          }
        </div>
       </div>

 

    </div>
  )
}

export default HomePage