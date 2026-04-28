import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { RequireAdmin, RequireAuth } from "@/components/admin/RequireAdmin";
import { ScrollToHash } from "@/components/ScrollToHash";
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
const Account = lazy(() => import("./pages/Account"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminOverview = lazy(() => import("./pages/admin/Overview"));
const HomepageAdmin = lazy(() => import("./pages/admin/HomepageAdmin"));
const SiteSettingsAdmin = lazy(() => import("./pages/admin/SiteSettingsAdmin"));
const FooterAdmin = lazy(() => import("./pages/admin/FooterAdmin"));
const EventsAdmin = lazy(() => import("./pages/admin/EventsAdmin"));
const RSVPsAdmin = lazy(() => import("./pages/admin/RSVPsAdmin"));
const NewsAdmin = lazy(() => import("./pages/admin/NewsAdmin"));
const AnnouncementsAdmin = lazy(() => import("./pages/admin/AnnouncementsAdmin"));
const GalleryAdmin = lazy(() => import("./pages/admin/GalleryAdmin"));
const MembershipsAdmin = lazy(() => import("./pages/admin/MembershipsAdmin"));
const ContactsAdmin = lazy(() => import("./pages/admin/ContactsAdmin"));
const UsersAdmin = lazy(() => import("./pages/admin/UsersAdmin"));
const ProfileAdmin = lazy(() => import("./pages/admin/ProfileAdmin"));
const DonationsAdmin = lazy(() => import("./pages/admin/DonationsAdmin"));

const queryClient = new QueryClient();

const pageLoader = <div className="min-h-[50vh] bg-background" aria-label="Loading page" />;

const withLayout = (el: JSX.Element) => <Layout>{el}</Layout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
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
            <Route path="/account" element={<RequireAuth>{withLayout(<Account />)}</RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route index element={<AdminOverview />} />
              <Route path="homepage" element={<HomepageAdmin />} />
              <Route path="settings" element={<SiteSettingsAdmin />} />
              <Route path="footer" element={<FooterAdmin />} />
              <Route path="events" element={<EventsAdmin />} />
              <Route path="rsvps" element={<RSVPsAdmin />} />
              <Route path="news" element={<NewsAdmin />} />
              <Route path="announcements" element={<AnnouncementsAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="memberships" element={<MembershipsAdmin />} />
              <Route path="contacts" element={<ContactsAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
              <Route path="profile" element={<ProfileAdmin />} />
              <Route path="donations" element={<DonationsAdmin />} />
            </Route>
            <Route path="*" element={withLayout(<NotFound />)} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
