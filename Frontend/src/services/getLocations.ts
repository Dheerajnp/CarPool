const getLocations = async(query : string) =>{
    try{
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${
            import.meta.env.VITE_API_MAXBOX_TOKEN 
          }`)
          const data = await  res.json();
          console.log(data);
          return data.features;
    }catch(error){
        console.log("Error in Get Location",error );
        throw error;
    }
}


export default getLocations;