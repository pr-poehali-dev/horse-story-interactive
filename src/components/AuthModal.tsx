import { useState } from "react";
import Icon from "@/components/ui/icon";
import { register, login } from "@/store/authStore";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      let result;
      if (mode === "login") {
        result = login(email, password);
      } else {
        if (!username.trim()) {
          setError("Введите имя пользователя");
          setLoading(false);
          return;
        }
        result = register(username, email, password);
      }
      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || "Произошла ошибка");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-card border border-border animate-slide-down"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-xl font-semibold tracking-wider text-foreground uppercase">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-body uppercase tracking-widest text-muted-foreground mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-muted border border-border px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-gold transition-colors"
                placeholder="Ваш никнейм"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-body uppercase tracking-widest text-muted-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-muted border border-border px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-gold transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-body uppercase tracking-widest text-muted-foreground mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-muted border border-border px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm font-body">
              <Icon name="AlertCircle" size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest py-3 text-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </button>

          {mode === "register" && (
            <p className="text-xs text-muted-foreground font-body text-center">
              При регистрации на баланс начисляется 10 ₽
            </p>
          )}
        </form>

        <div className="px-6 pb-6 border-t border-border pt-4">
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="w-full text-sm font-body text-muted-foreground hover:text-gold transition-colors"
          >
            {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </div>
    </div>
  );
}
