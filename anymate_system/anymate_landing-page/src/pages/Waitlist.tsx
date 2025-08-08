import React, { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  role: 'Creator' | 'Buyer' | 'Both';
  first_use: string;
  consent: boolean;
};

const initialState: FormState = {
  name: '',
  email: '',
  role: 'Both',
  first_use: '',
  consent: false,
};

const Waitlist: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setMessage('Please agree to receive early-access emails.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          first_use: form.first_use,
        }),
      });

      if (!res.ok) throw new Error('Bad status');

      setStatus('success');
      setMessage("You're on the list!");
      setForm(initialState);
    } catch (err) {
      // Fallback: local CSV link
      try {
        const k = 'anym8_waitlist';
        const prev = JSON.parse(localStorage.getItem(k) || '[]');
        const row = { ...form, ts: new Date().toISOString() };
        prev.push(row);
        localStorage.setItem(k, JSON.stringify(prev));

        const csv = ['name,email,role,first_use,ts']
          .concat(prev.map((o: any) => [o.name, o.email, o.role, o.first_use, o.ts]
            .map((v: any) => '"' + String(v ?? '').replace('"','""') + '"').join(',')))
          .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        setStatus('success');
        setMessage('Saved locally. Click to download CSV and import later: ');

        const a = document.createElement('a');
        a.href = url;
        a.download = 'anym8-waitlist.csv';
        a.textContent = 'Download CSV';
        a.style.marginLeft = '6px';
        setTimeout(() => {
          const box = document.getElementById('local-csv-link');
          if (box) box.appendChild(a);
        });
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Try again later.');
      }
    }
  }

  return (
    <div style={{minHeight:'100vh', display:'grid', placeItems:'center', background:'linear-gradient(135deg,#0f0f0f 0%,#1a1a1a 50%,#0f0f0f 100%)', color:'#f4f6fa', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:780, background:'#161a22', borderRadius:16, padding:'2rem', boxShadow:'0 10px 30px rgba(0,0,0,.35)', border:'1px solid #2b3342' }}>
        <h1 style={{marginTop:0, marginBottom:'0.5rem'}}>ANYM⁸ — Waitlist</h1>
        <p style={{color:'#b7c0cd', marginTop:0}}>Be first to access math‑powered 3D asset generation and the marketplace.</p>

        <form onSubmit={onSubmit} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:'1rem' }}>
          <label style={{gridColumn:'1 / -1'}}>
            Name<br/>
            <input name="name" required placeholder="Ada Lovelace" value={form.name} onChange={onChange}/>
          </label>
          <label>
            Email<br/>
            <input name="email" type="email" required placeholder="you@studio.com" value={form.email} onChange={onChange}/>
          </label>
          <label>
            Role<br/>
            <select name="role" value={form.role} onChange={onChange}>
              <option>Creator</option>
              <option>Buyer</option>
              <option>Both</option>
            </select>
          </label>
          <label style={{gridColumn:'1 / -1'}}>
            What would you use first?<br/>
            <input name="first_use" placeholder="ArchViz interiors, kitbash props, ..." value={form.first_use} onChange={onChange}/>
          </label>
          <label style={{gridColumn:'1 / -1', display:'flex', gap:8, alignItems:'center'}}>
            <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}/> I agree to receive early‑access emails.
          </label>
          <div style={{gridColumn:'1 / -1'}}>
            <button type="submit" disabled={status==='submitting'} style={{ background:'linear-gradient(90deg,#ff6a00,#1f7fef)', border:'none', borderRadius:10, padding:'0.85rem 1.25rem', color:'#fff', fontWeight:700, cursor:'pointer' }}>
              {status==='submitting' ? 'Submitting…' : 'Join the Waitlist'}
            </button>
          </div>
        </form>

        {message && (
          <div id="local-csv-link" style={{marginTop:'1rem', padding:'1rem', borderRadius:10, background:'#0d2a6b'}}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Waitlist;
