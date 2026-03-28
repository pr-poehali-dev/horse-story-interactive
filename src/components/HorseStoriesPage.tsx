import { useState } from "react";
import Icon from "@/components/ui/icon";
import { horseStories } from "@/data/stories";
import StoryText from "@/components/StoryText";
import CommentsSection from "@/components/CommentsSection";
import { type User, purchase, refreshSession } from "@/store/authStore";

interface HorseStoriesPageProps {
  currentUser: User | null;
  onUserUpdate: (user: User | null) => void;
  onLoginRequest: () => void;
}

// Индексы историй 6(1), 6(2), 6(3) — это 5, 6, 7 (0-based)
const PAID_PARTS: Record<number, { productId: string; label: string }> = {
  5: { productId: "horse_6_1", label: "Часть 6 (1)" },
  6: { productId: "horse_6_2", label: "Часть 6 (2)" },
  7: { productId: "horse_6_3", label: "Часть 6 (3)" },
};

export default function HorseStoriesPage({ currentUser, onUserUpdate, onLoginRequest }: HorseStoriesPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [partPurchaseError, setPartPurchaseError] = useState("");
  const [partPurchaseLoading, setPartPurchaseLoading] = useState(false);

  const isUnlocked = currentUser?.purchases.includes("horse_stories") ?? false;

  const isPartUnlocked = (idx: number) => {
    const part = PAID_PARTS[idx];
    if (!part) return true;
    return currentUser?.purchases.includes(part.productId) ?? false;
  };

  const handlePurchaseAll = () => {
    if (!currentUser) { onLoginRequest(); return; }
    setPurchaseLoading(true);
    setPurchaseError("");
    setTimeout(() => {
      const result = purchase(currentUser.id, "horse_stories", 5);
      if (result.success) {
        const updated = refreshSession();
        onUserUpdate(updated);
        setPurchaseSuccess(true);
      } else {
        setPurchaseError(result.error || "Ошибка покупки");
      }
      setPurchaseLoading(false);
    }, 400);
  };

  const handlePurchasePart = (idx: number) => {
    if (!currentUser) { onLoginRequest(); return; }
    const part = PAID_PARTS[idx];
    if (!part) return;
    setPartPurchaseLoading(true);
    setPartPurchaseError("");
    setTimeout(() => {
      const result = purchase(currentUser.id, part.productId, 5);
      if (result.success) {
        const updated = refreshSession();
        onUserUpdate(updated);
      } else {
        setPartPurchaseError(result.error || "Ошибка покупки");
      }
      setPartPurchaseLoading(false);
    }, 400);
  };

  const activeStory = horseStories[activeTab];
  const activeLocked = isUnlocked ? !isPartUnlocked(activeTab) : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Коллекция историй</p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-foreground">
                История Лошади
              </h1>
              <p className="font-body text-muted-foreground mt-2 text-sm">8 частей эпической саги</p>
            </div>
            {isUnlocked ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-body flex-shrink-0">
                <Icon name="Unlock" size={14} />
                <span className="hidden sm:block">Открыто</span>
              </div>
            ) : (
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-body mb-1">
                  <Icon name="Lock" size={14} />
                  <span className="hidden sm:block">Заблокировано</span>
                </div>
                <span className="text-xl sm:text-2xl font-display font-bold text-gold">5 ₽</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!isUnlocked ? (
          <div className="relative">
            <div className="grid gap-3 mb-8 opacity-30 pointer-events-none select-none">
              {horseStories.map((story, i) => (
                <div key={story.id} className="flex items-center gap-3 p-3 sm:p-4 border border-border">
                  <span className="font-display text-xs text-muted-foreground w-5">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-xs sm:text-sm font-semibold text-foreground">{story.title}</span>
                    {story.subtitle && <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">— {story.subtitle}</span>}
                  </div>
                  <Icon name="Lock" size={12} className="ml-auto text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="bg-card border border-border p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lock" size={26} className="text-gold" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider mb-2">
                  Истории 1–5
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Разблокируйте первые 5 историй за один раз
                </p>
                {currentUser && (
                  <p className="text-xs font-body text-muted-foreground mb-4">
                    Баланс: <span className="text-gold font-semibold">{currentUser.balance} ₽</span>
                  </p>
                )}
                {purchaseError && (
                  <div className="flex items-center gap-2 text-destructive text-xs font-body mb-4 justify-center">
                    <Icon name="AlertCircle" size={12} />
                    {purchaseError}
                  </div>
                )}
                {purchaseSuccess ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-body justify-center">
                    <Icon name="CheckCircle" size={16} />
                    Куплено!
                  </div>
                ) : (
                  <button
                    onClick={handlePurchaseAll}
                    disabled={purchaseLoading}
                    className="w-full bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest py-3 text-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {purchaseLoading ? "Обработка..." : currentUser ? "🔓 Купить за 5 ₽" : "🔒 Войти и купить"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 sm:gap-6 flex-col md:flex-row">
            {/* Боковая панель вкладок */}
            <div className="w-full md:w-52 flex-shrink-0">
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">Части</p>

              {/* Мобиль: горизонтальный скролл */}
              <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                {horseStories.map((story, i) => {
                  const paidPart = PAID_PARTS[i];
                  const locked = paidPart && !isPartUnlocked(i);
                  return (
                    <button
                      key={story.id}
                      onClick={() => setActiveTab(i)}
                      className={`flex-shrink-0 md:w-full text-left px-3 sm:px-4 py-2.5 flex items-center gap-2 transition-all duration-200 border-b-2 md:border-b-0 md:border-l-2 ${
                        activeTab === i
                          ? "border-gold bg-muted text-foreground"
                          : "border-transparent hover:border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <span className="font-display text-xs w-4 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="hidden sm:block flex-1 min-w-0">
                        <div className={`font-display text-xs font-semibold uppercase tracking-wide leading-tight truncate ${activeTab === i ? "text-gold" : ""}`}>
                          {story.title}
                        </div>
                        {story.subtitle && (
                          <div className="text-xs font-body text-muted-foreground mt-0.5 truncate">{story.subtitle}</div>
                        )}
                      </div>
                      {locked && <Icon name="Lock" size={10} className="text-muted-foreground flex-shrink-0 ml-auto" />}
                      {paidPart && isPartUnlocked(i) && <Icon name="Unlock" size={10} className="text-green-400 flex-shrink-0 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Контент */}
            <div className="flex-1 min-w-0">
              {activeLocked ? (
                <div key={activeStory.id} className="animate-fade-up">
                  <div className="mb-6">
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-foreground">
                      {activeStory.title}
                    </h3>
                    {activeStory.subtitle && (
                      <span className="text-gold text-sm font-body uppercase tracking-widest mt-1 block">
                        — {activeStory.subtitle}
                      </span>
                    )}
                  </div>
                  <div className="border border-border p-6 sm:p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Icon name="Lock" size={24} className="text-gold" />
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-bold uppercase tracking-wider mb-2">
                      {PAID_PARTS[activeTab]?.label}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground mb-6">
                      Эта часть продаётся отдельно
                    </p>
                    {currentUser && (
                      <p className="text-xs font-body text-muted-foreground mb-4">
                        Баланс: <span className="text-gold font-semibold">{currentUser.balance} ₽</span>
                      </p>
                    )}
                    {partPurchaseError && (
                      <div className="flex items-center gap-2 text-destructive text-xs font-body mb-4 justify-center">
                        <Icon name="AlertCircle" size={12} />
                        {partPurchaseError}
                      </div>
                    )}
                    <button
                      onClick={() => handlePurchasePart(activeTab)}
                      disabled={partPurchaseLoading}
                      className="px-8 py-3 bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors disabled:opacity-50"
                    >
                      {partPurchaseLoading ? "Обработка..." : currentUser ? "🔓 Купить за 5 ₽" : "🔒 Войти и купить"}
                    </button>
                  </div>
                </div>
              ) : (
                <div key={activeStory.id} className="animate-fade-up">
                  <StoryText
                    content={activeStory.content}
                    title={activeStory.title}
                    subtitle={activeStory.subtitle}
                  />
                  <CommentsSection
                    storyId={activeStory.id}
                    currentUser={currentUser}
                    onLoginRequest={onLoginRequest}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
