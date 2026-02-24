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
      <div className="bg-white rounded-2xl p-12 text-center">
        <FileText className="w-16 h-16 text-[#1d1d1f]/10 mx-auto mb-4" />
        <h3 className="text-[#1d1d1f] mb-2">No vaccination records yet</h3>
        <p className="text-[#86868b]">
          Add your first vaccination record to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#1d1d1f]">Your Vaccination Records</h2>
        <span className="bg-[#4a7fb5]/10 text-[#4a7fb5] px-4 py-1 rounded-full text-sm font-medium">
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
