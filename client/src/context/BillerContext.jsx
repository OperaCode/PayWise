
import react, {createContext,useContext, useEffect,useState} from "react";
import axios from "axios";


const BillerContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;



 export const BillerProvider = ({children})=>{
    const [biller, setBiller ] = useState();

    useEffect(()=>{
        const fetchBillers = async()=>{
            const token= localStorage.getItem("token");
            if(!token) return;
            try {
              const response = await axios.get(`${BASE_URL}/billers`, {
                headers: {Authorization: `Bearer ${token}`},
                withCredentials: true,
              });
              const billers = response?.data ||  [];


            console.log(billers)
           
           
           
            } catch (error) {
               console.log("Failed to fetch biller:", + error) 
            }
        }
        fetchBillers()
    },[]);

     // for fetching billers to frontend
      useEffect(() => {
        const fetchBillers = async () => {
          try {
            const UserId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
    
            const response = await axios.get(`${BASE_URL}/biller`, {
              withCredentials: true,
            });
    
            const fetchedBillers = response?.data || [];
             console.log(fetchedBillers);
            setBillers(fetchedBillers);
    
            // Initialize active states
            const initialStates = {};
            fetchedBillers.forEach((biller) => {
              // Use fetchedBillers instead of res.data
              initialStates[biller._id] = biller.activeBiller;
            });
            setActiveBillerStates(initialStates);
          } catch (error) {
            console.error(error);
            toast.info(
              error?.response?.data?.message || "Failed to fetch billers"
            );
          }
        };
    
        fetchBillers();
      }, []);


      useEffect(()=>{
        if(biller){
        localStorage.setItem("billers");
        }
      },[billers]);




return(
    <BillerContext.Provider value={{biller, setBiller}}>
        {children}
    </BillerContext.Provider>
)






};



