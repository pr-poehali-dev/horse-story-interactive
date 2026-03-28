import { useState } from "react";
import Icon from "@/components/ui/icon";
import { mishaStories } from "@/data/stories";
import StoryText from "@/components/StoryText";
import CommentsSection from "@/components/CommentsSection";
import { type User, purchase, refreshSession } from "@/store/authStore";

interface MishaStoriesPageProps {
  currentUser: User | null;
  onUserUpdate: (user: User | null) => void;
  onLoginRequest: () => void;
}

const MISHA6_PRODUCT = "misha_6";

export default function MishaStoriesPage({ currentUser, onUserUpdate, onLoginRequest }: MishaStoriesPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const isMisha6Unlocked = currentUser?.purchases.includes(MISHA6_PRODUCT) ?? false;
  const activeStory = mishaStories[activeTab];
  const isLocked = activeTab === 5 && !isMisha6Unlocked;

  const handlePurchase = () => {
    if (!currentUser) { onLoginRequest(); return; }
    setPurchaseLoading(true);
    setPurchaseError("");
    setTimeout(() => {
      const result = purchase(currentUser.id, MISHA6_PRODUCT, 5);
      if (result.success) {
        const updated = refreshSession();
        onUserUpdate(updated);
      } else {
        setPurchaseError(result.error || "Ошибка покупки");
      }
      setPurchaseLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Коллекция историй</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-foreground">
            История Миши
          </h1>
          <p className="font-body text-muted-foreground mt-2 text-sm">
            6 частей невероятных приключений
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-4 sm:gap-6 flex-col md:flex-row">
          <div className="w-full md:w-52 flex-shrink-0">
            <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">Части</p>
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {mishaStories.map((story, i) => {
                const locked = i === 5 && !isMisha6Unlocked;
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
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {isLocked ? (
              <div className="animate-fade-up">
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-foreground">
                    {activeStory.title}
                  </h3>
                  <span className="text-gold text-sm font-body uppercase tracking-widest mt-1 block">
                    — Финальная часть
                  </span>
                </div>

                <div className="border border-border p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Icon name="Lock" size={28} className="text-gold" />
                  </div>
                  <h4 className="font-display text-lg font-bold uppercase tracking-wider mb-2">
                    Заключительная глава
                  </h4>
                  <p className="font-body text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                    Узнайте, что случилось с Мишей, Гиппо и Бобом в финале первой главы
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

                  <button
                    onClick={handlePurchase}
                    disabled={purchaseLoading}
                    className="px-8 py-3 bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 animate-pulse-gold"
                  >
                    {purchaseLoading
                      ? "Обработка..."
                      : currentUser
                      ? "🔓 Купить за 5 ₽"
                      : "🔒 Войти и купить"}
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
      </div>
    </div>
  );
}