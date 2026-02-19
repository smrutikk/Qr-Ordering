import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTables from "./pages/AdminTables";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";

import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/success" element={<OrderSuccess />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/tables" element={<AdminTables />} />
      <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
           </ProtectedRoute>
          }
      />

    </Routes>
  );
}

export default App;
