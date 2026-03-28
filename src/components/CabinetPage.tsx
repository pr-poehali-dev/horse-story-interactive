import Icon from "@/components/ui/icon";
import { type User, clearSession } from "@/store/authStore";

interface CabinetPageProps {
  currentUser: User | null;
  onLoginRequest: () => void;
  onLogout: () => void;
}

export default function CabinetPage({ currentUser, onLoginRequest, onLogout }: CabinetPageProps) {
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Icon name="User" size={36} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider mb-3">Личный кабинет</h2>
          <p className="font-body text-muted-foreground text-sm mb-6">
            Войдите в аккаунт, чтобы получить доступ к кабинету
          </p>
          <button
            onClick={onLoginRequest}
            className="px-8 py-3 bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors"
          >
            Войти в аккаунт
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Профиль</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-foreground">
            Личный кабинет
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        <div className="bg-card border border-border p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-primary-foreground">
                {currentUser.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-foreground">
                {currentUser.username}
              </h3>
              <p className="font-body text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 border border-border">
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-1">Баланс</p>
              <p className="font-display text-2xl font-bold text-gold">{currentUser.balance} ₽</p>
            </div>
            <div className="bg-muted p-4 border border-border">
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-1">Покупки</p>
              <p className="font-display text-2xl font-bold text-foreground">{currentUser.purchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Мои покупки
          </h4>
          {currentUser.purchases.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="ShoppingBag" size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="font-body text-sm text-muted-foreground">Вы ещё ничего не купили</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { id: "horse_stories", label: "История Лошади — 1–5", sub: "5 частей · 5 ₽", emoji: "🐴" },
                { id: "horse_6_1", label: "Лошадь 6 (Часть 1)", sub: "5 ₽", emoji: "🐴" },
                { id: "horse_6_2", label: "Лошадь 6 (Часть 2)", sub: "5 ₽", emoji: "🐴" },
                { id: "horse_6_3", label: "Лошадь 6 (Часть 3)", sub: "5 ₽", emoji: "🐴" },
                { id: "misha_6", label: "История Миши 6", sub: "Финал · 5 ₽", emoji: "🐻" },
                { id: "secret_cat", label: "Секретная история про кота", sub: "Задание · бесплатно", emoji: "🐱" },
              ]
                .filter(p => currentUser.purchases.includes(p.id))
                .map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 sm:p-4 border border-border">
                    <div className="w-8 h-8 bg-gold/20 flex items-center justify-center flex-shrink-0 text-base">
                      {p.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xs sm:text-sm font-semibold uppercase tracking-wide text-foreground truncate">
                        {p.label}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">{p.sub}</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-xs font-body flex-shrink-0">
                      <Icon name="CheckCircle" size={12} />
                      <span className="hidden sm:block">Активно</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border p-6">
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Безопасность
          </h4>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-body text-destructive hover:text-red-400 transition-colors"
          >
            <Icon name="LogOut" size={14} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}