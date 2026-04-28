export const authFormRules = {
  fullName: {
    required: "name is required",
  },
  email: {
    required: "email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "invalid email",
    },
  },
  password:{
    required:"password is required"
  }
};