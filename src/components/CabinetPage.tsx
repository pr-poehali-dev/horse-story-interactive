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
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Профиль</p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-wider text-foreground">
            Личный кабинет
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
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
              {currentUser.purchases.includes("horse_stories") && (
                <div className="flex items-center gap-3 p-4 border border-border">
                  <div className="w-8 h-8 bg-gold/20 flex items-center justify-center">
                    <Icon name="BookOpen" size={14} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                      История Лошади — Полная коллекция
                    </p>
                    <p className="font-body text-xs text-muted-foreground">8 частей · 5 ₽</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-xs font-body">
                    <Icon name="CheckCircle" size={12} />
                    Активно
                  </div>
                </div>
              )}
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
