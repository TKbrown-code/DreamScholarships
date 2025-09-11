export const createModal = (type, options = {}) => {
  const { fullName, email, onContinue, onRetry, onClose } = options;

  const close = onClose || (() => null);
  const continueAction = onContinue || close;
  const retryAction = onRetry || close;

  const modals = {
    formError: {
      visible: true,
      title: "Form Error",
      message: "Please correct the highlighted fields before continuing.",
      buttons: [{ label: "Okay", onClick: close }]
    },

    registrationSuccess: {
      visible: true,
      title: "Registration Successful",
      message: `Welcome ${fullName || ""}! Please check your email (${email}) to verify your account.`,
      buttons: [{ label: "Okay", onClick: continueAction }]
    },

    loginSuccess: {
      visible: true,
      title: "Login Successful",
      message: `Welcome back ${fullName || ""}!`,
      buttons: [{ label: "Continue", onClick: continueAction }]
    },

    authError: {
      visible: true,
      title: "Authentication Failed",
      message: "Something went wrong. Please try again.",
      buttons: [
        {
          label: "Retry",
          onClick: retryAction,
          style: { background: "red", color: "white" }
        }
      ]
    }
  };

  return modals[type] || null;
};
