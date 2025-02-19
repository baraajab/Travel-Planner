
import "./public/style/style.scss"

import { handleFormSubmit } from "./script/handleFormSubmit";
import { getRdays } from "./script/getRdays";


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js")
        .then((reg) => console.log(" Service Worker Registered!", reg))
        .catch((err) => console.log(" Service Worker Registration Failed", err));
    });
  }
  
export {
    getRdays,
    handleFormSubmit
}