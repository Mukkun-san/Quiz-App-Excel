function studentSignup(data) {
  let isValid = true;
  let errors = [];
  if (!data.name) {
    isValid = false;
    errors.push("Fullname not provided");
  }
  if (!data.email) {
    isValid = false;
    errors.push("Email not provided");
  }
  if (!data.password) {
    isValid = false;
    errors.push("Password not provided");
  }
  if (!data.class) {
    isValid = false;
    errors.push("Class not provided");
  }
  if (
    data.email &&
    !data.email
      .trim()
      .match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
  ) {
    isValid = false;
    errors.push("Email is not valid");
  }
  if (data.password && data.password.trim().length < 5) {
    isValid = false;
    errors.push("Password must have at least 5 characters.");
  }
  return { isValid, errors };
}

function studentLogin(data) {
  let isValid = true;
  let errors = [];
  if (!data.email) {
    isValid = false;
    errors.push("Email not provided");
  }
  if (!data.password) {
    isValid = false;
    errors.push("Password not provided");
  }
  if (
    data.email &&
    !data.email
      .trim()
      .match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
  ) {
    isValid = false;
    errors.push("Email is not valid");
  }
  return { isValid, errors };
}

function adminLogin(data) {
  if (!data.email) {
    return {
      isValid: false,
      msg: "Email not provided",
    };
  }
  if (
    !data.email
      .trim()
      .match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
  ) {
    return {
      isValid: false,
      msg: "Email is not valid",
    };
  }
  if (!data.password) {
    return {
      isValid: false,
      msg: "Please enter password",
    };
  }
  if (data.email.toLowerCase() != process.env.MASTER_EMAIL) {
    return {
      isValid: false,
      msg: "Not an admin email.",
    };
  }
  if (data.password != process.env.MASTER_PASSW) {
    return {
      isValid: false,
      msg: "Password incorrect",
    };
  }
  return { isValid: true };
}

module.exports = { studentSignup, studentLogin, adminLogin };
