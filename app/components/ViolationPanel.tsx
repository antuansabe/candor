import { Violation } from '@/lib/violations';

interface ViolationPanelProps {
  violations: Violation[];
}

export default function ViolationPanel({ violations }: ViolationPanelProps) {
  const fillerViolations = violations.filter((v) => v.type === 'filler');
  const wordCountViolation = violations.find((v) => v.type === 'wordcount');

  return (
    <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text)' }}>
        Violaciones detectadas
      </h3>
      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
        {fillerViolations.length === 0 ? (
          <p>Sin filler phrases detectadas.</p>
        ) : (
          <>
            <p style={{ marginBottom: '8px' }}>
              <strong>{fillerViolations.length}</strong> tipo(s) de filler encontrado(s):
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
              {fillerViolations.map((v) => (
                <li key={v.phrase} style={{ marginBottom: '4px' }}>
                  "{v.phrase}" × {v.count}
                </li>
              ))}
            </ul>
          </>
        )}
        {wordCountViolation && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
            Total: {wordCountViolation.count} palabras
          </p>
        )}
      </div>
    </div>
  );
}
