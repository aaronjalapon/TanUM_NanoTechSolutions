import { getSoilStatus } from '../data/mockData';

export default function SoilHealthCard({ nutrient, value, unit, icon }) {
  const status = getSoilStatus(value, nutrient);
  
  const statusColors = {
    healthy: 'bg-green-100 border-green-500 text-green-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    deficient: 'bg-red-100 border-red-500 text-red-800'
  };

  const statusLabels = {
    healthy: 'Healthy',
    warning: 'Warning',
    deficient: 'Deficient'
  };

  const statusIndicators = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    deficient: 'bg-red-500'
  };

  return (
    <div className={`card bg-white shadow-md border-l-4 ${statusColors[status]} hover:shadow-lg transition-shadow`}>
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="font-header font-semibold text-text-primary uppercase text-sm">
              {nutrient === 'EC' ? 'EC' : nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
            </h3>
          </div>
          <div className={`w-3 h-3 rounded-full ${statusIndicators[status]}`}></div>
        </div>
        
        <div className="mt-2">
          <div className="font-mono text-2xl font-bold text-text-primary">
            {value}
            <span className="text-sm font-normal text-text-secondary ml-1">{unit}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {statusLabels[status]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
