import { VaccinationRecord } from '@/types';
import { VaccinationCard } from './VaccinationCard';
import { FileText } from 'lucide-react';

interface VaccinationListProps {
  vaccinations: VaccinationRecord[];
  onDelete: (id: string) => void;
}

export function VaccinationList({ vaccinations, onDelete }: VaccinationListProps) {
  if (vaccinations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-gray-500 mb-2">No vaccination records yet</h3>
        <p className="text-gray-400">
          Add your first vaccination record to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gray-700">Your Vaccination Records</h2>
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full">
          {vaccinations.length} {vaccinations.length === 1 ? 'record' : 'records'}
        </span>
      </div>
      <div className="space-y-4">
        {vaccinations.map(vaccination => (
          <VaccinationCard
            key={vaccination.id}
            vaccination={vaccination}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
