import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { router } from "./app/router";
import { UIProvider } from "./app/providers/UIProvider";
import { QueryProvider } from "./app/providers/QueryProvider";

export default function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <UIProvider>
          <RouterProvider router={router} />
        </UIProvider>
      </QueryProvider>
    </Provider>
  );
}
