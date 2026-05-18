import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import { isAdmin } from './lib/admins';
import { useDocument, writeDoc } from './lib/firestore';
import Nav from './components/Nav';
import AdminSidebar from './components/AdminSidebar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PublicHome from './pages/PublicHome';
import PublicServices from './pages/PublicServices';
import AdminDashboard from './pages/AdminDashboard';
import AdminCRM from './pages/AdminCRM';
import AdminProducts from './pages/AdminProducts';
import AdminInvoices from './pages/AdminInvoices';
import AdminGallery from './pages/AdminGallery';
import AdminFinance from './pages/AdminFinance';
import AdminLanding from './pages/AdminLanding';
import AdminNewsletter from './pages/AdminNewsletter';
import AdminWebsiteEditor from './pages/AdminWebsiteEditor';
import AdminAgenda from './pages/AdminAgenda';
import AdminEmail from './pages/AdminEmail';
import AdminMessenger from './pages/AdminMessenger';
import SocialCreator from './pages/SocialCreator';
import { ViewState, HomeBlock, Language } from './types';

const INITIAL_HOME_BLOCKS: HomeBlock[] = [
  {
    id: 'hero-1',
    type: 'HERO',
    tagline: 'Xena Horizon',
    headline: 'Une histoire \nd\'ordre et de vision',
    subheadline: 'Passionnée par la structure et la créativité, je transforme le chaos organisationnel en puissance stratégique. Accompagner les artistes et les organismes pour qu\'ils retrouvent leur sécurité et leur impact est ma mission.',
    ctaText: 'Travailler avec moi',
    imageUrl: 'https://storage.googleapis.com/salondesinconnus/Laurie/461315215_8126222680823905_5406044944685229780_n.jpg'
  },
  {
    id: 'services-1',
    type: 'SERVICES_PREVIEW',
    title: 'Comment pouvons-nous \ncollaborer ?',
    subtitle: 'Trois axes d\'expertise pour structurer votre ambition.'
  },
  {
    id: 'stats-1',
    type: 'STATS',
    stat1Value: '15+', stat1Label: 'Années d\'expérience',
    stat2Value: '5M$', stat2Label: 'Financement Sécurisé',
    stat3Value: '100+', stat3Label: 'Artistes Accompagnés'
  },
  {
    id: 'contact-1',
    type: 'CONTACT',
    title: 'Prête à structurer votre génie ?',
    text: 'Ne laissez plus l\'administratif étouffer votre art. Discutons de votre prochaine étape.',
    email: 'hello@xenahorizon.com'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [lang, setLang] = useState<Language>('FR');

  const { data: homeDoc } = useDocument<{ blocks: HomeBlock[] }>('settings/homeBlocks');
  const homeBlocks: HomeBlock[] = homeDoc?.blocks ?? INITIAL_HOME_BLOCKS;
  const heroBlock = homeBlocks.find((b) => b.type === 'HERO') as
    | { imageUrl: string }
    | undefined;
  const profileImage =
    heroBlock?.imageUrl ??
    'https://storage.googleapis.com/salondesinconnus/Laurie/461315215_8126222680823905_5406044944685229780_n.jpg';

  const saveHomeBlocks = async (blocks: HomeBlock[]) => {
    await writeDoc('settings/homeBlocks', { blocks }, { merge: true });
  };

  const updateProfileImage = async (url: string) => {
    const next = homeBlocks.map((b) =>
      b.type === 'HERO' ? { ...b, imageUrl: url } : b
    );
    await saveHomeBlocks(next);
  };

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const userIsAdmin = isAdmin(user?.uid);
  const isAdminView = currentView.startsWith('ADMIN');

  // Guard: if user navigates to an admin view but isn't an admin, bounce to HOME and prompt sign-in
  useEffect(() => {
    if (authReady && isAdminView && !userIsAdmin) {
      setCurrentView('HOME');
      setAuthModalOpen(true);
    }
  }, [authReady, isAdminView, userIsAdmin]);

  const requestAdmin = () => {
    if (userIsAdmin) {
      setCurrentView('ADMIN_DASHBOARD');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentView('HOME');
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <PublicHome blocks={homeBlocks} lang={lang} />;
      case 'SERVICES':
        return <PublicServices lang={lang} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard lang={lang} />;
      case 'ADMIN_WEBSITE':
        return <AdminWebsiteEditor initialBlocks={homeBlocks} onSave={saveHomeBlocks} lang={lang} />;
      case 'ADMIN_CRM':
        return <AdminCRM lang={lang} />;
      case 'ADMIN_PRODUCTS':
        return <AdminProducts lang={lang} />;
      case 'ADMIN_INVOICES':
        return <AdminInvoices lang={lang} />;
      case 'ADMIN_GALLERY':
        return <AdminGallery lang={lang} currentProfileImage={profileImage} onUpdateProfileImage={updateProfileImage} />;
      case 'ADMIN_FINANCE':
        return <AdminFinance lang={lang} />;
      case 'ADMIN_LANDING':
        return <AdminLanding lang={lang} />;
      case 'ADMIN_NEWSLETTER':
        return <AdminNewsletter lang={lang} />;
      case 'ADMIN_SOCIAL':
        return <SocialCreator lang={lang} />;
      case 'ADMIN_AGENDA':
        return <AdminAgenda lang={lang} />;
      case 'ADMIN_EMAIL':
        return <AdminEmail lang={lang} />;
      case 'ADMIN_MESSENGER':
        return <AdminMessenger lang={lang} />;
      default:
        return <PublicHome blocks={homeBlocks} lang={lang} />;
    }
  };

  if (isAdminView && userIsAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
        <AdminSidebar
          currentView={currentView}
          onChangeView={setCurrentView}
          onSignOut={handleSignOut}
          lang={lang}
        />
        <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 font-sans">
      <Nav
        currentView={currentView}
        onChangeView={setCurrentView}
        onRequestAdmin={requestAdmin}
        lang={lang}
        setLang={setLang}
      />
      <main className="min-h-screen">{renderView()}</main>
      <Footer onAdminLogin={requestAdmin} lang={lang} />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAdminSignIn={() => setCurrentView('ADMIN_DASHBOARD')}
        lang={lang}
      />
    </div>
  );
};

export default App;
