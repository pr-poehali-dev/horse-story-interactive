import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import {
  type User,
  getQuestProgress,
  saveQuestProgress,
  claimQuest,
  refreshSession,
} from "@/store/authStore";
import StoryText from "@/components/StoryText";
import CommentsSection from "@/components/CommentsSection";

interface QuestsPageProps {
  currentUser: User | null;
  onUserUpdate: (user: User | null) => void;
  onLoginRequest: () => void;
}

const SECRET_STORY = {
  id: "secret-cat",
  title: "Секретная история",
  subtitle: "История про кота",
  content: `Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу
Мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу мяу`,
};

export default function QuestsPage({ currentUser, onUserUpdate, onLoginRequest }: QuestsPageProps) {
  const [progress, setProgress] = useState(getQuestProgress);
  const [claimResult, setClaimResult] = useState<Record<string, string>>({});
  const [showSecret, setShowSecret] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasSecretCat = currentUser?.purchases.includes("secret_cat") ?? false;

  // Таймер — обновляет minutesSpent каждые 60 секунд
  useEffect(() => {
    const p = getQuestProgress();
    if (!p.sessionStart) {
      p.sessionStart = Date.now();
      saveQuestProgress(p);
    }
    setProgress({ ...p });

    timerRef.current = setInterval(() => {
      const cur = getQuestProgress();
      const elapsed = Math.floor((Date.now() - (cur.sessionStart ?? Date.now())) / 60000);
      cur.minutesSpent = elapsed;
      saveQuestProgress(cur);
      setProgress({ ...cur });
    }, 5000); // обновляем каждые 5 сек для наглядности в dev, в реальности можно раз в минуту

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleClaim = (quest: "5" | "10" | "15") => {
    if (!currentUser) { onLoginRequest(); return; }
    const result = claimQuest(currentUser.id, quest);
    if (result.success) {
      const updated = refreshSession();
      onUserUpdate(updated);
      setProgress(getQuestProgress());
      setClaimResult(prev => ({ ...prev, [quest]: result.secretUnlocked ? "secret" : "ok" }));
    } else {
      setClaimResult(prev => ({ ...prev, [quest]: result.error || "Ошибка" }));
    }
  };

  const minutesNow = progress.minutesSpent;

  const quests = [
    {
      id: "5" as const,
      title: "5 минут на сайте",
      reward: "+5 ₽",
      secret: false,
      required: 5,
      claimed: progress.claimed5,
    },
    {
      id: "10" as const,
      title: "10 минут на сайте",
      reward: "+5 ₽",
      secret: false,
      required: 10,
      claimed: progress.claimed10,
    },
    {
      id: "15" as const,
      title: "15 минут на сайте",
      reward: "+5 ₽ + Секретная история",
      secret: true,
      required: 15,
      claimed: progress.claimed15,
    },
  ];

  // Прогресс-бар до следующего незавершённого задания
  const nextQuest = quests.find(q => !q.claimed);
  const barPercent = nextQuest
    ? Math.min(100, Math.floor((minutesNow / nextQuest.required) * 100))
    : 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Активности</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-foreground">
            Задания
          </h1>
          <p className="font-body text-muted-foreground mt-2 text-sm">
            Проводи время на сайте — зарабатывай рубли и открывай секреты
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* Таймер */}
        <div className="bg-card border border-border p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-body uppercase tracking-widest text-muted-foreground">
              Время на сайте
            </p>
            <div className="flex items-center gap-2 text-gold">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-2xl font-bold">{minutesNow}</span>
              <span className="text-xs font-body text-muted-foreground">мин</span>
            </div>
          </div>
          {nextQuest && (
            <>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gold transition-all duration-1000"
                  style={{ width: `${barPercent}%` }}
                />
              </div>
              <p className="text-xs font-body text-muted-foreground">
                До задания «{nextQuest.title}»: ещё {Math.max(0, nextQuest.required - minutesNow)} мин
              </p>
            </>
          )}
          {!nextQuest && (
            <p className="text-xs font-body text-green-400">Все задания выполнены!</p>
          )}
        </div>

        {/* Список заданий */}
        <div className="space-y-3">
          {quests.map((q) => {
            const canClaim = !q.claimed && minutesNow >= q.required;
            const msg = claimResult[q.id];

            return (
              <div
                key={q.id}
                className={`bg-card border p-4 sm:p-5 flex items-center gap-4 transition-all ${
                  q.claimed ? "border-green-500/30 opacity-70" : canClaim ? "border-gold/50" : "border-border"
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center border ${
                  q.claimed ? "bg-green-500/10 border-green-500/30" : canClaim ? "bg-gold/10 border-gold/30 animate-pulse-gold" : "bg-muted border-border"
                }`}>
                  {q.claimed
                    ? <Icon name="CheckCircle" size={20} className="text-green-400" />
                    : q.secret
                    ? <span className="text-xl">🐱</span>
                    : <Icon name="Clock" size={20} className={canClaim ? "text-gold" : "text-muted-foreground"} />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-display text-sm font-semibold uppercase tracking-wide ${
                      q.claimed ? "text-muted-foreground" : "text-foreground"
                    }`}>
                      {q.title}
                    </p>
                    {q.secret && !q.claimed && (
                      <span className="text-xs border border-gold/40 text-gold px-1.5 py-0.5 font-body">
                        Секрет
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-body text-gold mt-0.5">{q.reward}</p>
                  {!q.claimed && (
                    <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden w-full max-w-[160px]">
                      <div
                        className="h-full bg-gold/60 transition-all duration-500"
                        style={{ width: `${Math.min(100, (minutesNow / q.required) * 100)}%` }}
                      />
                    </div>
                  )}
                  {msg && msg !== "ok" && msg !== "secret" && (
                    <p className="text-xs text-destructive font-body mt-1">{msg}</p>
                  )}
                  {msg === "secret" && (
                    <p className="text-xs text-green-400 font-body mt-1">🐱 Секретная история разблокирована!</p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {q.claimed ? (
                    <span className="text-xs font-body text-green-400">Получено</span>
                  ) : (
                    <button
                      onClick={() => handleClaim(q.id)}
                      disabled={!canClaim}
                      className={`px-3 sm:px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
                        canClaim
                          ? "bg-gold text-primary-foreground hover:bg-amber-400"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {currentUser ? "Забрать" : "Войти"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Секретная история */}
        {hasSecretCat && (
          <div className="border border-gold/30 bg-card p-5 sm:p-6 animate-fade-up">
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="flex items-center gap-3 w-full text-left group"
            >
              <span className="text-2xl">🐱</span>
              <div className="flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-gold">
                  Секретная история
                </p>
                <p className="text-xs font-body text-muted-foreground">История про кота</p>
              </div>
              <Icon name={showSecret ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground group-hover:text-gold transition-colors" />
            </button>

            {showSecret && (
              <div className="mt-5 border-t border-border pt-5 animate-slide-down">
                <StoryText
                  content={SECRET_STORY.content}
                  title={SECRET_STORY.title}
                  subtitle={SECRET_STORY.subtitle}
                />
                <CommentsSection
                  storyId={SECRET_STORY.id}
                  currentUser={currentUser}
                  onLoginRequest={onLoginRequest}
                />
              </div>
            )}
          </div>
        )}

        {!hasSecretCat && (
          <div className="border border-dashed border-border p-5 sm:p-6 text-center">
            <span className="text-3xl mb-3 block">🔒</span>
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Секретная история
            </p>
            <p className="text-xs font-body text-muted-foreground">
              Выполни задание «15 минут на сайте» чтобы разблокировать
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
