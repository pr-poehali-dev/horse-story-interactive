import { useState } from "react";
import { getReactions, toggleReaction, REACTIONS, type ReactionEmoji, type ReactionData, type User } from "@/store/authStore";

interface ReactionsBarProps {
  storyId: string;
  currentUser: User | null;
  onLoginRequest: () => void;
}

export default function ReactionsBar({ storyId, currentUser, onLoginRequest }: ReactionsBarProps) {
  const [reactions, setReactions] = useState<ReactionData>(() => getReactions(storyId));

  const handleReaction = (emoji: ReactionEmoji) => {
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    const updated = toggleReaction(storyId, currentUser.id, emoji);
    setReactions({ ...updated });
  };

  const hasReacted = (emoji: ReactionEmoji) =>
    currentUser ? (reactions[emoji] || []).includes(currentUser.id) : false;

  const totalReactions = REACTIONS.reduce((sum, e) => sum + (reactions[e]?.length || 0), 0);

  return (
    <div className="mt-6 pt-5 border-t border-border">
      <p className="text-xs font-body uppercase tracking-widest text-muted-foreground mb-3">
        Реакции {totalReactions > 0 && <span className="text-gold">· {totalReactions}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((emoji) => {
          const count = reactions[emoji]?.length || 0;
          const active = hasReacted(emoji);
          return (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              title={currentUser ? undefined : "Войдите, чтобы реагировать"}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 text-sm border transition-all duration-200
                ${active
                  ? "border-gold bg-gold/15 scale-105"
                  : "border-border hover:border-gold/50 hover:bg-muted"
                }
              `}
            >
              <span className="text-base leading-none">{emoji}</span>
              {count > 0 && (
                <span className={`font-display text-xs font-semibold ${active ? "text-gold" : "text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
