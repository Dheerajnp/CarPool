import axios from "axios";

export const axiosActionsUser = async(id : string , block : boolean)=>{
    try{
        const {data : {users , message}} = await axios.put(`/admin/user-actions/${id}/${block}`);
         console.log({users , message})
          return { users , message};
    }catch(error : any){
        console.log(error.message); 
        throw error;
    }
};