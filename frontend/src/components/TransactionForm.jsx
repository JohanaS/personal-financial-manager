import { useState } from 'react';
import CustomSelect from './CustomSelect';
import ConfirmDialog from './ConfirmDialog';
import { AppIcon } from '../utils/icons';
import { createTransaction } from '../utils/api';

const CATEGORIES = {
  income: [
    { value: 'Salario',         icon: <AppIcon name="Salario"         size={16} color="var(--color-primary)" /> },
    { value: 'Freelance',       icon: <AppIcon name="Freelance"       size={16} color="var(--color-primary)" /> },
    { value: 'Inversión',       icon: <AppIcon name="Inversión"       size={16} color="var(--color-primary)" /> },
    { value: 'Bono',            icon: <AppIcon name="Bono"            size={16} color="var(--color-primary)" /> },
    { value: 'Regalo',          icon: <AppIcon name="Regalo"          size={16} color="var(--color-primary)" /> },
    { value: 'Otro',            icon: <AppIcon name="Otro"            size={16} color="var(--color-primary)" /> },
  ],
  expense: [
    { value: 'Comida',          icon: <AppIcon name="Comida"          size={16} color="var(--color-primary)" /> },
    { value: 'Transporte',      icon: <AppIcon name="Transporte"      size={16} color="var(--color-primary)" /> },
    { value: 'Compras',         icon: <AppIcon name="Compras"         size={16} color="var(--color-primary)" /> },
    { value: 'Entretenimiento', icon: <AppIcon name="Entretenimiento" size={16} color="var(--color-primary)" /> },
    { value: 'Salud',           icon: <AppIcon name="Salud"           size={16} color="var(--color-primary)" /> },
    { value: 'Servicios',       icon: <AppIcon name="Servicios"       size={16} color="var(--color-primary)" /> },
    { value: 'Renta',           icon: <AppIcon name="Renta"           size={16} color="var(--color-primary)" /> },
    { value: 'Otro',            icon: <AppIcon name="Otro"            size={16} color="var(--color-primary)" /> },
  ],
};

const BUDGET_TAGS = [
  { value: 'indispensable', label: 'Indispensable' },
  { value: 'ahorro',        label: 'Ahorro'         },
  { value: 'extra',         label: 'Extra / Gusto'  },
];

const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'debito',   label: 'Débito'   },
  { value: 'credito',  label: 'Crédito'  },
];

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  amount: '',
  category: '',
  type: 'income',
  date: today,
  paymentMethod: 'efectivo',
  selectedCard: '',
  newCardName: '',
  budgetTag: 'indispensable',
  note: '',
};

export default function TransactionForm({ onAdd, savedCards, onSaveCard, onDeleteCard }) {
  const [form, setForm] = useState(emptyForm);
  const [showNewCard, setShowNewCard] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const categoryOptions = CATEGORIES[form.type].map(c => ({ value: c.value, label: c.value, icon: c.icon }));
  const isCredit = form.paymentMethod === 'credito';

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'type') {
        next.category = '';
        next.budgetTag = value === 'income' ? '__none__' : 'indispensable';
      }
      if (name === 'paymentMethod' && value !== 'credito') {
        next.selectedCard = '';
        next.newCardName = '';
      }
      return next;
    });
    if (name === 'paymentMethod' && value !== 'credito') setShowNewCard(false);
    if (name === 'selectedCard') setShowNewCard(value === '__new__');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0 || !form.category || !form.date) return;

    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (isCredit && !form.selectedCard) return;
    if (isCredit && form.selectedCard === '__new__' && !form.newCardName.trim()) return;

    let cardName = null;
    if (isCredit) {
      if (form.selectedCard === '__new__') {
        cardName = form.newCardName.trim();
        onSaveCard(cardName);
      } else {
        cardName = form.selectedCard;
      }
    }

    try{
      const result = await createTransaction({
        user: currentUser.id,
        amount,
        category: form.category,
        type: form.type,
        date: form.date,
        paymentMethod: form.paymentMethod,
        cardName,
        budgetTag: (form.type === 'expense' || (form.type === 'income' && form.budgetTag === 'ahorro'))
          ? form.budgetTag
          : null,
        note: form.note.trim() || null,
      });

      if (onAdd) onAdd(result);
      setForm(prev => ({ ...emptyForm, type: prev.type, paymentMethod: prev.paymentMethod }));
      setShowNewCard(false);
    } catch (error) {
    console.error('Error creating transaction:', error);
    alert('Hubo un error al guardar la transacción. Por favor, intenta de nuevo.');
  }
  }

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Agregar transacción</span>
        <span className="card__badge">Nueva entrada</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Monto */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Monto</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className="form-input"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Tipo */}
        <div className="form-group">
          <label className="form-label">Tipo de transacción</label>
          <div className="type-toggle">
            <label
              htmlFor="type-income"
              className={`type-toggle__label${form.type === 'income' ? ' type-toggle__label--income-active' : ''}`}
            >
              <input id="type-income" type="radio" name="type" value="income" checked={form.type === 'income'} onChange={handleChange} />
              ↑ Ingreso
            </label>
            <label
              htmlFor="type-expense"
              className={`type-toggle__label${form.type === 'expense' ? ' type-toggle__label--expense-active' : ''}`}
            >
              <input id="type-expense" type="radio" name="type" value="expense" checked={form.type === 'expense'} onChange={handleChange} />
              ↓ Gasto
            </label>
          </div>
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label className="form-label">Categoría</label>
          <CustomSelect
            value={form.category}
            onChange={val => setForm(prev => ({ ...prev, category: val }))}
            options={categoryOptions}
            placeholder="Selecciona una categoría"
          />
        </div>

        {/* Etiqueta presupuesto: ingresos → checkbox ahorro; gastos → todas las opciones */}
        {form.type === 'income' ? (
          <div className="form-group">
            <label className="saving-check">
              <input
                type="checkbox"
                checked={form.budgetTag === 'ahorro'}
                onChange={e =>
                  setForm(prev => ({ ...prev, budgetTag: e.target.checked ? 'ahorro' : '__none__' }))
                }
              />
              <span className="saving-check__box" aria-hidden="true">
                {form.budgetTag === 'ahorro' ? '✓' : ''}
              </span>
              <span className="saving-check__label">
                <AppIcon name="ahorro" size={14} color="currentColor" style={{ flexShrink: 0 }} />
                Estoy ahorrando este ingreso
              </span>
            </label>
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Etiqueta de presupuesto</label>
            <div className="budget-tag-toggle">
              {BUDGET_TAGS.map(({ value, label }) => (
                <label
                  key={value}
                  htmlFor={`bt-${value}`}
                  className={`budget-tag-toggle__label budget-tag-toggle__label--${value}${form.budgetTag === value ? ' budget-tag-toggle__label--active' : ''}`}
                >
                  <input
                    id={`bt-${value}`}
                    type="radio"
                    name="budgetTag"
                    value={value}
                    checked={form.budgetTag === value}
                    onChange={handleChange}
                  />
                  <AppIcon name={value} size={14} color="currentColor" />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Método de pago */}
        <div className="form-group">
          <label className="form-label">Método de pago</label>
          <div className="pay-toggle">
            {PAYMENT_METHODS.map(({ value, label }) => (
              <label
                key={value}
                htmlFor={`pay-${value}`}
                className={`pay-toggle__label${form.paymentMethod === value ? ' pay-toggle__label--active' : ''}`}
              >
                <input
                  id={`pay-${value}`}
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={form.paymentMethod === value}
                  onChange={handleChange}
                />
                <AppIcon name={value} size={14} color="currentColor" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Tarjeta de crédito */}
        {isCredit && (
          <div className="form-group card-reveal">
            <div className="form-label-row">
              <label className="form-label">Tarjeta de crédito</label>
            </div>

            <CustomSelect
              value={form.selectedCard}
              onChange={val => {
                setForm(prev => ({ ...prev, selectedCard: val, newCardName: '' }));
                setShowNewCard(val === '__new__');
              }}
              options={[
                ...savedCards.map(card => ({ value: card, label: card, icon: '💳' })),
                { value: '__new__', label: 'Agregar nueva tarjeta', icon: '➕', accent: true },
              ]}
              placeholder="Selecciona una tarjeta"
            />

            {/* Tarjetas guardadas con opción de eliminar */}
            {savedCards.length > 0 && (
              <div className="card-chips">
                {savedCards.map(card => (
                  <div key={card} className="card-chip">
                    <span>💳 {card}</span>
                    <button
                      type="button"
                      className="card-chip__delete"
                      onClick={() => setCardToDelete(card)}
                      title={`Eliminar tarjeta "${card}"`}
                      aria-label={`Eliminar tarjeta ${card}`}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            {showNewCard && (
              <input
                name="newCardName"
                type="text"
                placeholder="Ej: Visa viajes, Oro personal, Mi Amex…"
                className="form-input card-reveal"
                style={{ marginTop: '0.625rem' }}
                value={form.newCardName}
                onChange={handleChange}
                maxLength={40}
                autoFocus
              />
            )}
          </div>
        )}

        {/* Fecha */}
        <div className="form-group">
          <label className="form-label" htmlFor="date">Fecha</label>
          <input
            id="date"
            name="date"
            type="date"
            className="form-input"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nota */}
        <div className="form-group">
          <label className="form-label" htmlFor="note">Nota <span className="form-label--optional">(opcional)</span></label>
          <input
            id="note"
            name="note"
            type="text"
            placeholder="Ej: almuerzo con el equipo, pago mensual..."
            className="form-input"
            value={form.note}
            onChange={handleChange}
            maxLength={120}
          />
        </div>

        <button type="submit" className="btn-primary">
          Agregar transacción
        </button>
      </form>

      <ConfirmDialog
        open={cardToDelete !== null}
        title="¿Eliminar tarjeta?"
        message={<span>Se eliminará la tarjeta <strong>{cardToDelete}</strong>. Podrás agregarla de nuevo cuando lo necesites.</span>}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          onDeleteCard(cardToDelete);
          if (form.selectedCard === cardToDelete) {
            setForm(prev => ({ ...prev, selectedCard: '', newCardName: '' }));
            setShowNewCard(false);
          }
          setCardToDelete(null);
        }}
        onCancel={() => setCardToDelete(null)}
      />
    </div>
  );
}
