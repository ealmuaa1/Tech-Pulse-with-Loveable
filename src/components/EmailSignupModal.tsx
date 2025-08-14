// src/components/EmailSignupModal.tsx
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { upsertSubscriber } from '@/services/newsletter';
import { motion, AnimatePresence } from 'framer-motion';

const DISMISS_KEY = 'tp:newsletter:dismissed:v2';

type Answers = {
  email: string;
  interests: string[];
  primary_goal: string;
  update_frequency: string;
  usage_type: string;
};

const defaultAnswers: Answers = {
  email: '',
  interests: [],
  primary_goal: '',
  update_frequency: '',
  usage_type: '',
};

export default function EmailSignupModal() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Show only after login, and only if not dismissed
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return; // must be logged in for the popup and RLS

      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (!dismissed) {
        setAnswers(a => ({ ...a, email: session.user.email ?? '' }));
        setOpen(true);
      }
    })();
  }, []);

  const canSubmit = useMemo(() => {
    return !!answers.email &&
      answers.interests.length > 0 &&
      !!answers.primary_goal &&
      !!answers.update_frequency &&
      !!answers.usage_type;
  }, [answers]);

  async function handleFinish() {
    if (!canSubmit) return;
    setLoading(true);
    const { error } = await upsertSubscriber({
      email: answers.email,
      interests: answers.interests,
      primary_goal: answers.primary_goal,
      update_frequency: answers.update_frequency,
      usage_type: answers.usage_type,
    });
    setLoading(false);

    if (error) {
      console.error('Newsletter subscription error:', error);
      alert('We could not save your preferences. Please try again after logging in.');
      return;
    }

    setDone(true);
    localStorage.setItem(DISMISS_KEY, '1');
    // Close after brief success state
    setTimeout(() => setOpen(false), 1400);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Stay in the loop</h3>
            <p className="text-sm text-gray-600">
              Weekly AI & tech updates, plus hand-picked tools. Tell us what you want more of:
            </p>
          </div>

          {/* Email (read-only from session) */}
          <div className="mb-3">
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-700 bg-gray-50"
              value={answers.email}
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">Uses your signed-in email.</p>
          </div>

          {/* Interests (multi-select via simple checkboxes) */}
          <fieldset className="mb-3">
            <legend className="text-sm font-medium">Which areas interest you most?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {['AI', 'Automation', 'Mobile', 'Web3', 'Security', 'Data'].map(opt => {
                const selected = answers.interests.includes(opt);
                return (
                  <label key={opt} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${selected ? 'bg-indigo-50 border-indigo-300' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) =>
                        setAnswers(a => ({
                          ...a,
                          interests: e.target.checked
                            ? [...a.interests, opt]
                            : a.interests.filter(x => x !== opt)
                        }))
                      }
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Primary goal */}
          <div className="mb-3">
            <label className="text-sm font-medium">Your primary goal with AI</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={answers.primary_goal}
              onChange={(e) => setAnswers(a => ({ ...a, primary_goal: e.target.value }))}
            >
              <option value="">Select…</option>
              <option value="learn_basics">Learn the basics</option>
              <option value="boost_productivity">Boost productivity</option>
              <option value="build_products">Build products</option>
              <option value="career_growth">Career growth</option>
            </select>
          </div>

          {/* Update frequency */}
          <div className="mb-3">
            <label className="text-sm font-medium">How often should we update you?</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={answers.update_frequency}
              onChange={(e) => setAnswers(a => ({ ...a, update_frequency: e.target.value }))}
            >
              <option value="">Select…</option>
              <option value="weekly">Weekly</option>
              <option value="twice_month">Twice a month</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Usage type */}
          <div className="mb-4">
            <label className="text-sm font-medium">Using AI for…</label>
            <div className="mt-2 flex gap-2">
              {['personal', 'business', 'both'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers(a => ({ ...a, usage_type: opt }))}
                  className={`rounded-lg border px-3 py-2 text-sm ${answers.usage_type === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-gray-50'}`}
                >
                  {opt[0].toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              onClick={() => {
                localStorage.setItem(DISMISS_KEY, '1');
                setOpen(false);
              }}
            >
              Not now
            </button>

            <button
              type="button"
              disabled={!canSubmit || loading}
              onClick={handleFinish}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving…' : (done ? 'Saved!' : 'Finish')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
