// One0 Base Kit - Vite + React + Firebase + OpenAI + Tailwind + Framer Motion

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from './firebase-config';

const db = getFirestore(app);

const One0 = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logType, setLogType] = useState('gpt_logs');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const logToFirebase = async (collectionName, payload) => {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collectionName, data: payload })
      });
    } catch (err) {
      console.error('Firebase log error:', err);
    }
  };

  const fetchLogs = async (type = 'gpt_logs') => {
    try {
      const logsRef = collection(db, type);
      const snap = await getDocs(logsRef);
      const allLogs = snap.docs.map(doc => doc.data());
      setLogs(allLogs);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    if (showAdmin) fetchLogs(logType);
  }, [logType, showAdmin]);

  const handleGPT = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.reply);
      logToFirebase('gpt_logs', { input, reply: data.reply });
    } catch (err) {
      console.error(err);
      setResponse('Error calling GPT.');
    } finally {
      setLoading(false);
      if (showAdmin) fetchLogs('gpt_logs');
    }
  };

  const handleWebhook = async () => {
    try {
      await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, { method: 'POST' });
      alert('n8n webhook triggered!');
      logToFirebase('n8n_logs', { triggered: true });
    } catch (err) {
      console.error(err);
      alert('Error triggering webhook.');
    }
  };

  const handleSlack = async () => {
    try {
      await fetch('/api/slack', { method: 'POST' });
      alert('Slack message sent!');
      logToFirebase('slack_logs', { sent: true });
    } catch (err) {
      console.error(err);
      alert('Error sending Slack message.');
    }
  };

  const handleCalendly = async () => {
    try {
      await fetch('/api/calendly', { method: 'POST' });
      alert('Calendly webhook triggered!');
      logToFirebase('calendly_logs', { hook: 'triggered' });
    } catch (err) {
      console.error(err);
      alert('Error triggering Calendly.');
    }
  };

  const handleVoice = async () => {
    try {
      const res = await fetch('/api/elevenlabs', { method: 'POST' });
      const data = await res.json();
      alert(`Voice request sent! Audio size: ${data.audioLength} bytes`);
      logToFirebase('voice_logs', { status: 'success', audioLength: data.audioLength, audioUrl: data.audioUrl });
    } catch (err) {
      console.error(err);
      alert('Error calling ElevenLabs.');
    }
  };

  const handleTwilio = async () => {
    try {
      await fetch('/api/twilio', { method: 'POST' });
      alert('Twilio SMS sent!');
      logToFirebase('twilio_logs', { sms: 'sent' });
    } catch (err) {
      console.error(err);
      alert('Error calling Twilio.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
      <motion.h1 className="text-5xl font-extrabold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>NODE OUT</motion.h1>
      <motion.p className="text-xl mb-6 text-neutral-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        No Doubt. Built for the Field.
      </motion.p>

      <div className="flex gap-4 mb-4">
        <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold px-4 py-2 rounded shadow-lg">
          Welcome to Easy Street 🚀
        </button>
        <button onClick={() => setShowAdmin(prev => !prev)} className="px-4 py-2 border rounded text-sm">
          {showAdmin ? 'Hide Admin Tools' : 'Show Admin Tools'}
        </button>
      </div>

      {showForm && (
        <div className="bg-neutral-900 p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4 text-orange-400">🧠 Quick Client Setup</h2>
          <p className="text-sm text-neutral-300 mb-2">Coming soon: drag-and-drop priorities, inline preview PDF, and Firebase logging</p>
          <p className="text-sm text-neutral-500">(Prototype Placeholder for Interactive Form)</p>
        </div>
      )}

      {showAdmin && (
        <>
          <div className="flex flex-wrap gap-4 mb-4 justify-center">
            <button onClick={handleWebhook} className="border border-white px-4 py-2 rounded">Trigger n8n</button>
            <button onClick={handleSlack} className="border border-blue-400 px-4 py-2 rounded">Send to Slack</button>
            <button onClick={handleCalendly} className="border border-green-400 px-4 py-2 rounded">Calendly Hook</button>
            <button onClick={handleVoice} className="border border-yellow-400 px-4 py-2 rounded">Voice Agent</button>
            <button onClick={handleTwilio} className="border border-pink-400 px-4 py-2 rounded">Send SMS</button>
          </div>

          <div className="flex gap-2 mb-4">
            {['gpt_logs', 'n8n_logs', 'slack_logs', 'calendly_logs', 'voice_logs', 'twilio_logs'].map(type => (
              <button
                key={type}
                onClick={() => setLogType(type)}
                className={`px-3 py-1 rounded text-sm ${logType === type ? 'bg-white text-black' : 'border border-neutral-500'}`}
              >
                {type.replace('_logs', '').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-2 w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-2">📊 {logType.replace('_logs', '').toUpperCase()} Logs</h2>
            <div className="bg-neutral-800 p-4 rounded max-h-60 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="mb-2 border-b border-neutral-600 pb-2">
                  <p className="text-sm text-neutral-400">{log.timestamp}</p>
                  {Object.entries(log).map(([key, val]) => (
                    key !== 'timestamp' && key !== 'audioUrl' && <p key={key}><strong>{key}:</strong> {String(val)}</p>
                  ))}
                  {log.audioUrl && (
                    <div className="mt-2">
                      <audio controls preload="none" onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} className="w-full">
                        <source src={log.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                      <a href={log.audioUrl} download className="text-blue-400 text-sm underline mt-1 inline-block">Download Audio</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default One0;
