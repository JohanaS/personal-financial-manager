import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { AppIcon } from '../utils/icons';

const COLUMNS = [
  { key: 'indispensable', label: 'Indispensable', icon: 'indispensable',
    color: 'var(--color-primary)', bg: '#ede9fe', text: 'var(--color-primary-hover)' },
  { key: 'ahorro',        label: 'Ahorro',        icon: 'ahorro',
    color: '#7c3aed', bg: '#f5f3ff', text: '#6d28d9' },
  { key: 'extra',         label: 'Extra / Gusto', icon: 'extra',
    color: '#8b5cf6', bg: '#f5f3ff', text: '#7c3aed' },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-MX', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ── Single transaction card (no tag chip) ─────────────────
function TxItem({ tx, onAskDelete }) {
  const iconColor = tx.type === 'income' ? '#0d9488' : '#ea580c';
  return (
    <div className="tx-item">
      <div className={`tx-item__icon tx-item__icon--${tx.type}`}>
        <AppIcon name={tx.category} size={16} color={iconColor} />
      </div>

      <div className="tx-item__info">
        <div className="tx-item__category">{tx.category}</div>
        <div className="tx-item__date">{formatDate(tx.date)}</div>
        {tx.note && (
          <div className="tx-item__note">{tx.note}</div>
        )}
        {tx.paymentMethod && (
          <div className="tx-item__payment">
            <AppIcon name={tx.paymentMethod} size={12} color="#8b5cf6" />
            <span>
              {tx.paymentMethod === 'efectivo'
                ? 'Efectivo'
                : tx.paymentMethod === 'debito'
                ? 'Débito'
                : tx.cardName || 'Crédito'}
            </span>
          </div>
        )}
      </div>

      <div className="tx-item__right">
        <div className={`tx-item__amount tx-item__amount--${tx.type}`}>
          {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
        </div>
        <span className={`tx-item__badge tx-item__badge--${tx.type}`}>
          {tx.type === 'income' ? 'ingreso' : 'gasto'}
        </span>
      </div>

      <button
        type="button"
        className="tx-item__delete"
        onClick={() => onAskDelete(tx)}
        title="Eliminar transacción"
        aria-label="Eliminar transacción"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 3h12M5 3V2h4v1M6 6v4M8 6v4M2 3l1 9h8l1-9"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Column card ───────────────────────────────────────────
function TxColumn({ col, txs, rule, onAskDelete }) {
  const total = txs.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="tx-col" style={{ '--col-color': col.color }}>
      <div className="tx-col__header">
        <div className="tx-col__title-row">
          <span className="tx-col__icon">
            <AppIcon name={col.icon} size={15} color={col.text} />
          </span>
          <span className="tx-col__title">{col.label}</span>
          {rule != null && (
            <span className="tx-col__pct" style={{ background: col.bg, color: col.text }}>
              {rule[col.key]}%
            </span>
          )}
        </div>
        <span className="tx-col__total" style={{ color: col.text }}>
          {txs.length > 0 ? formatCurrency(total) : '—'}
        </span>
      </div>

      <div className="tx-col__body">
        {txs.length === 0 ? (
          <div className="tx-col__empty">Sin transacciones</div>
        ) : (
          txs.map(tx => <TxItem key={tx.id} tx={tx} onAskDelete={onAskDelete} />)
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function TransactionList({ transactions, onDelete, rule }) {
  const [pending, setPending] = useState(null);

  function askDelete(tx)  { setPending(tx); }
  function confirmDelete() { if (pending) onDelete(pending.id); setPending(null); }
  function cancelDelete()  { setPending(null); }

  const sortDate = arr => [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Ingresos sin etiquetar (los de ahorro van a su propia columna)
  const income   = sortDate(transactions.filter(t => t.type === 'income' && !t.budgetTag));
  const byTag    = {
    indispensable: sortDate(transactions.filter(t => t.type === 'expense' && t.budgetTag === 'indispensable')),
    ahorro:        sortDate(transactions.filter(t => t.type === 'income'  && t.budgetTag === 'ahorro')),
    extra:         sortDate(transactions.filter(t => t.type === 'expense' && t.budgetTag === 'extra')),
  };
  const untagged = sortDate(transactions.filter(t => t.type === 'expense' && !t.budgetTag));

  const allEmpty = transactions.length === 0;

  return (
    <>
      {allEmpty ? (
        <div className="card">
          <div className="tx-empty">
            <div className="tx-empty__icon"><AppIcon name="list" size={32} color="var(--color-primary)" /></div>
            <div className="tx-empty__text">Sin transacciones aún</div>
            <div className="tx-empty__sub">Agrega tu primera transacción para comenzar</div>
          </div>
        </div>
      ) : (
        <>
          {/* Cuadrícula 2×2: ingresos + 3 categorías */}
          <div className="tx-grid-2x2">
            {/* Tile de ingresos */}
            <div className="tx-col" style={{ '--col-color': 'var(--color-primary)' }}>
              <div className="tx-col__header">
                <div className="tx-col__title-row">
                  <span className="tx-col__icon">
                    <AppIcon name="inbox" size={15} color="var(--color-primary-hover)" />
                  </span>
                  <span className="tx-col__title">Ingresos</span>
                  <span className="tx-col__pct" style={{ background: '#ede9fe', color: 'var(--color-primary-hover)' }}>
                    {income.length} {income.length === 1 ? 'registro' : 'registros'}
                  </span>
                </div>
                <span className="tx-col__total" style={{ color: 'var(--color-primary-hover)' }}>
                  {income.length > 0
                    ? formatCurrency(income.reduce((s, t) => s + t.amount, 0))
                    : '—'}
                </span>
              </div>
              <div className="tx-col__body">
                {income.length === 0
                  ? <div className="tx-col__empty">Sin ingresos este mes</div>
                  : income.map(tx => <TxItem key={tx.id} tx={tx} onAskDelete={askDelete} />)
                }
              </div>
            </div>

            {/* 3 tiles de gastos */}
            {COLUMNS.map(col => (
              <TxColumn
                key={col.key}
                col={col}
                txs={byTag[col.key]}
                rule={rule}
                onAskDelete={askDelete}
              />
            ))}
          </div>

          {/* Gastos sin etiqueta */}
          {untagged.length > 0 && (
            <div className="card">
              <div className="card__header">
                <span className="card__title">Gastos sin etiqueta</span>
                <span className="card__badge">{untagged.length}</span>
              </div>
              <div className="tx-list">
                {untagged.map(tx => (
                  <TxItem key={tx.id} tx={tx} onAskDelete={askDelete} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="¿Eliminar transacción?"
        message={
          pending && (
            <span>
              Se eliminará <strong>{pending.category}</strong> por{' '}
              <strong>{formatCurrency(pending.amount)}</strong>.
              Esta acción no se puede deshacer.
            </span>
          )
        }
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
