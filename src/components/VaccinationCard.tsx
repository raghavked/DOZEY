import { VaccinationRecord } from '../App';
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-indigo-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-900 mb-1">{vaccination.vaccineName}</h3>
          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
            Dose {vaccination.doseNumber}
          </span>
        </div>
        <button
          onClick={() => onDelete(vaccination.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          aria-label="Delete vaccination record"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(vaccination.date)}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{vaccination.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4 flex-shrink-0" />
          <span>{vaccination.provider}</span>
        </div>

        {vaccination.notes && (
          <div className="flex gap-2 text-gray-600 pt-2 border-t border-gray-100">
            <FileText className="w-4 h-4 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-500 mb-1">Notes:</p>
              <p>{vaccination.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
