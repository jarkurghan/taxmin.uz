"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { commentsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, formatAbsoluteTime, cn } from "@/lib/utils";
import type { Comment } from "@/types";

interface CommentSectionProps {
  predictionId: string;
  initialCount?: number;
}

export function CommentSection({ predictionId, initialCount = 0 }: CommentSectionProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Link href="/auth/telegram/callback" className="flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-400 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Izohlarni ko'rish uchun kiring
      </Link>
    );
  }
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(initialCount);

  const load = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await commentsAPI.getAll(predictionId);
      setComments(res.data);
      setCount(res.data.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0));
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!open) load();
    setOpen((v) => !v);
  };

  const handleAdd = (comment: Comment) => {
    if (comment.parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.parentId ? { ...c, replies: [...(c.replies ?? []), comment] } : c
        )
      );
    } else {
      setComments((prev) => [{ ...comment, replies: [] }, ...prev]);
    }
    setCount((n) => n + 1);
  };

  const handleUpdate = (updated: Comment) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === updated.id) return { ...updated, replies: c.replies };
        return {
          ...c,
          replies: c.replies?.map((r) => (r.id === updated.id ? updated : r)),
        };
      })
    );
  };

  const handleDelete = (commentId: string, parentId: string | null) => {
    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId ? { ...c, replies: c.replies?.filter((r) => r.id !== commentId) } : c
        )
      );
    } else {
      const target = comments.find((c) => c.id === commentId);
      const removedCount = 1 + (target?.replies?.length ?? 0);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCount((n) => n - removedCount);
      return;
    }
    setCount((n) => n - 1);
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {count > 0 ? `${count} izoh` : "Izoh yozish"}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {loading && (
            <div className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          )}

          {!loading && comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              predictionId={predictionId}
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}

          {!loading && loaded && (
            <CommentInput
              predictionId={predictionId}
              parentId={null}
              onAdd={handleAdd}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Thread ───────────────────────────────────────────────────────────────────

interface ThreadProps {
  comment: Comment;
  predictionId: string;
  onAdd: (c: Comment) => void;
  onUpdate: (c: Comment) => void;
  onDelete: (id: string, parentId: string | null) => void;
}

function CommentThread({ comment, predictionId, onAdd, onUpdate, onDelete }: ThreadProps) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div>
      <CommentItem
        comment={comment}
        predictionId={predictionId}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onReply={() => setShowReply((v) => !v)}
        canReply
      />

      {(comment.replies?.length ?? 0) > 0 && (
        <div
          className="ml-8 mt-1.5 space-y-1.5 pl-3"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              predictionId={predictionId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              canReply={false}
            />
          ))}
        </div>
      )}

      {showReply && (
        <div className="ml-8 mt-1.5 pl-3" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
          <CommentInput
            predictionId={predictionId}
            parentId={comment.id}
            onAdd={(c) => { onAdd(c); setShowReply(false); }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

// ─── Single comment item ──────────────────────────────────────────────────────

interface ItemProps {
  comment: Comment;
  predictionId: string;
  onUpdate: (c: Comment) => void;
  onDelete: (id: string, parentId: string | null) => void;
  onReply?: () => void;
  canReply: boolean;
}

function CommentItem({ comment, predictionId, onUpdate, onDelete, onReply, canReply }: ItemProps) {
  const { user } = useAuth();
  const isOwn = user?.id === comment.user.id;
  const isEditable = Date.now() - new Date(comment.createdAt).getTime() < 24 * 60 * 60 * 1000;
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
    }
  }, [editing]);

  const saveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === comment.content) { setEditing(false); return; }
    setSaving(true);
    try {
      const updated = await commentsAPI.update(predictionId, comment.id, trimmed);
      onUpdate(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await commentsAPI.delete(predictionId, comment.id);
      onDelete(comment.id, comment.parentId);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const isEdited = comment.updatedAt !== comment.createdAt;

  return (
    <div className="flex gap-2.5 group">
      <UserAvatar user={comment.user} size={26} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-zinc-300">
            {getUserDisplayName(comment.user)}
          </span>
          <span className="text-[10px] text-zinc-700">{formatAbsoluteTime(comment.createdAt)}</span>
          {isEdited && <span className="text-[10px] text-zinc-700">(tahrirlangan)</span>}
        </div>

        {editing ? (
          <div className="mt-1 space-y-1.5">
            <textarea
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                if (e.key === "Escape") setEditing(false);
              }}
              rows={2}
              maxLength={500}
              className="w-full text-xs text-zinc-200 bg-transparent resize-none outline-none rounded-lg px-2.5 py-1.5"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
            />
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="text-[11px] font-semibold text-green-400 hover:text-green-300 disabled:opacity-40"
              >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
              <button onClick={() => setEditing(false)} className="text-[11px] text-zinc-600 hover:text-zinc-400">
                Bekor
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed break-words">{comment.content}</p>
        )}

        {!editing && (
          <div className="flex items-center gap-3 mt-1">
            {canReply && user && (
              <button
                onClick={onReply}
                className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors"
              >
                Javob
              </button>
            )}
            {isOwn && isEditable && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-[11px] text-zinc-700 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Tahrirlash
                </button>
                {confirmDelete ? (
                  <span className="flex items-center gap-1.5">
                    <button
                      onClick={doDelete}
                      disabled={deleting}
                      className="text-[11px] font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
                    >
                      {deleting ? "..." : "Ha, o'chirish"}
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="text-[11px] text-zinc-700 hover:text-zinc-400">
                      Bekor
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-[11px] text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    O'chirish
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Comment input ────────────────────────────────────────────────────────────

interface InputProps {
  predictionId: string;
  parentId: string | null;
  onAdd: (c: Comment) => void;
  autoFocus?: boolean;
}

function CommentInput({ predictionId, parentId, onAdd, autoFocus }: InputProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  if (!user) {
    return (
      <p className="text-[11px] text-zinc-700 py-1">
        Izoh yozish uchun tizimga kiring.
      </p>
    );
  }

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const comment = await commentsAPI.create(predictionId, trimmed, parentId ?? undefined);
      onAdd(comment);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-2 items-start">
      <UserAvatar user={user} size={26} />
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
          }}
          placeholder={parentId ? "Javob yozing..." : "Izoh yozing..."}
          rows={1}
          maxLength={500}
          className="w-full text-xs text-zinc-300 placeholder-zinc-700 bg-transparent resize-none outline-none rounded-xl px-3 py-2 pr-16"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
        />
        <button
          onClick={submit}
          disabled={!text.trim() || submitting}
          className={cn(
            "absolute right-2 top-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
            text.trim() && !submitting
              ? "text-green-400 hover:text-green-300"
              : "text-zinc-700 cursor-not-allowed"
          )}
        >
          {submitting ? "..." : "Yuborish"}
        </button>
      </div>
    </div>
  );
}

// ─── Avatar helper ────────────────────────────────────────────────────────────

function UserAvatar({ user, size }: { user: { firstName: string; photoUrl?: string | null }; size: number }) {
  if (user.photoUrl) {
    return (
      <Image
        src={user.photoUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-full flex-shrink-0 object-cover"
        style={{ border: "1px solid rgba(255,255,255,0.08)", minWidth: size, minHeight: size, width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        minWidth: size,
        fontSize: size * 0.4,
        background: "linear-gradient(135deg, #22c55e, #15803d)",
      }}
    >
      {user.firstName[0]}
    </div>
  );
}
