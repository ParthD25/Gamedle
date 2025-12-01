import { useState } from 'react';
import './Lookup.css'

export function Lookup(){
    const [lookupUsername, setLookupUsername] = useState('');
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupMessage, setLookupMessage] = useState<string | null>(null);

    // Sources:
    // - AI assistance: Portions drafted with OpenAI ChatGPT (GPT-5 Thinking), verified and adapted by the author for correctness.
    // Accessed 26 Nov. 2025.
    const handleLookup = async () => {
        const username = lookupUsername.trim();
        if (!username) {
        setLookupMessage('Enter a username.');
        return;
        }
        setLookupLoading(true);
        setLookupMessage('Looking up...');
        try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'User not found');
        }
        const data: { username: string; score: number } = await res.json();
        setLookupMessage(`${data.username}'s MAX score: ${data.score}`);
        } catch (e: any) {
        setLookupMessage(e.message || 'Lookup failed');
        } finally {
        setLookupLoading(false);
        }
    };
    console.log(lookupUsername)

    return(

        <div className='lookup-wrapper'>
                <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Lookup user score</summary>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: '0.9rem' }}>
                    <input
                        value={lookupUsername}
                        onChange={(e) => setLookupUsername(e.target.value)}
                        placeholder="Username"
                        style={{ width: 180, padding: '4px 6px', fontSize: '0.9rem' }}
                    />
                    <button
                        onClick={handleLookup}
                        disabled={lookupLoading}
                        style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                    >
                        {lookupLoading ? '...' : 'Lookup'}
                    </button>
                </div>
                {lookupMessage && (
                    <div style={{ marginTop: 6, fontSize: '0.85rem', opacity: 0.9 }}>
                        {lookupMessage}
                    </div>
                )}
                </details>
            </div>
    )

}