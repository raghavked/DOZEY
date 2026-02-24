import { VaccinationRecord } from '@/types';
import { Calendar, MapPin, User, Trash2, FileText } from 'lucide-react';

interface VaccinationCardProps {
  vaccination: VaccinationRecord;
  onDelete: (id: string) => void;
}

export function VaccinationCard({ vaccination, onDelete }: VaccinationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl hover:shadow-md transition-shadow p-6 border-l-4 border-[#4a7fb5]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[#1d1d1f] mb-1">{vaccination.vaccineName}</h3>
          <span className="inline-block bg-[#4a7fb5]/10 text-[#4a7fb5] px-3 py-1 rounded-full text-sm font-medium">
            Dose {vaccination.doseNumber}
          </span>
        </div>
        <button
          onClick={() => onDelete(vaccination.id)}
          className="text-[#86868b] hover:text-red-500 transition-colors p-2"
          aria-label="Delete vaccination record"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#86868b]">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(vaccination.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-[#86868b]">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{vaccination.location}</span>
        </div>

        <div className="flex items-center gap-2 text-[#86868b]">
          <User className="w-4 h-4 flex-shrink-0" />
          <span>{vaccination.provider}</span>
        </div>

        {vaccination.notes && (
          <div className="flex gap-2 text-[#86868b] pt-2 border-t border-[#f5f5f7]">
            <FileText className="w-4 h-4 flex-shrink-0 mt-1" />
            <div>
              <p className="text-[#86868b] mb-1">Notes:</p>
              <p className="text-[#1d1d1f]">{vaccination.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
