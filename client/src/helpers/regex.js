export const testUsername = (username) => {
  if (!username) return false;

  const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

  return USERNAME_REGEX.test(username);
};

export const testEmail = (email) => {
  if (!email) return false;
  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return EMAIL_REGEX.test(email);
};

export const testPassword = (password) => {
  let result = {
    strength: 0,
    message: "Empty",
  };

  if (!password) return result;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
  const length = password.length;
  if (length > 5) {
    result = {
      strength: 25,
      message: "Weak",
    };
    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      result = {
        strength: 100,
        message: "Excellent",
      };
    } else if (
      (hasUpperCase && hasLowerCase && hasNumbers) ||
      (hasUpperCase && hasLowerCase && hasSpecialChars) ||
      (hasLowerCase && hasNumbers && hasSpecialChars)
    ) {
      result = {
        strength: 75,
        message: "Very good",
      };
    } else if (
      (hasUpperCase && hasLowerCase) ||
      (hasLowerCase && hasNumbers) ||
      (hasLowerCase && hasSpecialChars)
    ) {
      result = {
        strength: 50,
        message: "Good",
      };
    }
  } else {
    result = {
      strength: 10,
      message: "Very weak",
    };
  }
  return result;
};
