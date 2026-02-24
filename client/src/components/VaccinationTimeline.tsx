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
    .sort((a, b) => {
      const [ay, am, ad] = a.date.split('-').map(Number);
      const [by, bm, bd] = b.date.split('-').map(Number);
      return new Date(by, bm - 1, bd).getTime() - new Date(ay, am - 1, ad).getTime();
    });

  const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-[#1d1d1f]/30" />
          <div>
            <h1 className="text-[#1d1d1f] font-semibold">Vaccine Timeline</h1>
            <p className="text-[#86868b]">All your vaccinations in chronological order</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#f5f5f7] p-4 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-[#86868b]" />
            <h3 className="text-sm font-semibold text-[#1d1d1f]">Filters</h3>
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
          <div className="bg-[#f5f5f7] p-4 rounded-2xl text-center">
            <div className="text-[#4a7fb5] font-semibold">{vaccinations.length}</div>
            <p className="text-[#86868b] text-sm">Total Vaccines</p>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl text-center">
            <div className="text-[#4d9068] font-semibold">{vaccinations.filter(v => v.verified).length}</div>
            <p className="text-[#86868b] text-sm">Verified</p>
          </div>
          <div className="bg-[#f5f5f7] p-4 rounded-2xl text-center">
            <div className="text-[#8aab45] font-semibold">{vaccinations.filter(v => !v.verified).length}</div>
            <p className="text-[#86868b] text-sm">Pending</p>
          </div>
        </div>

        {/* Timeline */}
        {filteredVaccinations.length === 0 ? (
          <div className="text-center py-12 text-[#86868b]">
            <Clock className="w-16 h-16 mx-auto mb-4 text-[#1d1d1f]/10" />
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
                className="bg-white border border-black/5 rounded-2xl p-6 hover:bg-[#fbfbfd] transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#1d1d1f]">{vax.vaccineName}</h3>
                      {vax.verified ? (
                        <span className="flex items-center gap-1 bg-[#4d9068]/10 text-[#4d9068] px-3 py-1 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-[#8aab45]/10 text-[#8aab45] px-3 py-1 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      <span className="bg-[#4a7fb5]/10 text-[#4a7fb5] px-3 py-1 rounded-full text-sm">
                        Dose {vax.doseNumber}
                      </span>
                    </div>
                    <p className="text-[#86868b]">{formatDate(vax.date)}</p>
                  </div>
                  <button
                    onClick={() => onDelete(vax.id)}
                    className="text-[#86868b] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#86868b]">Country:</span>
                    <span className="ml-2 text-[#1d1d1f]">{vax.countryGiven}</span>
                  </div>
                  <div>
                    <span className="text-[#86868b]">Location:</span>
                    <span className="ml-2 text-[#1d1d1f]">{vax.location}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[#86868b]">Provider:</span>
                    <span className="ml-2 text-[#1d1d1f]">{vax.provider}</span>
                  </div>
                  {vax.notes && (
                    <div className="md:col-span-2 pt-2 border-t border-black/5">
                      <span className="text-[#86868b]">Notes:</span>
                      <p className="mt-1 text-[#1d1d1f]">{vax.notes}</p>
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
