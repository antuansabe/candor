'use client';

import { useState } from 'react';
import ViolationPanel from './components/ViolationPanel';
import { Violation } from '@/lib/violations';

interface ComparisonResult {
  baseline: string;
  candor: string;
  baselineViolations: Violation[];
  candorViolations: Violation[];
}

const SAMPLE_PROMPTS = [
  'Should we use MongoDB for our payment ledger?',
  'Is this regex correct for matching emails: ^[a-z]+@[a-z]+$?',
  'Voy a renunciar a mi trabajo para hacer mi startup, dame feedback',
];

export default function Page() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!prompt.trim()) {
      setError('Por favor ingresa un prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error en la solicitud');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fillPrompt = (text: string) => {
    setPrompt(text);
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ marginBottom: '8px' }}>CANDOR.md validator</h1>
        <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
          Side-by-side test · ¿el archivo realmente cambia las respuestas?
        </p>
      </header>

      {/* Input Area */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu pregunta..."
            rows={5}
            style={{
              flex: 1,
              minHeight: '120px',
              maxHeight: '240px',
            }}
          />
          <button
            onClick={handleCompare}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#cccccc' : 'var(--color-accent)',
              color: 'white',
              height: 'fit-content',
              alignSelf: 'flex-start',
            }}
          >
            {loading ? 'Cargando...' : 'Comparar'}
          </button>
        </div>

        {/* Sample Prompts */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample}
              onClick={() => fillPrompt(sample)}
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-accent)',
                border: '0.5px solid var(--color-accent)',
                fontSize: '13px',
              }}
            >
              {sample.length > 40 ? sample.substring(0, 40) + '...' : sample}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ color: 'var(--color-error)', fontSize: '14px', marginTop: '12px' }}>
            {error}
          </div>
        )}
      </section>

      {/* Results */}
      {result && (
        <section>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Baseline Column */}
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Sin CANDOR.md
              </h2>
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginBottom: '16px',
                  }}
                >
                  {result.baseline}
                </div>
                <ViolationPanel violations={result.baselineViolations} />
              </div>
            </div>

            {/* CANDOR Column */}
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '16px', color: 'var(--color-accent)', marginBottom: '16px' }}>
                Con CANDOR.md
              </h2>
              <div
                style={{
                  backgroundColor: 'var(--color-accent-light)',
                  border: '0.5px solid var(--color-accent)',
                  borderRadius: '6px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginBottom: '16px',
                  }}
                >
                  {result.candor}
                </div>
                <ViolationPanel violations={result.candorViolations} />
              </div>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <section style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: '300px',
                  backgroundColor: 'var(--color-surface)',
                  border: '0.5px solid var(--color-border)',
                  borderRadius: '6px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </section>
      )}
    </div>
  );
}
