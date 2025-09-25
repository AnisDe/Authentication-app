export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  const rules = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  for (let [rule, regex] of Object.entries(rules)) {
    if (!regex.test(password)) {
      return `Password must contain ${rule}`;
    }
  }
  return null;
};
