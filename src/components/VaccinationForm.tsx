import { useState } from 'react';
import { Plus } from 'lucide-react';
import { VaccinationRecord } from '../App';

interface VaccinationFormProps {
  onSubmit: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
}

export function VaccinationForm({ onSubmit }: VaccinationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: '',
    doseNumber: 1,
    location: '',
    provider: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      vaccineName: '',
      date: '',
      doseNumber: 1,
      location: '',
      provider: '',
      notes: '',
    });
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'doseNumber' ? parseInt(value) : value,
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#1051a5] hover:bg-[#0d4185] text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Add New Vaccination Record
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-indigo-900 mb-6">Add Vaccination Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vaccineName" className="block text-gray-700 mb-2">
              Vaccine Name *
            </label>
            <input
              type="text"
              id="vaccineName"
              name="vaccineName"
              value={formData.vaccineName}
              onChange={handleChange}
              required
              placeholder="e.g., COVID-19, Flu, MMR"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-gray-700 mb-2">
              Date Administered *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="doseNumber" className="block text-gray-700 mb-2">
              Dose Number *
            </label>
            <select
              id="doseNumber"
              name="doseNumber"
              value={formData.doseNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>Dose {num}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., City Hospital, Local Pharmacy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="provider" className="block text-gray-700 mb-2">
              Healthcare Provider *
            </label>
            <input
              type="text"
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              required
              placeholder="e.g., Dr. Smith, Walgreens Pharmacy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional information or reactions"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-[#1051a5] hover:bg-[#0d4185] text-white py-3 rounded-lg transition-colors"
          >
            Save Record
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}