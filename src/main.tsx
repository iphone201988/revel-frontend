
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { ToastContainer, Zoom } from "react-toastify";
import { store } from "./redux/store.ts";
createRoot(document.getElementById("root")!).render(

    <Provider store={store}>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
      <App />
    </Provider>

);
