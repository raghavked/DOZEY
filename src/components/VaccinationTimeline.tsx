import { useState } from 'react';
import { VaccinationRecord } from '../App';
import { Clock, CheckCircle, AlertCircle, Trash2, Filter } from 'lucide-react';

interface VaccinationTimelineProps {
  vaccinations: VaccinationRecord[];
  onAdd: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function VaccinationTimeline({ vaccinations, onAdd, onDelete }: VaccinationTimelineProps) {
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');

  const countries = Array.from(new Set(vaccinations.map(v => v.countryGiven)));
  
  const filteredVaccinations = vaccinations
    .filter(v => filterCountry === 'all' || v.countryGiven === filterCountry)
    .filter(v => filterVerified === 'all' || (filterVerified === 'verified' ? v.verified : !v.verified))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-[#1051a5]" />
          <div>
            <h1 className="text-[#22283a]">Vaccine Timeline</h1>
            <p className="text-[#6b7280]">All your vaccinations in chronological order</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-[#6b7280]" />
            <h3 className="text-[#22283a]">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filterCountry" className="block text-[#22283a] mb-2">
                Country
              </label>
              <select
                id="filterCountry"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1051a5] focus:border-transparent outline-none"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filterVerified" className="block text-[#22283a] mb-2">
                Status
              </label>
              <select
                id="filterVerified"
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1051a5] focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#e8f0fa] p-4 rounded-lg text-center border-l-4 border-[#1051a5]">
            <div className="text-[#1051a5]">{vaccinations.length}</div>
            <p className="text-[#22283a] text-sm">Total Vaccines</p>
          </div>
          <div className="bg-[#e6f3ec] p-4 rounded-lg text-center border-l-4 border-[#26844f]">
            <div className="text-[#26844f]">{vaccinations.filter(v => v.verified).length}</div>
            <p className="text-[#22283a] text-sm">Verified</p>
          </div>
          <div className="bg-[#f5f9e8] p-4 rounded-lg text-center border-l-4 border-[#97bf2d]">
            <div className="text-[#97bf2d]">{vaccinations.filter(v => !v.verified).length}</div>
            <p className="text-[#22283a] text-sm">Pending</p>
          </div>
        </div>

        {/* Timeline */}
        {filteredVaccinations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No vaccination records found</p>
            <p className="text-sm mt-2">
              {filterCountry !== 'all' || filterVerified !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first vaccination record to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVaccinations.map((vax) => (
              <div
                key={vax.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{vax.vaccineName}</h3>
                      {vax.verified ? (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        Dose {vax.doseNumber}
                      </span>
                    </div>
                    <p className="text-gray-600">{formatDate(vax.date)}</p>
                  </div>
                  <button
                    onClick={() => onDelete(vax.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Country:</span>
                    <span className="ml-2 text-gray-900">{vax.countryGiven}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-2 text-gray-900">{vax.location}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Provider:</span>
                    <span className="ml-2 text-gray-900">{vax.provider}</span>
                  </div>
                  {vax.notes && (
                    <div className="md:col-span-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Notes:</span>
                      <p className="mt-1 text-gray-900">{vax.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}