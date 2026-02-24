import { useState } from 'react';
import { VaccinationRecord } from '@/types';
import { Clock, CheckCircle, AlertCircle, Trash2, Filter } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';

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
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-[#22283a]/30" />
          <div>
            <h1 className="text-[#22283a] font-semibold">Vaccine Timeline</h1>
            <p className="text-gray-400">All your vaccinations in chronological order</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-[#22283a]">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              id="filterCountry"
              label="Country"
              value={filterCountry}
              onChange={setFilterCountry}
              options={[
                { value: 'all', label: 'All Countries' },
                ...countries.map(c => ({ value: c, label: c })),
              ]}
            />

            <CustomSelect
              id="filterVerified"
              label="Status"
              value={filterVerified}
              onChange={setFilterVerified}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'verified', label: 'Verified Only' },
                { value: 'unverified', label: 'Unverified Only' },
              ]}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 text-center">
            <div className="text-[#1051a5] font-semibold">{vaccinations.length}</div>
            <p className="text-gray-400 text-sm">Total Vaccines</p>
          </div>
          <div className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 text-center">
            <div className="text-[#26844f] font-semibold">{vaccinations.filter(v => v.verified).length}</div>
            <p className="text-gray-400 text-sm">Verified</p>
          </div>
          <div className="bg-[#fafafa] p-4 rounded-2xl border border-gray-100 text-center">
            <div className="text-[#97bf2d] font-semibold">{vaccinations.filter(v => !v.verified).length}</div>
            <p className="text-gray-400 text-sm">Pending</p>
          </div>
        </div>

        {/* Timeline */}
        {filteredVaccinations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p>No vaccination records found</p>
            <p className="text-sm mt-2">
              {filterCountry !== 'all' || filterVerified !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first vaccination record to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredVaccinations.map((vax) => (
              <div
                key={vax.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#22283a]">{vax.vaccineName}</h3>
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
                    <p className="text-gray-400">{formatDate(vax.date)}</p>
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
                    <span className="text-gray-400">Country:</span>
                    <span className="ml-2 text-[#22283a]">{vax.countryGiven}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <span className="ml-2 text-[#22283a]">{vax.location}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Provider:</span>
                    <span className="ml-2 text-[#22283a]">{vax.provider}</span>
                  </div>
                  {vax.notes && (
                    <div className="md:col-span-2 pt-2 border-t border-gray-100">
                      <span className="text-gray-400">Notes:</span>
                      <p className="mt-1 text-[#22283a]">{vax.notes}</p>
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
