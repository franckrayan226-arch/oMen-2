import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/Login";
import Layout from "@/components/Layout";
import ProductsPage from "@/pages/Products";
import ProductFormPage from "@/pages/ProductForm";
import OrdersPage from "@/pages/Orders";

export default function App() {
  const { isAuthed } = useAuth();

  if (!isAuthed) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/produits" replace />} />
        <Route path="/produits" element={<ProductsPage />} />
        <Route path="/produits/nouveau" element={<ProductFormPage />} />
        <Route path="/produits/:id/edition" element={<ProductFormPage />} />
        <Route path="/commandes" element={<OrdersPage />} />
        <Route path="*" element={<Navigate to="/produits" replace />} />
      </Route>
    </Routes>
  );
}
