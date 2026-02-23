import { useState } from 'react';
import { CountryPeriod } from '@/types';
import { Globe, Plus, Trash2, MapPin } from 'lucide-react';

interface CountryHistoryProps {
  periods: CountryPeriod[];
  onAdd: (period: Omit<CountryPeriod, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function CountryHistory({ periods, onAdd, onDelete }: CountryHistoryProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    startYear: new Date().getFullYear(),
    endYear: 'Present' as number | 'Present',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      country: '',
      state: '',
      startYear: new Date().getFullYear(),
      endYear: 'Present',
    });
    setShowForm(false);
  };

  const sortedPeriods = [...periods].sort((a, b) => a.startYear - b.startYear);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-8 h-8 text-[#26844f]" />
          <div>
            <h1 className="text-[#22283a]">Country & Region History</h1>
            <p className="text-gray-600">Track where you've lived throughout your life</p>
          </div>
        </div>

        {/* Add Period Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#26844f] hover:bg-[#1e6a3f] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mb-6"
          >
            <Plus className="w-5 h-5" />
            Add Country/Region Period
          </button>
        )}

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-gray-900 mb-4">Add Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="country" className="block text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  required
                  placeholder="e.g., Canada, India, USA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-gray-700 mb-2">
                  State/Province (Optional)
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="e.g., Ontario, California"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="startYear" className="block text-gray-700 mb-2">
                  Start Year *
                </label>
                <input
                  type="number"
                  id="startYear"
                  value={formData.startYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="endYear" className="block text-gray-700 mb-2">
                  End Year *
                </label>
                <input
                  type="number"
                  id="endYear"
                  value={formData.endYear === 'Present' ? '' : formData.endYear}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    endYear: e.target.value ? parseInt(e.target.value) : 'Present' 
                  }))}
                  placeholder="Leave empty for Present"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-[#26844f] hover:bg-[#1e6a3f] text-white py-2 rounded-lg transition-colors"
              >
                Add Period
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Timeline */}
        {periods.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No location history added yet</p>
            <p className="text-sm mt-2">Add countries and regions where you've lived</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-gray-900">Your Timeline</h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              {sortedPeriods.map((period, index) => (
                <div key={period.id} className="relative flex items-start gap-4 pb-8">
                  {/* Timeline dot */}
                  <div className="w-16 flex-shrink-0 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow z-10" />
                    {index === sortedPeriods.length - 1 && period.endYear === 'Present' && (
                      <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Now
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-gray-900">
                          {period.country}{period.state ? `, ${period.state}` : ''}
                        </h4>
                        <p className="text-gray-600">
                          {period.startYear} - {period.endYear === 'Present' ? 'Present' : period.endYear}
                          {period.endYear !== 'Present' && (
                            <span className="text-gray-500 ml-2">
                              ({(typeof period.endYear === 'number' ? period.endYear : 0) - period.startYear} years)
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => onDelete(period.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}