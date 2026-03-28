import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import AuthModal from "@/components/AuthModal";
import HorseStoriesPage from "@/components/HorseStoriesPage";
import MishaStoriesPage from "@/components/MishaStoriesPage";
import CabinetPage from "@/components/CabinetPage";
import QuestsPage from "@/components/QuestsPage";
import { getSession, refreshSession, type User } from "@/store/authStore";

type Page = "home" | "horse" | "misha" | "quests" | "cabinet";

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "horse", label: "Лошадь", icon: "BookOpen" },
  { id: "misha", label: "Миша", icon: "BookMarked" },
  { id: "quests", label: "Задания", icon: "Trophy" },
  { id: "cabinet", label: "Кабинет", icon: "User" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const user = refreshSession();
    setCurrentUser(user);
    setMounted(true);
  }, []);

  const handleAuthSuccess = () => {
    const user = getSession();
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
  };

  const handleUserUpdate = (user: User | null) => {
    setCurrentUser(user);
  };

  const isHorseUnlocked = currentUser?.purchases.includes("horse_stories") ?? false;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setPage("home")}
            className="font-display text-base sm:text-lg font-bold uppercase tracking-widest text-foreground hover:text-gold transition-colors"
          >
            АРХИВ
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`nav-link text-xs font-body uppercase tracking-widest transition-colors flex items-center gap-1 ${
                  page === item.id ? "text-gold active" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.id === "horse" && !isHorseUnlocked && (
                  <Icon name="Lock" size={9} className="text-muted-foreground" />
                )}
              </button>
            ))}
          </nav>

          {/* Auth button (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setPage("cabinet")}
                className="flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-gold transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-xs font-display font-bold text-primary-foreground">
                    {currentUser.username[0].toUpperCase()}
                  </span>
                </div>
                <span>{currentUser.username}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs font-body uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5"
              >
                <Icon name="LogIn" size={12} />
                Войти
              </button>
            )}
          </div>

          {/* Mobile: auth avatar */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setPage("cabinet")}
                className="w-7 h-7 rounded-full bg-gold flex items-center justify-center"
              >
                <span className="text-xs font-display font-bold text-primary-foreground">
                  {currentUser.username[0].toUpperCase()}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-muted-foreground hover:text-gold transition-colors"
              >
                <Icon name="LogIn" size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-14 pb-16 md:pb-0">
        {page === "home" && (
          <HomePage
            onNavigate={setPage}
            isHorseUnlocked={isHorseUnlocked}
          />
        )}
        {page === "horse" && (
          <HorseStoriesPage
            currentUser={currentUser}
            onUserUpdate={handleUserUpdate}
            onLoginRequest={() => setShowAuth(true)}
          />
        )}
        {page === "misha" && (
          <MishaStoriesPage
            currentUser={currentUser}
            onUserUpdate={handleUserUpdate}
            onLoginRequest={() => setShowAuth(true)}
          />
        )}
        {page === "quests" && (
          <QuestsPage
            currentUser={currentUser}
            onUserUpdate={handleUserUpdate}
            onLoginRequest={() => setShowAuth(true)}
          />
        )}
        {page === "cabinet" && (
          <CabinetPage
            currentUser={currentUser}
            onLoginRequest={() => setShowAuth(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card border-t border-border">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 flex-1 transition-colors relative ${
                page === item.id ? "text-gold" : "text-muted-foreground"
              }`}
            >
              <Icon name={item.icon} size={18} />
              <span className="text-[9px] font-body uppercase tracking-wide leading-none">
                {item.label}
              </span>
              {item.id === "horse" && !isHorseUnlocked && (
                <span className="absolute top-1 right-2">
                  <Icon name="Lock" size={8} className="text-muted-foreground" />
                </span>
              )}
              {page === item.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
interface HomePageProps {
  onNavigate: (page: Page) => void;
  isHorseUnlocked: boolean;
}

function HomePage({ onNavigate, isHorseUnlocked }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center grid-lines overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-5 py-16 sm:py-20">
          <div
            className="inline-flex items-center gap-2 border border-gold/30 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-body uppercase tracking-widest text-gold">
              Литературный архив
            </span>
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-wider text-foreground mb-5 sm:mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <span className="shimmer-text">Великие</span>
            <br />
            <span className="text-foreground">Истории</span>
          </h1>

          <p
            className="font-body text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            Эпические хроники о Лошади и Мише.
            <br />
            Драма. Месть. Дружба. Энергетики.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <button
              onClick={() => onNavigate("horse")}
              className="group relative overflow-hidden px-6 sm:px-8 py-3.5 sm:py-4 bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors"
            >
              <span className="flex items-center gap-2 justify-center">
                {!isHorseUnlocked && <Icon name="Lock" size={14} />}
                История Лошади
                <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {!isHorseUnlocked && (
                <span className="absolute top-1 right-1 text-xs bg-black/20 px-1 font-body text-primary-foreground font-normal normal-case tracking-normal">
                  5 ₽
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate("misha")}
              className="group px-6 sm:px-8 py-3.5 sm:py-4 border border-border text-foreground font-display font-semibold uppercase tracking-widest text-sm hover:border-gold hover:text-gold transition-colors"
            >
              <span className="flex items-center gap-2 justify-center">
                История Миши
                <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => onNavigate("horse")}
            className="group text-left p-5 sm:p-8 bg-card border border-border hover:border-gold/50 transition-all duration-300 active:scale-[0.99]"
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <span className="text-xl sm:text-2xl">🐴</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                {!isHorseUnlocked ? (
                  <><Icon name="Lock" size={11} /><span>5 ₽</span></>
                ) : (
                  <><Icon name="Unlock" size={11} className="text-green-400" /><span className="text-green-400">Открыто</span></>
                )}
              </div>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground mb-2 group-hover:text-gold transition-colors">
              История Лошади
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-3 sm:mb-4">
              8 частей. Энергетики, месть маме, Мальдивы, айфон и загон.
            </p>
            <div className="flex items-center gap-1 text-xs font-body text-gold">
              <span>Читать</span>
              <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate("misha")}
            className="group text-left p-5 sm:p-8 bg-card border border-border hover:border-gold/50 transition-all duration-300 active:scale-[0.99]"
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <span className="text-xl sm:text-2xl">🐻</span>
              </div>
              <span className="text-xs font-body text-green-400 flex items-center gap-1">
                <Icon name="Unlock" size={11} />
                Бесплатно
              </span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground mb-2 group-hover:text-gold transition-colors">
              История Миши
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-3 sm:mb-4">
              6 частей. Мухоморы, гиппопотам, кунг-фу и новые друзья.
            </p>
            <div className="flex items-center gap-1 text-xs font-body text-gold">
              <span>Читать</span>
              <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate("quests")}
            className="group text-left p-5 sm:p-8 bg-card border border-border hover:border-gold/50 transition-all duration-300 active:scale-[0.99] sm:col-span-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors flex-shrink-0">
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-foreground mb-1 group-hover:text-gold transition-colors">
                  Задания
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  Проводи время — зарабатывай рубли и открывай секретную историю про кота 🐱
                </p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-gold group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </button>
        </div>

        <div className="mt-4 sm:mt-8 p-4 sm:p-6 bg-card border border-border flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold">14</p>
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">Частей</p>
            </div>
            <div className="w-px h-8 sm:h-10 bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold">2</p>
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">Героя</p>
            </div>
            <div className="w-px h-8 sm:h-10 bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold">∞</p>
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">Драмы</p>
            </div>
          </div>
          <p className="font-body text-xs text-muted-foreground italic hidden sm:block">
            «Абонент временно недоступен, попробуйте позже.»
          </p>
        </div>
      </section>
    </div>
  );
}
