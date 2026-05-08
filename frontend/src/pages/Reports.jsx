import Header from '../components/Header';
import MonthCard from '../components/MonthCard';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function Reports({ transactions }) {
  const year = new Date().getFullYear();

  return (
    <>
      <Header />
      <main className="reports">
        <div className="reports__heading">
          <h2>Reportes {year}</h2>
          <p>Resumen mensual de tus ingresos, egresos y deudas por tarjeta</p>
        </div>

        <div className="reports__grid">
          {MONTHS.map((name, idx) => (
            <MonthCard
              key={idx}
              monthName={name}
              monthIndex={idx}
              year={year}
              transactions={transactions}
            />
          ))}
        </div>
      </main>
    </>
  );
}
