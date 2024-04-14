'use server';
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";


export type Session = {
        username: string;
        userid : number;
        usercode:string;

      };

type Data = {
        data: string;
      };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
        if (req.method !== 'POST') {
                res.status(405).send({ data: 'Only POST requests allowed' })
                return
            }
        const sessiontype=req.body.type
        const username=req.body.username
        const userid=req.body.userid
        const usercode=req.body.usercode
        try{
   if (sessiontype === "getSession"){

        await getSession().then ((value:any)=>{
                res.status(200).json({ data: value });  
           })
     }
        
    else  if (sessiontype === "setSession"){
           await setSession({username,userid,usercode}).then ((value)=>{
                res.status(200).json({ data: "Session Created" });  
           })
    }
                
   else  if (sessiontype === "removeSession"){

        await removeSession().then ((value:any)=>{
                res.status(200).json({ data: "Session Deleted" });  
           })    
   }
                       
   else{
        res.status(200).json({ data: "Invalid Choice" });
        }
}

catch(ex:any){
        res.status(200).json({ data: ex });
}

}
 const getSession = async (): Promise<Session | null> => {
        const cookieStore = cookies();
        const session = cookieStore.get('session');
      
        if (session?.value) {
          return JSON.parse(session.value) as Session;
        }
      
        return null;
      };
      
       const setSession = async (session: Session) => {
        const cookieStore = cookies();
        cookieStore.set('session', JSON.stringify(session));
      };
      
       const removeSession = async () => {
        const cookieStore = cookies();
        cookieStore.delete('session');
      };