import { v4 as uuidv4 } from 'uuid';

export const apiCore=(url,options)=>
    {
        let  config = useRuntimeConfig();
        let tempBase = import.meta.client?config.public.baseURL4Proxy:config.public.baseURL4Server;
         let urltemp= tempBase+url;
         console.info("-----------BASE_URL--------",urltemp);
        // console.info("----------process.env--------", process.env);
        
     return useFetch(url,
        {
            baseURL:tempBase,
            onRequest({options})
            {
                let token = "";
                console.info("isClient:"+import.meta.client)
                if(import.meta.client)
                     token = localStorage.getItem("token");
               options.headers=
               {
                //Authorization:`Bearer ${token}`,
                ...options.headers
               }
            },
            ...options
        }
     );
    }
    

    
    export const postApi= (url,options)=>
    {
        return new Promise((resolve,reject)=>
        {
            apiCore(url,
                {
                    method:'POST',
                    key:uuidv4(),
                    ...options
                }).then((res)=>
                    {
                        resolve(res.data.value)
                    })
                    .catch((err)=>
                    {
                        reject(err)
                    })
        })
        
    
    }