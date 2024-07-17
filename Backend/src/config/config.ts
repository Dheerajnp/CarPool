import dotenv from 'dotenv'
dotenv.config();

export interface ConfigInterface{
    MONGO: string,
    PORT: number,
 
}

const config:ConfigInterface = {
    MONGO: process.env.MONGO ||'',
    PORT : parseInt(process.env.PORT || '3000')
}


export const configuredKeys = {
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY as string,
    JWT_REFRESH_SECRET_KEY : process.env.JWT_REFRESH_SECRET_KEY  as string,
}



export default config;