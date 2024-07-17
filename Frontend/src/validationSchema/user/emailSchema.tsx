import * as yup from 'yup'

export const validateEmail = yup.object().shape({
    email:yup.string().email("Enter a valid email address").required("Enter an email id")
})