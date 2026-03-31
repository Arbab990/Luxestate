import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import ArticleDetail from './pages/ArticleDetail';
import Blog from'./pages/Blog';
import Press from './pages/Press';
import Careers from './pages/Careers';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import CreateCareer from './pages/CreateCareer';
import EditCareer from './pages/EditCareer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin" replace />;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function Layout({ children, noNav, noFooter }) {
  const location = useLocation();
  return (
    <>
      {!noNav && <Navbar />}
      <main key={location.pathname} className="page-transition">
        {children}
      </main>
      {!noFooter && <Footer />}
    </>
  );
}

const ComingSoon = ({ label }) => (
  <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
    <h1 className="font-display text-4xl text-ink">{label} — coming soon</h1>
  </div>
);


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f1f3d',
              color: '#f0f7ff',
              border: '1px solid rgba(184,208,232,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/listings" element={<Layout><Listings/></Layout>} />
          <Route path="/listing/:id" element={<Layout><ListingDetail /></Layout>} />
          <Route path="/about" element={<Layout><About/></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/press" element={<Layout><Press /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          <Route path="/article/:id" element={<Layout><ArticleDetail /></Layout>} />

          {/* Admin protected */}
          <Route path="/create-listing" element={<PrivateRoute><Layout><CreateListing /></Layout></PrivateRoute>} />
          <Route path="/edit-listing/:id" element={<PrivateRoute><Layout><EditListing /></Layout></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Layout noFooter><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/admin/create-article" element={<PrivateRoute><Layout><CreateArticle /></Layout></PrivateRoute>} />
          <Route path="/admin/edit-article/:id" element={<PrivateRoute><Layout><EditArticle /></Layout></PrivateRoute>} />
          <Route path="/admin/create-career" element={<PrivateRoute><Layout><CreateCareer/></Layout></PrivateRoute>} />
          <Route path="/admin/edit-career/:id" element={<PrivateRoute><Layout><EditCareer /></Layout></PrivateRoute>} />

          {/* Hidden login door */}
          <Route path="/admin" element={<GuestRoute><Login /></GuestRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}