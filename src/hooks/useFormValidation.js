export const useFormValidation = (form, isSignUp) => {
  const validateForm = () => {
    const errors = {};
    if (isSignUp && !form.first_name.trim()) errors.name = "First name is required.";
    if (isSignUp && !form.second_name.trim()) errors.name = "Second name is required.";
    if (isSignUp && !form.number) errors.number = "Phone number is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    if (!form.password || form.password.length < 6)
      errors.password = "Password must be at least 6 characters.";
    if (isSignUp && form.password !== form.password_verify)
      errors.password_verify = "Passwords do not match.";
    if (!form.policy) errors.policy = "You must accept the policy.";
    return errors;
  };

  return { validateForm };
};
