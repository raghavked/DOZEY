import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { VaccinationRecord, UserProfile, CountryPeriod, UploadedDocument } from '@/types';
import { getSupabase } from '@/lib/supabase';

async function getToken(): Promise<string> {
  const sb = await getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return session.access_token;
}

async function fetchJson<T>(url: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

async function postJson<T>(url: string, data: any): Promise<T> {
  const token = await getToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

async function putJson<T>(url: string, data: any): Promise<T> {
  const token = await getToken();
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

async function patchJson<T>(url: string, data: any): Promise<T> {
  const token = await getToken();
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

async function deleteJson(url: string): Promise<void> {
  const token = await getToken();
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
}

async function uploadFile(url: string, formData: FormData): Promise<any> {
  const token = await getToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
  return res.json();
}

export function useProfile() {
  const queryClient = useQueryClient();
  const query = useQuery<UserProfile | null>({
    queryKey: ['profile'],
    queryFn: () => fetchJson<any>('/api/profile').then(p => {
      if (!p) return null;
      return {
        fullName: p.fullName || '',
        dateOfBirth: p.dateOfBirth || '',
        currentCountry: p.currentCountry || '',
        currentState: p.currentState || '',
        countryOfOrigin: p.countryOfOrigin || '',
        citizenships: p.citizenships ? JSON.parse(p.citizenships) : [],
        languages: p.languages ? JSON.parse(p.languages) : [],
        primaryProvider: p.primaryProvider || '',
        targetCountry: p.targetCountry || '',
      } as UserProfile;
    }),
  });

  const save = useMutation({
    mutationFn: (data: UserProfile) => putJson('/api/profile', {
      ...data,
      citizenships: JSON.stringify(data.citizenships),
      languages: JSON.stringify(data.languages),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  return { profile: query.data, isLoading: query.isLoading, saveProfile: save.mutate };
}

export function useVaccinations() {
  const queryClient = useQueryClient();
  const query = useQuery<VaccinationRecord[]>({
    queryKey: ['vaccinations'],
    queryFn: () => fetchJson<any[]>('/api/vaccinations').then(records =>
      records.map(r => ({
        id: String(r.id),
        vaccineName: r.vaccineName,
        date: r.date,
        doseNumber: r.doseNumber,
        location: r.location || '',
        countryGiven: r.countryGiven || '',
        provider: r.provider || '',
        notes: r.notes,
        verified: r.verified || false,
        documentId: r.documentId,
      }))
    ),
  });

  const add = useMutation({
    mutationFn: (data: Omit<VaccinationRecord, 'id'>) => postJson('/api/vaccinations', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vaccinations'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteJson(`/api/vaccinations/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vaccinations'] }),
  });

  return {
    vaccinations: query.data || [],
    isLoading: query.isLoading,
    addVaccination: add.mutate,
    deleteVaccination: remove.mutate,
  };
}

export function useDocuments() {
  const queryClient = useQueryClient();
  const query = useQuery<UploadedDocument[]>({
    queryKey: ['documents'],
    queryFn: () => fetchJson<any[]>('/api/documents').then(docs =>
      docs.map(d => ({
        id: String(d.id),
        name: d.name,
        type: d.type,
        uploadDate: d.uploadDate,
        country: d.country || '',
        fileName: d.fileName || null,
        fileSize: d.fileSize || null,
        mimeType: d.mimeType || null,
      }))
    ),
  });

  const add = useMutation({
    mutationFn: (formData: FormData) => uploadFile('/api/documents', formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; type?: string; country?: string } }) =>
      patchJson(`/api/documents/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteJson(`/api/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    addDocument: add.mutate,
    updateDocument: update.mutate,
    deleteDocument: remove.mutate,
  };
}

export function useCountryHistory() {
  const queryClient = useQueryClient();
  const query = useQuery<CountryPeriod[]>({
    queryKey: ['countryHistory'],
    queryFn: () => fetchJson<any[]>('/api/country-history').then(periods =>
      periods.map(p => ({
        id: String(p.id),
        country: p.country,
        state: p.state,
        startYear: p.startYear,
        endYear: p.endYear === 'Present' ? 'Present' : parseInt(p.endYear),
      }))
    ),
  });

  const add = useMutation({
    mutationFn: (data: Omit<CountryPeriod, 'id'>) => postJson('/api/country-history', {
      ...data,
      endYear: String(data.endYear),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['countryHistory'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteJson(`/api/country-history/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['countryHistory'] }),
  });

  return {
    countryHistory: query.data || [],
    isLoading: query.isLoading,
    addCountryPeriod: add.mutate,
    deleteCountryPeriod: remove.mutate,
  };
}
