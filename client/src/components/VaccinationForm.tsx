import { useState } from 'react';
import { Plus } from 'lucide-react';
import { VaccinationRecord } from '@/types';
import { CustomSelect } from '@/components/CustomSelect';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { VACCINES, COUNTRIES, HEALTHCARE_PROVIDERS } from '@/lib/autocomplete-data';

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
    countryGiven: '',
    verified: false,
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
      countryGiven: '',
      verified: false,
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
        className="w-full bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
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
          <AutocompleteInput
            id="vaccineName"
            label="Vaccine Name"
            value={formData.vaccineName}
            onChange={(val) => setFormData(prev => ({ ...prev, vaccineName: val }))}
            suggestions={VACCINES}
            required
            placeholder="e.g., COVID-19, Flu, MMR"
          />

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

          <CustomSelect
            id="doseNumber"
            label="Dose Number"
            value={String(formData.doseNumber)}
            onChange={(val) => setFormData(prev => ({ ...prev, doseNumber: parseInt(val) }))}
            options={[1, 2, 3, 4, 5].map(n => ({ value: String(n), label: `Dose ${n}` }))}
            required
          />

          <AutocompleteInput
            id="countryGiven"
            label="Country Given"
            value={formData.countryGiven}
            onChange={(val) => setFormData(prev => ({ ...prev, countryGiven: val }))}
            suggestions={COUNTRIES}
            required
            placeholder="e.g., India, USA, Germany"
          />

          <AutocompleteInput
            id="location"
            label="Location / Country"
            value={formData.location}
            onChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
            suggestions={COUNTRIES}
            required
            placeholder="e.g., City Hospital, Local Pharmacy"
          />

          <div className="md:col-span-2">
            <AutocompleteInput
              id="provider"
              label="Healthcare Provider"
              value={formData.provider}
              onChange={(val) => setFormData(prev => ({ ...prev, provider: val }))}
              suggestions={HEALTHCARE_PROVIDERS}
              required
              placeholder="e.g., Dr. Smith, Walgreens Pharmacy"
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
            className="flex-1 bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white py-3 rounded-lg transition-colors"
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