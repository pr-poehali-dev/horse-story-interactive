import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import AuthModal from "@/components/AuthModal";
import HorseStoriesPage from "@/components/HorseStoriesPage";
import MishaStoriesPage from "@/components/MishaStoriesPage";
import CabinetPage from "@/components/CabinetPage";
import { getSession, refreshSession, type User } from "@/store/authStore";

type Page = "home" | "horse" | "misha" | "cabinet";

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

  const isUnlocked = currentUser?.purchases.includes("horse_stories") ?? false;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setPage("home")}
            className="font-display text-lg font-bold uppercase tracking-widest text-foreground hover:text-gold transition-colors"
          >
            АРХИВ
          </button>

          <nav className="hidden sm:flex items-center gap-6">
            {(["home", "horse", "misha", "cabinet"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`nav-link text-xs font-body uppercase tracking-widest transition-colors ${
                  page === p ? "text-gold active" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "home" && "Главная"}
                {p === "horse" && (
                  <span className="flex items-center gap-1">
                    Лошадь
                    {!isUnlocked && <Icon name="Lock" size={10} className="text-muted-foreground" />}
                  </span>
                )}
                {p === "misha" && "Миша"}
                {p === "cabinet" && "Кабинет"}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
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
                <span className="hidden sm:block">{currentUser.username}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs font-body uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors flex items-center gap-1"
              >
                <Icon name="LogIn" size={12} />
                <span className="hidden sm:block">Войти</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-14">
        {page === "home" && (
          <HomePage
            onNavigate={setPage}
            isUnlocked={isUnlocked}
            onLoginRequest={() => setShowAuth(true)}
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
        {page === "cabinet" && (
          <CabinetPage
            currentUser={currentUser}
            onLoginRequest={() => setShowAuth(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

interface HomePageProps {
  onNavigate: (page: Page) => void;
  isUnlocked: boolean;
  onLoginRequest: () => void;
}

function HomePage({ onNavigate, isUnlocked }: HomePageProps) {
  return (
    <div>
      <section className="relative min-h-[80vh] flex items-center justify-center grid-lines overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-20">
          <div
            className="inline-flex items-center gap-2 border border-gold/30 px-4 py-1.5 mb-8 animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-body uppercase tracking-widest text-gold">
              Литературный архив
            </span>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-bold uppercase tracking-wider text-foreground mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            <span className="shimmer-text">Великие</span>
            <br />
            <span className="text-foreground">Истории</span>
          </h1>

          <p
            className="font-body text-muted-foreground text-lg mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            Эпические хроники о Лошади и Мише.
            <br />
            Драма. Месть. Дружба. Энергетики.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            <button
              onClick={() => onNavigate("horse")}
              className="group relative overflow-hidden px-8 py-4 bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors"
            >
              <span className="flex items-center gap-2 justify-center">
                {!isUnlocked && <Icon name="Lock" size={14} />}
                История Лошади
                <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {!isUnlocked && (
                <span className="absolute top-1 right-1 text-xs bg-black/20 px-1 font-body text-primary-foreground font-normal normal-case tracking-normal">
                  5 ₽
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate("misha")}
              className="group px-8 py-4 border border-border text-foreground font-display font-semibold uppercase tracking-widest text-sm hover:border-gold hover:text-gold transition-colors"
            >
              <span className="flex items-center gap-2 justify-center">
                История Миши
                <Icon name="ArrowRight" size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => onNavigate("horse")}
            className="group text-left p-8 bg-card border border-border hover:border-gold/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <span className="text-2xl">🐴</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                {!isUnlocked ? (
                  <>
                    <Icon name="Lock" size={11} />
                    <span>5 ₽</span>
                  </>
                ) : (
                  <>
                    <Icon name="Unlock" size={11} className="text-green-400" />
                    <span className="text-green-400">Открыто</span>
                  </>
                )}
              </div>
            </div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-foreground mb-2 group-hover:text-gold transition-colors">
              История Лошади
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-4">
              8 частей. Энергетики, месть маме, Мальдивы, айфон и загон.
            </p>
            <div className="flex items-center gap-1 text-xs font-body text-gold">
              <span>Читать</span>
              <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate("misha")}
            className="group text-left p-8 bg-card border border-border hover:border-gold/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <span className="text-2xl">🐻</span>
              </div>
              <span className="text-xs font-body text-green-400 flex items-center gap-1">
                <Icon name="Unlock" size={11} />
                Бесплатно
              </span>
            </div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-foreground mb-2 group-hover:text-gold transition-colors">
              История Миши
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-4">
              6 частей. Мухоморы, гиппопотам, кунг-фу и новые друзья.
            </p>
            <div className="flex items-center gap-1 text-xs font-body text-gold">
              <span>Читать</span>
              <Icon name="ArrowRight" size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div className="mt-8 p-6 bg-card border border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-gold">14</p>
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">Частей</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-gold">2</p>
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">Героя</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-gold">∞</p>
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">Драмы</p>
            </div>
          </div>
          <p className="font-body text-xs text-muted-foreground italic">
            «Абонент временно недоступен, попробуйте позже.»
          </p>
        </div>
      </section>
    </div>
  );
}