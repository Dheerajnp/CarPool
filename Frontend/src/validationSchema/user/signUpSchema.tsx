import * as yup from 'yup'

export const basicSchema=yup.object().shape({
    name:yup.string().required(),
    email:yup.string().email("Enter a valid Email").required("Enter an email id"),
    password:yup.string().required("password is required")
        .min(8,"password must atleast be atleast 8 characters")
        .matches(/[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword:yup.string().oneOf([yup.ref('password')],'Passwords must match'),
    // role:yup.string().required("Select a given role to continue")  
})