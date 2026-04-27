import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const Programs = lazy(() => import("./pages/Programs"));
const News = lazy(() => import("./pages/News"));
const NewsPost = lazy(() => import("./pages/NewsPost"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Membership = lazy(() => import("./pages/Membership"));
const Donate = lazy(() => import("./pages/Donate"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const pageLoader = (
  <div className="min-h-[50vh] bg-background" aria-label="Loading page" />
);

const withLayout = (el: JSX.Element) => <Layout>{el}</Layout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={pageLoader}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
