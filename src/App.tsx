import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Collections from "./pages/Collections";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import NewArrivals from "./pages/NewArrivals";
import AllProducts from "./pages/AllProducts";
import About from "./pages/About";
import BrandExperience from "./pages/BrandExperience";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";

import Sale from "./pages/Sale";
import SizeGuide from "./pages/SizeGuide";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Partnerships from "./pages/Partnerships";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:slug" element={<Collections />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/about" element={<About />} />
            <Route path="/brand-experience" element={<BrandExperience />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/cart" element={<Cart />} />
            
            <Route path="/sale" element={<Sale />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/partnerships" element={<Partnerships />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
</QueryClientProvider>
);

export default App;
