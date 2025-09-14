/**
 * Utility to warm up the backend server to prevent cold starts
 */

// Get the backend URL from environment variables
const MOVIE_RECOMMEND_BACKEND = import.meta.env.VITE_MOVIE_RECOMMEND_BACKEND;

/**
 * Sends a request to the backend test endpoint to warm it up
 * @returns {Promise<boolean>} A promise that resolves to true if warmup was successful
 */
export const warmupBackend = async () => {
  console.log("Warming up backend server...");

  try {
    const response = await fetch(`${MOVIE_RECOMMEND_BACKEND}/api/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Backend warmup successful");
      return true;
    } else {
      console.log("Backend warmup completed but returned non-200 status");
      return false;
    }
  } catch (error) {
    // Silently handle errors (no error messages to user)
    console.log("Backend warmup attempt failed silently");
    return false;
  }
};
