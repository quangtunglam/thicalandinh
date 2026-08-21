import React, { useState, useEffect } from 'react';
import { Router, Route, Switch, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { PoemModal } from '@/components/PoemModal';
import { Poem } from '@/data/poems';

import { Home } from '@/pages/Home';
import { ThiCa } from '@/pages/ThiCa';
import { VanHoa } from '@/pages/VanHoa';
import { DanhNhan } from '@/pages/DanhNhan';
import { CoTich } from '@/pages/CoTich';
import { StoryDetail } from '@/pages/StoryDetail';
import { ThuVien } from '@/pages/ThuVien';
import { GioiThieu } from '@/pages/GioiThieu';
import { Admin } from '@/pages/Admin';
import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';
import { Contact } from '@/pages/Contact';
import { NotFound } from '@/pages/NotFound';

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
