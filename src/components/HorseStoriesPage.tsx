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

export default function HorseStoriesPage({ currentUser, onUserUpdate, onLoginRequest }: HorseStoriesPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const isUnlocked = currentUser?.purchases.includes("horse_stories") ?? false;

  const handlePurchase = () => {
    if (!currentUser) {
      onLoginRequest();
      return;
    }
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

  const activeStory = horseStories[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Коллекция историй</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider text-foreground">
                История Лошади
              </h1>
              <p className="font-body text-muted-foreground mt-2 text-sm">
                8 частей эпической саги
              </p>
            </div>
            {!isUnlocked && (
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-body mb-2">
                  <Icon name="Lock" size={14} />
                  Заблокировано
                </div>
                <span className="text-2xl font-display font-bold text-gold">5 ₽</span>
              </div>
            )}
            {isUnlocked && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-body">
                <Icon name="Unlock" size={14} />
                Разблокировано
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!isUnlocked ? (
          <div className="relative">
            <div className="grid gap-3 mb-8 opacity-30 pointer-events-none select-none">
              {horseStories.map((story, i) => (
                <div key={story.id} className="flex items-center gap-3 p-4 border border-border">
                  <span className="font-display text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span className="font-display text-sm font-semibold text-foreground">{story.title}</span>
                    {story.subtitle && <span className="text-xs text-muted-foreground ml-2">— {story.subtitle}</span>}
                  </div>
                  <Icon name="Lock" size={12} className="ml-auto text-muted-foreground" />
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card border border-border p-8 max-w-sm w-full text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lock" size={28} className="text-gold" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wider mb-2">
                  Все 8 историй
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  Разблокируйте полную коллекцию историй про Лошадь за один раз
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
                    Куплено! Обновите страницу
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchaseLoading}
                    className="w-full bg-gold text-primary-foreground font-display font-semibold uppercase tracking-widest py-3 text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 animate-pulse-gold"
                  >
                    {purchaseLoading ? "Обработка..." : currentUser ? "🔓 Купить за 5 ₽" : "🔒 Войти и купить"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-6 flex-col md:flex-row">
            <div className="w-full md:w-56 flex-shrink-0">
              <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">Части</p>
              <div className="space-y-1">
                {horseStories.map((story, i) => (
                  <button
                    key={story.id}
                    onClick={() => setActiveTab(i)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-200 border-l-2 ${
                      activeTab === i
                        ? "border-l-gold bg-muted text-foreground"
                        : "border-l-transparent hover:border-l-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span className="font-display text-xs mt-0.5 w-4 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className={`font-display text-xs font-semibold uppercase tracking-wide leading-tight ${activeTab === i ? "text-gold" : ""}`}>
                        {story.title}
                      </div>
                      {story.subtitle && (
                        <div className="text-xs font-body text-muted-foreground mt-0.5">{story.subtitle}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-0">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
