import React, { useState, useEffect, lazy, Suspense } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import { isAdmin } from './lib/admins';
import { useDocument, writeDoc } from './lib/firestore';
import { viewFromPath, pathFromView } from './lib/routes';
import Nav from './components/Nav';
import AdminSidebar from './components/AdminSidebar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import PublicHome from './pages/PublicHome';
import PublicServices from './pages/PublicServices';
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCRM = lazy(() => import('./pages/AdminCRM'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminInvoices = lazy(() => import('./pages/AdminInvoices'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const AdminFinance = lazy(() => import('./pages/AdminFinance'));
const AdminLanding = lazy(() => import('./pages/AdminLanding'));
const AdminNewsletter = lazy(() => import('./pages/AdminNewsletter'));
const AdminWebsiteEditor = lazy(() => import('./pages/AdminWebsiteEditor'));
const AdminAgenda = lazy(() => import('./pages/AdminAgenda'));
const AdminEmail = lazy(() => import('./pages/AdminEmail'));
const AdminMessenger = lazy(() => import('./pages/AdminMessenger'));
const SocialCreator = lazy(() => import('./pages/SocialCreator'));
const EspaceClient = lazy(() => import('./pages/EspaceClient'));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
    <span className="w-10 h-10 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
  </div>
);
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
  const [currentView, setCurrentViewState] = useState<ViewState>(() =>
    typeof window === 'undefined' ? 'HOME' : viewFromPath(window.location.pathname)
  );

  // La vue et l'adresse restent synchronisées : lien direct, bouton Précédent, partage.
  const setCurrentView = (view: ViewState) => {
    setCurrentViewState(view);
    const path = pathFromView(view);
    if (window.location.pathname !== path) {
      window.history.pushState({ view }, '', path);
    }
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const onPop = () => setCurrentViewState(viewFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
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

  const userIsAdmin = isAdmin(user);
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
        <main className="flex-1 ml-64 min-h-screen overflow-x-clip">
          <Suspense fallback={<PageLoader />}>{renderView()}</Suspense>
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
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>{renderView()}</Suspense>
      </main>
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
