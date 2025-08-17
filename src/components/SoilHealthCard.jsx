import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLeaf, 
  faDroplet, 
  faBalanceScale, 
  faThermometerHalf, 
  faBolt 
} from '@fortawesome/free-solid-svg-icons';
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

  const getIconForNutrient = (nutrient) => {
    switch(nutrient.toLowerCase()) {
      case 'n':
      case 'p':
      case 'k':
        return faLeaf;
      case 'moisture':
        return faDroplet;
      case 'ph':
        return faBalanceScale;
      case 'temperature':
        return faThermometerHalf;
      case 'ec':
        return faBolt;
      default:
        return faLeaf;
    }
  };

  const getIconColor = (nutrient) => {
    switch(nutrient.toLowerCase()) {
      case 'n':
        return 'text-green-600';
      case 'p':
        return 'text-orange-600';
      case 'k':
        return 'text-purple-600';
      case 'moisture':
        return 'text-blue-600';
      case 'ph':
        return 'text-indigo-600';
      case 'temperature':
        return 'text-red-600';
      case 'ec':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`card bg-white shadow-md border-l-4 ${statusColors[status]} hover:shadow-lg transition-shadow`}>
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon 
              icon={getIconForNutrient(nutrient)} 
              className={`text-xl ${getIconColor(nutrient)}`} 
            />
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
