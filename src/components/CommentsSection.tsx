import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { addComment, getComments, type Comment, type User } from "@/store/authStore";

interface CommentsSectionProps {
  storyId: string;
  currentUser: User | null;
  onLoginRequest: () => void;
}

export default function CommentsSection({ storyId, currentUser, onLoginRequest }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setComments(getComments(storyId));
  }, [storyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    addComment(storyId, currentUser.id, currentUser.username, text.trim());
    setComments(getComments(storyId));
    setText("");
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 text-sm font-body uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors mb-4"
      >
        <Icon name="MessageSquare" size={14} />
        Комментарии ({comments.length})
        <Icon name={visible ? "ChevronUp" : "ChevronDown"} size={14} />
      </button>

      {visible && (
        <div className="space-y-4 animate-slide-down">
          {currentUser ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-display font-bold text-primary-foreground">
                  {currentUser.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Ваш комментарий..."
                  className="flex-1 bg-muted border border-border px-4 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="px-4 py-2 bg-gold text-primary-foreground text-xs font-display font-semibold uppercase tracking-wider hover:bg-amber-400 transition-colors disabled:opacity-40"
                >
                  <Icon name="Send" size={14} />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={onLoginRequest}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-gold transition-colors border border-dashed border-border px-4 py-3 w-full"
            >
              <Icon name="LogIn" size={14} />
              Войдите, чтобы оставить комментарий
            </button>
          )}

          {comments.length === 0 ? (
            <p className="text-sm font-body text-muted-foreground py-4 text-center">
              Пока нет комментариев. Будьте первым!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="comment-card pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-display font-semibold text-gold uppercase tracking-wide">
                      {c.username}
                    </span>
                    <span className="text-xs text-muted-foreground font-body">
                      {new Date(c.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-body text-foreground/90 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
