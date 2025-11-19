export const metadata = {
  title: 'Transparency Ledger - The Greenfield Development Fund',
  description: 'Full transparency ledger showing all funding received and how it is allocated to sustain ethical tool development.',
};

export default function LedgerPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
          Transparency Ledger
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-12">
          Full accounting of all funds received and how they sustain the mission.
        </p>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Full Ledger Coming Soon
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We are building the infrastructure to display real-time funding data,
            allocation breakdowns, and complete transaction history. 
            This page will show exactly where every dollar goes.
          </p>
          <p className="text-sm text-slate-500 mt-6">
            In the meantime, all funding goals and progress are shown on the{' '}
            <a href="/funding" className="text-emerald-600 hover:text-emerald-700 underline">
              Funding page
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
