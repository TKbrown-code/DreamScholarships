import emailjs from "emailjs-com";

const emailjs_service_id = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const emailjs_template_id = import.meta;
const emailjs_user_id = import.meta.env.VITE_EMAILJS_USER_ID;
const emailjs_template_id_one = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ONE;

export const sendEmail = (emailjs_service_id, emailjs_template_id, emailjs_user_id, emailjs_template_id_one)