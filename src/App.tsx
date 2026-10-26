import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { PoemModal } from '@/components/PoemModal';
import { Poem } from '@/data/poems';

// Home is loaded immediately for instant initial paint
import { Home } from '@/pages/Home';

// Secondary pages are lazy loaded on demand to reduce initial JS payload
const ThiCa = lazy(() => import('@/pages/ThiCa').then(m => ({ default: m.ThiCa })));
const VanHoa = lazy(() => import('@/pages/VanHoa').then(m => ({ default: m.VanHoa })));
const DanhNhan = lazy(() => import('@/pages/DanhNhan').then(m => ({ default: m.DanhNhan })));
const CoTich = lazy(() => import('@/pages/CoTich').then(m => ({ default: m.CoTich })));
const StoryDetail = lazy(() => import('@/pages/StoryDetail').then(m => ({ default: m.StoryDetail })));
const ThuVien = lazy(() => import('@/pages/ThuVien').then(m => ({ default: m.ThuVien })));
const GioiThieu = lazy(() => import('@/pages/GioiThieu').then(m => ({ default: m.GioiThieu })));
const Admin = lazy(() => import('@/pages/Admin').then(m => ({ default: m.Admin })));
const Terms = lazy(() => import('@/pages/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('@/pages/Privacy').then(m => ({ default: m.Privacy })));
const Contact = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

const AppContent: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-serif text-xs text-foreground/60 italic">Đang tải...</p>
            </div>
          }
        >
          <Switch>
            <Route path="/" component={() => <Home onSelectPoem={setSelectedPoem} />} />
            <Route path="/kham-pha" component={() => <ThiCa onSelectPoem={setSelectedPoem} />} />
            <Route path="/thi-ca" component={() => <ThiCa onSelectPoem={setSelectedPoem} />} />
            <Route path="/van-hoa" component={VanHoa} />
            <Route path="/chu-de" component={VanHoa} />
            <Route path="/chu-de/:char" component={VanHoa} />
            <Route path="/danh-nhan" component={DanhNhan} />
            <Route path="/danh-nhan/:id" component={DanhNhan} />
            <Route path="/co-tich" component={CoTich} />
            <Route path="/cau-chuyen/:slug" component={StoryDetail} />
            <Route path="/thu-vien" component={ThuVien} />
            <Route path="/gioi-thieu" component={GioiThieu} />
            <Route path="/admin" component={Admin} />
            <Route path="/dang-bai" component={Admin} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>

      <Footer />

      {/* Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectPoem={setSelectedPoem}
      />
      <PoemModal
        poem={selectedPoem}
        onClose={() => setSelectedPoem(null)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router hook={useHashLocation}>
      <AppContent />
    </Router>
  );
};

export default App;
