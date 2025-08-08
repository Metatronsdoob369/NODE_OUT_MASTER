import React, { useState } from 'react';
import { Input, Textarea, InputLabel } from './input';
import { Loading } from './loading';
import { Badge } from './badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';

type FormState = { 
  name: string; 
  email: string; 
  role: 'Creator'|'Buyer'|'Both'; 
  first_use: string; 
  consent: boolean; 
};

const initialState: FormState = { 
  name: '', 
  email: '', 
  role: 'Both', 
  first_use: '', 
  consent: false 
};

export default function Waitlist(){
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');

  function onChange(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>){
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!form.consent){ 
      setMessage('Please agree to receive early-access emails.'); 
      setStatus('error'); 
      return; 
    }
    
    setStatus('submitting'); 
    setMessage('');
    
    try{
      const res = await fetch('/api/subscribe', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({ 
          name: form.name, 
          email: form.email, 
          role: form.role, 
          first_use: form.first_use 
        })
      });
      
      if(!res.ok) throw new Error('Bad status');
      setStatus('success'); 
      setMessage("You're on the list!");
      setForm(initialState);
    } catch(err) {
      try{
        const k='anym8_waitlist'; 
        const prev = JSON.parse(localStorage.getItem(k) || '[]');
        const row = { ...form, ts: new Date().toISOString() }; 
        prev.push(row); 
        localStorage.setItem(k, JSON.stringify(prev));
        
        const csv = ['name,email,role,first_use,ts']
          .concat(prev.map((o:any)=>[o.name,o.email,o.role,o.first_use,o.ts]
          .map((v:any)=>'"'+String(v??'').replace('"','""')+'"').join(',')))
          .join('\n');
        
        const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
        setStatus('success'); 
        setMessage('Saved locally. Download CSV and import later: ');
        
        const a = document.createElement('a'); 
        a.href = url; 
        a.download = 'anym8-waitlist.csv'; 
        a.textContent = 'Download CSV'; 
        a.style.marginLeft = '6px';
        
        setTimeout(()=>{ 
          const el = document.getElementById('local-csv-link'); 
          if (el) el.appendChild(a); 
        }, 0);
      } catch{ 
        setStatus('error'); 
        setMessage('Something went wrong. Try again later.'); 
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1115] to-[#0b0d12] text-slate-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Card variant="glass" className="border border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="bioluminescent">ANYM⁸</Badge>
              <CardTitle>Waitlist</CardTitle>
            </div>
            <CardDescription>
              Be first to access math-powered 3D asset generation and the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputLabel>Name</InputLabel>
                <Input 
                  name="name" 
                  required 
                  placeholder="Ada Lovelace" 
                  value={form.name} 
                  onChange={onChange}
                  variant="glass"
                />
              </div>
              <div>
                <InputLabel>Email</InputLabel>
                <Input 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="you@studio.com" 
                  value={form.email} 
                  onChange={onChange}
                  variant="glass"
                />
              </div>
              <div>
                <InputLabel>Role</InputLabel>
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={onChange} 
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white"
                >
                  <option>Creator</option>
                  <option>Buyer</option>
                  <option>Both</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <InputLabel>What would you use first?</InputLabel>
                <Textarea 
                  name="first_use" 
                  placeholder="ArchViz interiors, kitbash props, ..." 
                  value={form.first_use} 
                  onChange={onChange}
                  variant="glass"
                />
              </div>
              <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <input 
                  type="checkbox" 
                  name="consent" 
                  checked={form.consent} 
                  onChange={onChange} 
                  className="accent-emerald-500" 
                />
                I agree to receive early-access emails.
              </label>
              <div className="md:col-span-2">
                <button 
                  type="submit" 
                  disabled={status==='submitting'} 
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 font-semibold text-white bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-600 hover:to-sky-600 disabled:opacity-50"
                >
                  {status==='submitting' ? <Loading size="sm" variant="dots" /> : null}
                  {status==='submitting' ? 'Submitting…' : 'Join the Waitlist'}
                </button>
              </div>
            </form>
            {message && (
              <div id="local-csv-link" className="mt-4 rounded-md bg-blue-900/40 p-3">
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}