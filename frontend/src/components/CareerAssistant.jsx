import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';
import { sendSkillGapChatMessage } from '../services/api';

const starterQuestions = [
  'Which skill should I learn first?',
  'Why is this skill important?',
  'Create a learning roadmap for me',
  'What projects should I build?',
  'How can I improve my job readiness?'
];

const CareerAssistant = ({ context = {} }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'I’m your SkillBridge AI Career Assistant. Ask about your current skill gap, learning path, or career.'
    }
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const hasAnalysis = Boolean(context?.targetRole || context?.matchedSkills?.length || context?.missingSkills?.length || context?.readinessScore !== undefined);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const buildHistory = () => {
    return messages.slice(-6).map(message => ({
      role: message.role,
      content: message.content
    }));
  };

  const sendQuestion = async (question) => {
    const trimmed = String(question || '').trim();
    if (!trimmed || loading) return;

    const userQuestion = trimmed;
    const assistantContext = {
      targetRole: context.targetRole || '',
      currentSkills: Array.isArray(context.currentSkills) ? context.currentSkills : [],
      matchedSkills: Array.isArray(context.matchedSkills) ? context.matchedSkills : [],
      missingSkills: Array.isArray(context.missingSkills) ? context.missingSkills : [],
      readinessScore: typeof context.readinessScore === 'number' ? context.readinessScore : null,
      recommendations: context.recommendations || null,
      learningPath: Array.isArray(context.learningPath) ? context.learningPath : (Array.isArray(context.recommendations?.learningPath) ? context.recommendations.learningPath : []),
      gapLevels: context.gapLevels || {}
    };

    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setDraft('');
    setError('');
    setLoading(true);

    try {
      const response = await sendSkillGapChatMessage(userQuestion, assistantContext, buildHistory());
      const reply = response?.message || 'I’m ready to help you plan your next learning step.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process that right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!hasAnalysis) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Please analyze your skill gap first. Once your analysis is ready, I can give you personalized guidance.' }]);
      return;
    }

    await sendQuestion(draft);
  };

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-xl transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label={open ? 'Close SkillBridge AI Career Assistant' : 'Open SkillBridge AI Career Assistant'}
        title={open ? 'Close SkillBridge AI Career Assistant' : 'Open SkillBridge AI Career Assistant'}
        onClick={() => {
          if (!open && !hasAnalysis) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Please analyze your skill gap first. Once your analysis is ready, I can give you personalized guidance.' }]);
          }
          setOpen(!open);
        }}
      >
        {open ? <X size={24} /> : <Bot size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-2rem))] max-h-[min(600px,calc(100vh-4rem))] min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-blue-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/10 p-2">
                <Bot size={18} />
              </span>
              <div>
                <div className="font-semibold text-sm">SkillBridge AI Career Assistant</div>
                <div className="text-[11px] text-blue-100">Ask about your skill gap, learning path, or career.</div>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setOpen(false)}
              aria-label="Close SkillBridge AI Career Assistant"
              title="Close SkillBridge AI Career Assistant"
            >
              <X size={16} />
            </button>
          </div>

          <div className="bg-slate-50 px-3 py-3">
            <div className="flex flex-wrap gap-2">
              {starterQuestions.map((question, index) => (
                <button
                  key={question}
                  type="button"
                  className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={() => sendQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[330px] overflow-y-auto bg-white p-3" ref={scrollRef}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.role === 'user' ? 'bg-blue-700 text-white rounded-br-none' : 'bg-slate-50 text-slate-700 border border-slate-200 rounded-bl-none'}`}> 
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <RefreshCw size={14} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            {error && (
              <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white p-3">
            <div className="flex gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                aria-label="Ask the SkillBridge AI Career Assistant"
                placeholder="Ask about your skill gap..."
                className="min-h-[44px] max-h-[90px] flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                onClick={handleSend}
                disabled={loading || !draft.trim()}
                aria-label="Send message"
              >
                <span className="flex items-center gap-2">
                  <Send size={16} />
                  Ask
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CareerAssistant;
