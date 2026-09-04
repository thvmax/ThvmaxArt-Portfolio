'use client';

import { useChat } from '@ai-sdk/react';
import { gsap } from 'gsap';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

const PROMPTS = [
  'Walk me through the STING campaign',
  'What tools does Thu Ta Soe use?',
  'How do I get in touch?',
];

/**
 * Floating assistant, docked bottom-right on every v2 route. The FAB
 * leans toward the cursor like `Pill`, the panel scales in from the FAB's
 * own corner rather than just fading, and quick-prompt chips give first-time
 * visitors something to tap instead of staring at an empty input.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const fabRef = useRef<HTMLButtonElement | null>(null);
  const markRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  const busy = status === 'submitted' || status === 'streaming';
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (reduced) {
      panel.style.opacity = open ? '1' : '0';
      panel.style.display = open ? 'flex' : 'none';
      return;
    }

    if (open) {
      panel.style.display = 'flex';
      gsap.fromTo(
        panel,
        { opacity: 0, scale: 0.85, y: 16, transformOrigin: '100% 100%' },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      );
    } else if (panel.style.display !== 'none') {
      gsap.to(panel, {
        opacity: 0,
        scale: 0.9,
        y: 10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          panel.style.display = 'none';
        },
      });
    }
  }, [open, reduced]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [messages, status]);

  const onFabMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = fabRef.current;
    if (!el || reduced || window.matchMedia('(pointer: coarse)').matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: dx * 0.18, y: dy * 0.24, duration: 0.5, ease: 'power3.out' });
    gsap.to(markRef.current, { x: dx * 0.3, y: dy * 0.36, duration: 0.5, ease: 'power3.out' });
  };

  const onFabLeave = () => {
    gsap.to([fabRef.current, markRef.current], {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.45)',
    });
  };

  const submit = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="v2-chat">
      <div ref={panelRef} className="v2-chat-panel" role="dialog" aria-label="Chat with the site assistant">
        <div className="v2-chat-head">
          <span className="v2-chat-avatar" aria-hidden="true">TH</span>
          <div className="v2-chat-head-text">
            <span className="v2-chat-head-name">THVMAX Assistant</span>
            <span className="v2-chat-head-status">
              <span className="v2-chat-dot" aria-hidden="true" />
              {busy ? 'Typing…' : 'Online'}
            </span>
          </div>
          <button
            type="button"
            className="v2-chat-close"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            data-cursor="hover"
          >
            ✕
          </button>
        </div>

        <div className="v2-chat-log" ref={logRef} data-lenis-prevent>
          {messages.length === 0 && (
            <>
              <p className="v2-chat-empty">Ask about the work, process, or how to get in touch.</p>
              <div className="v2-chat-chips">
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="v2-chat-chip"
                    onClick={() => submit(p)}
                    data-cursor="hover"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`v2-chat-msg v2-chat-msg--${message.role}`}>
              {message.parts.map((part, i) =>
                part.type === 'text' ? <span key={`${message.id}-${i}`}>{part.text}</span> : null,
              )}
            </div>
          ))}
          {busy && (
            <div className="v2-chat-msg v2-chat-msg--assistant v2-chat-msg--typing" aria-live="polite">
              <span className="v2-chat-typing-dot" />
              <span className="v2-chat-typing-dot" />
              <span className="v2-chat-typing-dot" />
            </div>
          )}
        </div>

        <form
          className="v2-chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <input
            className="v2-chat-input"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Say something…"
            aria-label="Message"
            disabled={busy}
          />
          <button type="submit" className="v2-chat-send" disabled={busy || !input.trim()}>
            Send
          </button>
        </form>
      </div>

      <button
        ref={fabRef}
        type="button"
        className="v2-chat-fab"
        onClick={() => setOpen((v) => !v)}
        onMouseMove={onFabMove}
        onMouseLeave={onFabLeave}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat'}
        data-cursor="hover"
      >
        <span ref={markRef} className="v2-chat-fab-mark" aria-hidden="true">
          {open ? '✕' : 'TH'}
        </span>
        <span className="v2-chat-fab-label">{open ? 'Close' : 'Ask THVMAX'}</span>
      </button>
    </div>
  );
}
