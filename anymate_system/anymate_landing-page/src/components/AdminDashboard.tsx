import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Badge } from './badge';

interface Lead {
  name: string;
  email: string;
  role: 'Creator' | 'Buyer' | 'Both';
  first_use: string;
  ts: string;
}

export function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [firebaseLeads, setFirebaseLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load localStorage leads
    try {
      const localLeads = JSON.parse(localStorage.getItem('anym8_waitlist') || '[]');
      setLeads(localLeads);
    } catch (e) {
      console.log('No local leads found');
    }

    // Try to fetch Firebase leads
    fetchFirebaseLeads();
  }, []);

  const fetchFirebaseLeads = async () => {
    try {
      const response = await fetch('/api/admin-leads');
      if (response.ok) {
        const data = await response.json();
        setFirebaseLeads(data.leads || []);
      }
    } catch (e) {
      console.log('Firebase leads not available');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (data: Lead[], filename: string) => {
    const csv = ['name,email,role,first_use,timestamp']
      .concat(data.map(lead => 
        [lead.name, lead.email, lead.role, lead.first_use, lead.ts]
          .map(v => `"${String(v || '').replace('"', '""')}"`)
          .join(',')
      ))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="p-8">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ANYM⁸ Admin Dashboard</h1>
        
        <div className="grid gap-6">
          {/* Firebase Leads */}
          <Card className="bg-black/60 border-white/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Firebase Leads ({firebaseLeads.length})
                <button 
                  onClick={() => downloadCSV(firebaseLeads, 'firebase-leads.csv')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm"
                >
                  Download CSV
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {firebaseLeads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">First Use</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firebaseLeads.map((lead, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="p-2">{lead.name}</td>
                          <td className="p-2">{lead.email}</td>
                          <td className="p-2">
                            <Badge variant="secondary">{lead.role}</Badge>
                          </td>
                          <td className="p-2 text-xs text-white/70">{lead.first_use}</td>
                          <td className="p-2 text-xs text-white/70">
                            {new Date(lead.ts).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-white/60">No Firebase leads found. Check API connection.</p>
              )}
            </CardContent>
          </Card>

          {/* Local Backup Leads */}
          <Card className="bg-black/60 border-white/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Local Backup Leads ({leads.length})
                <button 
                  onClick={() => downloadCSV(leads, 'local-backup-leads.csv')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Download CSV
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">First Use</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="p-2">{lead.name}</td>
                          <td className="p-2">{lead.email}</td>
                          <td className="p-2">
                            <Badge variant="secondary">{lead.role}</Badge>
                          </td>
                          <td className="p-2 text-xs text-white/70">{lead.first_use}</td>
                          <td className="p-2 text-xs text-white/70">
                            {new Date(lead.ts).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-white/60">No local backup leads found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}