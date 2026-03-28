import { useState } from "react";
import { mishaStories } from "@/data/stories";
import StoryText from "@/components/StoryText";
import CommentsSection from "@/components/CommentsSection";
import { type User } from "@/store/authStore";

interface MishaStoriesPageProps {
  currentUser: User | null;
  onLoginRequest: () => void;
}

export default function MishaStoriesPage({ currentUser, onLoginRequest }: MishaStoriesPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeStory = mishaStories[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-xs font-body uppercase tracking-widest text-gold mb-2">Коллекция историй</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider text-foreground">
            История Миши
          </h1>
          <p className="font-body text-muted-foreground mt-2 text-sm">
            6 частей невероятных приключений
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6 flex-col md:flex-row">
          <div className="w-full md:w-56 flex-shrink-0">
            <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">Части</p>
            <div className="space-y-1">
              {mishaStories.map((story, i) => (
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
      </div>
    </div>
  );
}
