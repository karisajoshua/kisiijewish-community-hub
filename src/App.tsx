import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Programs from "./pages/Programs";
import News from "./pages/News";
import NewsPost from "./pages/NewsPost";
import Gallery from "./pages/Gallery";
import Membership from "./pages/Membership";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const withLayout = (el: JSX.Element) => <Layout>{el}</Layout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={withLayout(<Home />)} />
          <Route path="/about" element={withLayout(<About />)} />
          <Route path="/events" element={withLayout(<Events />)} />
          <Route path="/programs" element={withLayout(<Programs />)} />
          <Route path="/news" element={withLayout(<News />)} />
          <Route path="/news/:slug" element={withLayout(<NewsPost />)} />
          <Route path="/gallery" element={withLayout(<Gallery />)} />
          <Route path="/membership" element={withLayout(<Membership />)} />
          <Route path="/donate" element={withLayout(<Donate />)} />
          <Route path="/contact" element={withLayout(<Contact />)} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={withLayout(<NotFound />)} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
