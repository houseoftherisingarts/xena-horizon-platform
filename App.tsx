import React, { useState, useEffect, lazy, Suspense } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import { isAdmin } from './lib/admins';
import { useDocument, writeDoc } from './lib/firestore';
import { viewFromPath, pathFromView } from './lib/routes';
import { BLOCS_ACCUEIL } from './lib/contenu';
import Consentement from './components/Consentement';
import { DefilementDoux } from './components/motion';
import NotFound, { cheminInconnu } from './pages/NotFound';
import Nav from './components/Nav';
import AdminSidebar from './components/AdminSidebar';
import Footer from './components/Footer';
import Editeur from './components/Editeur';
import { TextesProvider } from './lib/textes';
import AuthModal from './components/AuthModal';
import PublicHome from './pages/PublicHome';
import PublicServices from './pages/PublicServices';
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCRM = lazy(() => import('./pages/AdminCRM'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminInvoices = lazy(() => import('./pages/AdminInvoices'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const AdminFinance = lazy(() => import('./pages/AdminFinance'));
const AdminNewsletter = lazy(() => import('./pages/AdminNewsletter'));
const AdminAgenda = lazy(() => import('./pages/AdminAgenda'));
const AdminCourriel = lazy(() => import('./pages/AdminCourriel'));
const SocialCreator = lazy(() => import('./pages/SocialCreator'));
const AdminDossiers = lazy(() => import('./pages/AdminDossiers'));
const EspaceClient = lazy(() => import('./pages/EspaceClient'));
const PublicProjets = lazy(() => import('./pages/PublicProjets'));
const PublicAPropos = lazy(() => import('./pages/PublicAPropos'));

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
    <span className="w-10 h-10 rounded-pilule border-2 border-filet border-t-rose animate-spin" />
  </div>
);
import { ViewState, HomeBlock, Language } from './types';


const App: React.FC = () => {
  const [currentView, setCurrentViewState] = useState<ViewState>(() =>
    typeof window === 'undefined' ? 'HOME' : viewFromPath(window.location.pathname)
  );
  const [notFound, setNotFound] = useState<boolean>(() =>
    typeof window !== 'undefined' && cheminInconnu(window.location.pathname)
  );

  // La vue et l'adresse restent synchronisées : lien direct, bouton Précédent, partage.
  const setCurrentView = (view: ViewState) => {
    setNotFound(false);
    setCurrentViewState(view);
    const path = pathFromView(view);
    if (window.location.pathname !== path) {
      window.history.pushState({ view }, '', path);
    }
    window.scrollTo({ top: 0 });
  };

  // Le titre de l'onglet suit la vue (le prérendu couvre le premier chargement, ceci couvre la navigation).
  useEffect(() => {
    const titres: Partial<Record<ViewState, string>> = {
      HOME: 'Xena Horizon | Laurie Belhumeur, consultante en carrière artistique et communication',
      SERVICES: 'Services et tarifs | Xena Horizon',
      PROJETS: 'Projets : balado, livre, modèle | Xena Horizon',
      ESPACE_CLIENT: 'Mon espace | Xena Horizon',
      A_PROPOS: 'À propos de Laurie Belhumeur | Xena Horizon',
    };
    document.title = notFound ? 'Page introuvable | Xena Horizon' : (titres[currentView] ?? (currentView.startsWith('ADMIN') ? 'Admin | Xena Horizon' : titres.HOME!));
  }, [currentView, notFound]);

  useEffect(() => {
    const onPop = () => {
      setNotFound(cheminInconnu(window.location.pathname));
      setCurrentViewState(viewFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [lang, setLang] = useState<Language>('FR');

  const { data: homeDoc } = useDocument<{ blocks: HomeBlock[] }>('settings/homeBlocks');
  const homeBlocks: HomeBlock[] = homeDoc?.blocks ?? BLOCS_ACCUEIL;
  const heroBlock = homeBlocks.find((b) => b.type === 'HERO') as
    | { imageUrl: string }
    | undefined;
  const profileImage = heroBlock?.imageUrl ?? '/images/laurie-portrait-nb.jpg';

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
  const [menuAdminOuvert, setMenuAdminOuvert] = useState(false);
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
    if (notFound) return <NotFound lang={lang} onChangeView={setCurrentView} />;
    switch (currentView) {
      case 'HOME':
        return <PublicHome blocks={homeBlocks} lang={lang} onChangeView={setCurrentView} />;
      case 'SERVICES':
        return <PublicServices lang={lang} onChangeView={setCurrentView} />;
      case 'PROJETS':
        return <PublicProjets lang={lang} />;
      case 'A_PROPOS':
        return <PublicAPropos lang={lang} />;
      case 'ESPACE_CLIENT':
        return <EspaceClient user={user} lang={lang} />;
      case 'ADMIN_DOSSIERS':
        return <AdminDossiers lang={lang} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard lang={lang} />;
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
        return <PublicHome blocks={homeBlocks} lang={lang} onChangeView={setCurrentView} />;
    }
  };

  if (isAdminView && userIsAdmin) {
    return (
      <TextesProvider>
        <div className="min-h-screen bg-papier text-encre font-sans flex">
          <AdminSidebar
            currentView={currentView}
            onChangeView={setCurrentView}
            onSignOut={handleSignOut}
            lang={lang}
            open={menuAdminOuvert}
            onClose={() => setMenuAdminOuvert(false)}
          />
          <main className="flex-1 md:ml-64 min-h-screen overflow-x-clip">
            <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-papier/90 backdrop-blur-md border-b border-filet">
              <button
                type="button"
                onClick={() => setMenuAdminOuvert(true)}
                aria-label={lang === 'FR' ? 'Ouvrir le menu' : 'Open menu'}
                className="w-11 h-11 flex items-center justify-center rounded-pilule border border-filet text-encre"
              >
                <span className="block w-5 space-y-1"><span className="block h-0.5 bg-encre" /><span className="block h-0.5 bg-encre" /><span className="block h-0.5 bg-encre" /></span>
              </button>
              <span className="font-serif text-encre">Xena Horizon</span>
            </div>
            <Suspense fallback={<PageLoader />}>{renderView()}</Suspense>
          </main>
        </div>
      </TextesProvider>
    );
  }

  return (
    <TextesProvider>
    <DefilementDoux>
    <div className="min-h-screen bg-papier text-encre font-sans">
      <Nav
        currentView={currentView}
        onChangeView={setCurrentView}
        onRequestAdmin={requestAdmin}
        lang={lang}
        setLang={setLang}
      />
      <main className="min-h-[70vh]">
        <Suspense fallback={<PageLoader />}>{renderView()}</Suspense>
      </main>
      <Footer onAdminLogin={requestAdmin} lang={lang} />
      <Consentement lang={lang} />
      {userIsAdmin && <Editeur lang={lang} />}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAdminSignIn={() => setCurrentView('ADMIN_DASHBOARD')}
        lang={lang}
      />
    </div>
    </DefilementDoux>
    </TextesProvider>
  );
};

export default App;
