import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { VaccinationRecord } from '@/types';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { VACCINES, COUNTRIES, HEALTHCARE_PROVIDERS } from '@/lib/autocomplete-data';

interface VaccinationFormProps {
  onSubmit: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
}

export function VaccinationForm({ onSubmit }: VaccinationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: '',
    location: '',
    provider: '',
    notes: '',
    countryGiven: '',
    verified: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, doseNumber: 1 });
    setFormData({
      vaccineName: '',
      date: '',
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
      <h2 className="text-[#1d1d1f] font-semibold mb-6">Add Vaccination Record</h2>
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
            <label htmlFor="date" className="block text-[#1d1d1f] mb-2">
              Date Administered *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              max={today}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#4a7fb5]/20 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-[#1d1d1f] mb-2">Dose Number</label>
            <div className="w-full px-4 py-2 bg-[#f5f5f7] rounded-xl text-[#86868b] text-sm">
              Automatically assigned based on date
            </div>
          </div>

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
            <label htmlFor="notes" className="block text-[#1d1d1f] mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional information or reactions"
              className="w-full px-4 py-2 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#4a7fb5]/20 focus:border-transparent outline-none resize-none"
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
            className="flex-1 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}