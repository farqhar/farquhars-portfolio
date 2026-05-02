import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Work from "./pages/Work.tsx";
import CaseStudy from "./pages/CaseStudy.tsx";
import About from "./pages/About.tsx";
import Admin from "./pages/Admin.tsx";
import SiteNav from "./components/site/SiteNav";
import SiteFooter from "./components/site/SiteFooter";
import AdminLink from "./components/AdminLink";
import FloatingContactCTA from "./components/site/FloatingContactCTA";
import { useTheme } from "./lib/theme";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeMount />
        <SiteNav />
        <AnimatedRoutes />
        <SiteFooter />
        <AdminLink />
        <FloatingContactCTA />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const ThemeMount = () => {
  useTheme();
  return null;
};

export default App;
