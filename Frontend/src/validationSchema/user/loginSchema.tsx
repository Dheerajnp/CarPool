import * as yup from 'yup';

export const validateUserLogin = yup.object().shape({
    email:yup.string().email("Enter a valid Email").required("Enter an email id"),
    password:yup.string()
    .min(8,"password must atleast be atleast 8 characters")
    .required("Enter a password")
})