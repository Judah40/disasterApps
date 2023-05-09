// Used to handle Error across the app

export function CheckError(response) {
  // if success
  try {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      // if fail

      console.log("Error.");
    }
  } catch (error) {
    console.log("-----", error);
  }
}
