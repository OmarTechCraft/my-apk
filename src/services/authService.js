export const login = async (email, password) => {
  try {
    const response = await fetch(
      "https://finance-system.koyeb.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();

    // Store all user data in localStorage
    localStorage.setItem("userData", JSON.stringify(data));

    return data; // Return the user data
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
