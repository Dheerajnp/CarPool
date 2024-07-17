import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USER,
        pass:  process.env.MAILER_PASS
    }
})

const htmlSender: Function = (OTP: number, text: string): string => {
    return `
        <html>
        <body>
        <center><p style='text-decoration:underline'>OTP For Login Verification</p></center>
            <center><h1 style="font-size: 36px; color: #ff0000;">${OTP}</h1></center>
            <p>${text}</p>
        </body>
        </html>
    `;
}

const forgotPasswordText: Function = (OTP: number, text: string): string =>{
    return `
    <html>
    <body>
    <center><p style='text-decoration:underline'>OTP For Login Verification</p></center>
        <center><h1 style="font-size: 36px; color: #ff0000;">${OTP}</h1></center>
        <p>${text}</p>
    </body>
    </html>
`;
}

export const forgotPasswordOtpMail:Function = async(otp:string,email:string):Promise<boolean> =>{
    try {
        const text:string = "This is the verification mail for forget password for the Ride sharing application CarPool.";
        const body:string = forgotPasswordText(otp,text);
       
        const mailOptions = {
            from: process.env.MAILER_USER,
            to: email,
            subject: 'OTP For forgot password',
            html: body
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                return false
            }
            console.log(info.response);
            
        });
        return true;
        
    } catch (error) {
        console.log(error);
        return false
    }
}


export const sendOtpMail:Function = async(Email:string,otp:string): Promise<boolean> =>{
    try {

        const text:string ="This is the verification otp mail for the Ride sharing application CarPool.";
        const body:string =htmlSender(otp,text);

        const mailOptions = {
            from: process.env.MAILER_USER,
            to: Email,
            subject: 'OTP For Login Verification',
            html: body
        }
        console.log(Email,otp)
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                return false
            }
            console.log(info.response);
            
        });
        return true;
        
    } catch (error) {
        console.log(error);
        return false
    }
}