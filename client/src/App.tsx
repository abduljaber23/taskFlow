import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
