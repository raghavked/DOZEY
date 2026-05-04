import { useState, useRef, useEffect } from 'react';
import { UploadedDocument, VaccinationRecord, ParsedVaccinationData, MedicalExemption } from '@/types';
import { Upload, FileText, Image, Trash2, Plus, Download, Pencil, Check, X, Sparkles, Loader2, ChevronDown, ChevronUp, Import, AlertCircle, CheckCircle2, Globe, Stethoscope, ShieldCheck, Languages, Copy, FileDown } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { CustomSelect } from '@/components/CustomSelect';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { VACCINES, COUNTRIES, HEALTHCARE_PROVIDERS } from '@/lib/autocomplete-data';
import { useI18n } from '@/lib/i18n';

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onUpload: (formData: FormData) => void;
  onUpdate?: (id: string, data: { name?: string; type?: string; country?: string }) => void;
  onDelete: (id: string) => void;
  onAddVaccination: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
  onRefresh?: () => void;
  exemptions?: MedicalExemption[];
  vaccinations?: VaccinationRecord[];
  profile?: import('@/types').UserProfile | null;
}

function ProcessingStatusBadge({ status }: { status: string | null | undefined }) {
  const { t } = useI18n();
  if (!status || status === 'pending') return null;

  const config: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: t('processing') },
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" />, label: t('processed') },
    error: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-3 h-3" />, label: t('error') },
  };

  const c = config[status] || config.error;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  );
}

export function DocumentUpload({ documents, onUpload, onUpdate, onDelete, onAddVaccination, onRefresh, exemptions = [], vaccinations = [], profile }: DocumentUploadProps) {
  const { t } = useI18n();
  const [dragActive, setDragActive] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [editingVaccIdx, setEditingVaccIdx] = useState<{ docId: string; idx: number } | null>(null);
  const [editVaccForm, setEditVaccForm] = useState<{ vaccine_name: string; date: string; dose_number: string; provider: string; country_given: string; location: string; notes: string }>({ vaccine_name: '', date: '', dose_number: '', provider: '', country_given: '', location: '', notes: '' });
  const [importingSingle, setImportingSingle] = useState(false);
  const [translatingDocId, setTranslatingDocId] = useState<string | null>(null);
  const [translateLang, setTranslateLang] = useState<string>('');
  const [translatedResult, setTranslatedResult] = useState<{ docId: string; text: string; langName: string; langCode: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [copiedTranslation, setCopiedTranslation] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<Record<string, string>>({});
  const [languagesLoaded, setLanguagesLoaded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadLanguages = async () => {
      try {
        const sb = await getSupabase();
        const { data: { session } } = await sb.auth.getSession();
        if (!session) return;
        const res = await fetch('/api/translate/languages', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          const sorted = Object.fromEntries(
            Object.entries(data as Record<string, string>).sort(([, a], [, b]) => a.localeCompare(b))
          );
          setSupportedLanguages(sorted);
          setLanguagesLoaded(true);
        }
      } catch { /* silent — translate panel will show fallback */ }
    };
    loadLanguages();
    return () => { cancelled = true; };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('type', file.type.includes('pdf') ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'document');
      formData.append('country', 'Detecting...');
      onUpload(formData);
    }
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (docId: string, docName: string) => {
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = docName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleTranslateDocument = async (docId: string, targetLang: string) => {
    if (!targetLang) return;
    setIsTranslating(true);
    setTranslateError(null);
    setTranslatedResult(null);
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ targetLanguage: targetLang }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Translation failed');
      }
      const data = await res.json();
      setTranslatedResult({
        docId,
        text: data.translatedText,
        langName: data.targetLanguageName,
        langCode: data.targetLanguage,
      });
    } catch (err: any) {
      setTranslateError(err.message || 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyTranslation = async () => {
    if (!translatedResult?.text) return;
    try {
      await navigator.clipboard.writeText(translatedResult.text);
      setCopiedTranslation(true);
      setTimeout(() => setCopiedTranslation(false), 2000);
    } catch { /* fallback */ }
  };

  const handleDownloadTranslation = () => {
    if (!translatedResult) return;
    const blob = new Blob([translatedResult.text], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation_${translatedResult.langCode}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleProcess = async (docId: string) => {
    setProcessingId(docId);
    setProcessError(null);
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        // Handle document authenticity rejection (HTTP 422)
        if (res.status === 422 && err.verification) {
          const v = err.verification;
          onRefresh?.();
          const flags = v.flags?.length ? `\n\nFlags:\n${v.flags.map((f: string) => `• ${f}`).join('\n')}` : '';
          throw new Error(
            `⚠️ Document Rejected — Authenticity Check Failed\n\n` +
            `Risk Level: ${(v.riskLevel || 'unknown').toUpperCase()}\n` +
            `Confidence Score: ${v.confidenceScore ?? 'N/A'}/100\n\n` +
            `Reason: ${v.summary || 'Document could not be verified.'}${flags}`
          );
        }
        throw new Error(err.message || 'Processing failed');
      }

      const data = await res.json();
      setExpandedDoc(docId);
      onRefresh?.();

      // Build verification note to append to success message
      const verif = data.verification;
      let verifNote = '';
      if (verif) {
        if (verif.riskLevel === 'low') {
          verifNote = `\n\n✅ Authenticity verified (confidence: ${verif.confidenceScore}/100)`;
        } else if (verif.riskLevel === 'medium') {
          verifNote = `\n\n⚠️ Document accepted with advisory note (confidence: ${verif.confidenceScore}/100). ${verif.summary}`;
        } else if (verif.riskLevel === 'high') {
          verifNote = `\n\n⚠️ Document flagged for manual review (confidence: ${verif.confidenceScore}/100). ${verif.summary}`;
        }
      }

      if (data.autoImported > 0 && data.needsReview > 0) {
        alert(`Document processed! ${data.autoImported} complete record${data.autoImported !== 1 ? 's' : ''} imported. ${data.needsReview} record${data.needsReview !== 1 ? 's' : ''} need${data.needsReview === 1 ? 's' : ''} your review — please fill in the missing details below.${verifNote}`);
      } else if (data.autoImported > 0) {
        alert(`Document processed! ${data.autoImported} vaccination${data.autoImported !== 1 ? 's' : ''} automatically added to your timeline.${verifNote}`);
      } else if (data.needsReview > 0) {
        alert(`Document processed! ${data.needsReview} record${data.needsReview !== 1 ? 's' : ''} found but missing required details. Please fill in the missing information below to import.${verifNote}`);
      } else if (verifNote) {
        alert(`Document processed.${verifNote}`);
      }
    } catch (err: any) {
      setProcessError(err.message || 'Failed to process document');
    } finally {
      setProcessingId(null);
    }
  };

  const handleImportVaccinations = async (docId: string) => {
    setImportingId(docId);
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/import-vaccinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Import failed');
      }

      const data = await res.json();
      if (data.alreadyImported) {
        alert(`These vaccinations were already imported automatically (${data.alreadyImported} record${data.alreadyImported !== 1 ? 's' : ''}).`);
      } else if (data.imported > 0 && data.skipped > 0) {
        alert(`Imported ${data.imported} record${data.imported !== 1 ? 's' : ''}. ${data.skipped} record${data.skipped !== 1 ? 's' : ''} skipped — please review and fill in missing details to import them individually.`);
      } else if (data.imported > 0) {
        alert(`Successfully imported ${data.imported} vaccination record${data.imported !== 1 ? 's' : ''}!`);
      } else if (data.skipped > 0) {
        alert(`No records could be imported. ${data.skipped} record${data.skipped !== 1 ? 's' : ''} need${data.skipped === 1 ? 's' : ''} your review — please fill in the missing vaccine name and date.`);
      }
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Failed to import vaccinations');
    } finally {
      setImportingId(null);
    }
  };

  const handleProcessDoctorNotes = async (docId: string) => {
    setProcessingId(docId);
    setProcessError(null);
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/process-doctor-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

       if (!res.ok) {
        const err = await res.json();
        // Handle document authenticity rejection (HTTP 422)
        if (res.status === 422 && err.verification) {
          const v = err.verification;
          onRefresh?.();
          const flags = v.flags?.length ? `\n\nFlags:\n${v.flags.map((f: string) => `• ${f}`).join('\n')}` : '';
          throw new Error(
            `⚠️ Document Rejected — Authenticity Check Failed\n\n` +
            `Risk Level: ${(v.riskLevel || 'unknown').toUpperCase()}\n` +
            `Confidence Score: ${v.confidenceScore ?? 'N/A'}/100\n\n` +
            `Reason: ${v.summary || 'Document could not be verified.'}${flags}`
          );
        }
        throw new Error(err.message || 'Processing failed');
      }
      const data = await res.json();
      setExpandedDoc(docId);
      onRefresh?.();

      // Build verification note
      const dnVerif = data.verification;
      let dnVerifNote = '';
      if (dnVerif) {
        if (dnVerif.riskLevel === 'low') {
          dnVerifNote = `\n\n✅ Authenticity verified (confidence: ${dnVerif.confidenceScore}/100)`;
        } else if (dnVerif.riskLevel === 'medium') {
          dnVerifNote = `\n\n⚠️ Document accepted with advisory note (confidence: ${dnVerif.confidenceScore}/100). ${dnVerif.summary}`;
        } else if (dnVerif.riskLevel === 'high') {
          dnVerifNote = `\n\n⚠️ Document flagged for manual review (confidence: ${dnVerif.confidenceScore}/100). ${dnVerif.summary}`;
        }
      }

      const parts: string[] = [];
      if (data.autoImportedVacc > 0) parts.push(`${data.autoImportedVacc} vaccination${data.autoImportedVacc !== 1 ? 's' : ''}`);
      if (data.autoImportedExempt > 0) parts.push(`${data.autoImportedExempt} exemption${data.autoImportedExempt !== 1 ? 's' : ''}`);
      const reviewParts: string[] = [];
      if (data.needsReviewVacc > 0) reviewParts.push(`${data.needsReviewVacc} vaccination${data.needsReviewVacc !== 1 ? 's' : ''}`);
      if (data.needsReviewExempt > 0) reviewParts.push(`${data.needsReviewExempt} exemption${data.needsReviewExempt !== 1 ? 's' : ''}`);
      if (parts.length > 0 && reviewParts.length > 0) {
        alert(`Document processed! ${parts.join(' and ')} imported. ${reviewParts.join(' and ')} need your review — please fill in missing details below.${dnVerifNote}`);
      } else if (parts.length > 0) {
        alert(`Document processed! ${parts.join(' and ')} automatically imported.${dnVerifNote}`);
      } else if (reviewParts.length > 0) {
        alert(`Document processed! ${reviewParts.join(' and ')} found but need your review — please fill in missing details below.${dnVerifNote}`);
      } else if (dnVerifNote) {
        alert(`Document processed.${dnVerifNote}`);
      }
    } catch (err: any) {
      setProcessError(err.message || 'Failed to process doctor notes');
    } finally {
      setProcessingId(null);
    }
  };

  const startEditVacc = (docId: string, idx: number, v: any) => {
    setEditingVaccIdx({ docId, idx });
    setEditVaccForm({
      vaccine_name: v.vaccine_name || '',
      date: v.date || '',
      dose_number: v.dose_number?.toString() || '',
      provider: v.provider || '',
      country_given: v.country_given || '',
      location: v.location || '',
      notes: v.notes || '',
    });
  };

  const handleImportSingleVacc = async (docId: string) => {
    if (!editVaccForm.vaccine_name || !editVaccForm.date) {
      alert('Please fill in at least the vaccine name and date before importing.');
      return;
    }
    setImportingSingle(true);
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/import-single-vaccination`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          vaccine_name: editVaccForm.vaccine_name,
          date: editVaccForm.date,
          dose_number: editVaccForm.dose_number ? parseInt(editVaccForm.dose_number) : null,
          provider: editVaccForm.provider || null,
          country_given: editVaccForm.country_given || null,
          location: editVaccForm.location || null,
          notes: editVaccForm.notes || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Import failed');
      }
      setEditingVaccIdx(null);
      onRefresh?.();
      alert('Vaccination record imported successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to import vaccination');
    } finally {
      setImportingSingle(false);
    }
  };

  const handleImportExemptions = async (docId: string) => {
    setImportingId(docId);
    try {
      const sb = await getSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch(`/api/documents/${docId}/import-exemptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Import failed');
      }

      const data = await res.json();
      alert(`Successfully imported ${data.imported} medical exemption${data.imported !== 1 ? 's' : ''}!`);
      onRefresh?.();
    } catch (err: any) {
      alert(err.message || 'Failed to import exemptions');
    } finally {
      setImportingId(null);
    }
  };

  const getParsedData = (doc: UploadedDocument): ParsedVaccinationData | null => {
    if (!doc.parsedData) return null;
    try {
      return JSON.parse(doc.parsedData);
    } catch {
      return null;
    }
  };

  const getManualDefaults = () => ({
    vaccineName: '',
    date: '',
    doseNumber: 1,
    location: profile?.currentState && profile?.currentCountry
      ? `${profile.currentState}, ${profile.currentCountry}`
      : profile?.currentCountry || '',
    countryGiven: profile?.currentCountry || '',
    provider: profile?.primaryProvider || '',
    notes: '',
    verified: false,
  });

  const [manualForm, setManualForm] = useState(getManualDefaults);

  useEffect(() => {
    if (!showManualEntry) return;
    setManualForm(prev => ({
      ...prev,
      countryGiven: prev.countryGiven || profile?.currentCountry || '',
      provider: prev.provider || profile?.primaryProvider || '',
      location: prev.location || (profile?.currentState && profile?.currentCountry
        ? `${profile.currentState}, ${profile.currentCountry}`
        : profile?.currentCountry || ''),
    }));
  }, [profile, showManualEntry]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVaccination(manualForm);
    setManualForm(getManualDefaults());
    setShowManualEntry(false);
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border-0 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-8 h-8 text-[#1d1d1f]/30" />
          <div>
            <h1 className="text-[#1d1d1f] font-semibold">{t('uploadDocuments')}</h1>
            <p className="text-[#86868b]">{t('documentDescription')}</p>
          </div>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            dragActive ? 'border-[#4a7fb5] bg-blue-50/50' : 'border-0 bg-[#f5f5f7]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            id="file-upload"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="w-16 h-16 text-[#1d1d1f]/10 mb-4" />
              {uploading ? (
                <p className="text-[#4a7fb5] mb-2 font-medium">Uploading...</p>
              ) : (
                <>
                  <p className="text-[#86868b] mb-2">
                    {t('dropFilesHere')}
                  </p>
                  <p className="text-[#86868b] text-sm">
                    {t('maxFileSize')}
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        <div className="mt-6">
          <button
            onClick={() => { if (!showManualEntry) setManualForm(getManualDefaults()); setShowManualEntry(!showManualEntry); }}
            className="w-full bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('manualEntry')}
          </button>
        </div>
      </div>

      {showManualEntry && (
        <div className="bg-[#f5f5f7] rounded-2xl border-0 p-8">
          <h2 className="text-sm font-semibold text-[#1d1d1f] mb-6">{t('manualEntry')}</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AutocompleteInput
                id="vaccineName"
                label={t('vaccineName')}
                value={manualForm.vaccineName}
                onChange={(val) => setManualForm(prev => ({ ...prev, vaccineName: val }))}
                suggestions={VACCINES}
                required
                placeholder="e.g., COVID-19, Measles, Hepatitis B"
              />
              <div>
                <label htmlFor="date" className="block text-[#86868b] mb-2">{t('dateAdministered')} *</label>
                <input
                  type="date"
                  id="date"
                  value={manualForm.date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setManualForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="w-full px-4 py-2 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
                />
              </div>
              <AutocompleteInput
                id="countryGiven"
                label={t('countryGiven')}
                value={manualForm.countryGiven}
                onChange={(val) => setManualForm(prev => ({ ...prev, countryGiven: val }))}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., India, USA, Germany"
              />
              <CustomSelect
                id="doseNumber"
                label={t('doseNumber')}
                value={String(manualForm.doseNumber)}
                onChange={(val) => setManualForm(prev => ({ ...prev, doseNumber: parseInt(val) }))}
                options={[1, 2, 3, 4, 5].map(n => ({ value: String(n), label: `Dose ${n}` }))}
                required
              />
              <AutocompleteInput
                id="location"
                label={t('location')}
                value={manualForm.location}
                onChange={(val) => setManualForm(prev => ({ ...prev, location: val }))}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., City Hospital, Local Clinic"
              />
              <AutocompleteInput
                id="provider"
                label={t('provider')}
                value={manualForm.provider}
                onChange={(val) => setManualForm(prev => ({ ...prev, provider: val }))}
                suggestions={HEALTHCARE_PROVIDERS}
                required
                placeholder="e.g., Dr. Smith"
              />
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-[#86868b] mb-2">{t('notes')} ({t('monthOptional')})</label>
                <textarea
                  id="notes"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any additional information"
                  className="w-full px-4 py-2 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white py-3 rounded-full transition-colors">
                {t('addVaccination')}
              </button>
              <button type="button" onClick={() => setShowManualEntry(false)} className="flex-1 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] py-3 rounded-full transition-colors">
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {processError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{processError}</p>
          <button onClick={() => setProcessError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {documents.length > 0 && (
        <div className="bg-white rounded-2xl border-0 p-8">
          <h2 className="font-semibold text-[#1d1d1f] mb-6">{t('documentManagement')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {documents.map(doc => {
              const parsed = getParsedData(doc);
              const isExpanded = expandedDoc === doc.id;
              const isProcessing = processingId === doc.id;
              const isImporting = importingId === doc.id;

              return (
                <div key={doc.id} className="border-0 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {doc.mimeType?.startsWith('image/') || doc.type === 'image' ? (
                        <Image className="w-10 h-10 text-blue-500 flex-shrink-0" />
                      ) : (
                        <FileText className="w-10 h-10 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        {editingId === doc.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-0 rounded-xl focus:ring-1 focus:ring-[#4a7fb5] outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  onUpdate?.(doc.id, { name: editName });
                                  setEditingId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingId(null);
                                }
                              }}
                            />
                            <button
                              onClick={() => { onUpdate?.(doc.id, { name: editName }); setEditingId(null); }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-[#86868b] hover:text-[#1d1d1f]"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h4 className="font-semibold text-[#1d1d1f] truncate">{doc.name}</h4>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {doc.country && doc.country !== 'Detecting...' && (
                            <p className="text-[#86868b] text-sm">From: {doc.country}</p>
                          )}
                          {doc.country === 'Detecting...' && (
                            <p className="text-[#86868b] text-sm italic">Country: auto-detected after processing</p>
                          )}
                          {doc.fileSize && (
                            <span className="text-[#86868b] text-xs">({formatFileSize(doc.fileSize)})</span>
                          )}
                          <ProcessingStatusBadge status={doc.processingStatus} />
                          {doc.originalLanguage && doc.originalLanguage !== 'en' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Globe className="w-3 h-3" /> {doc.originalLanguage.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-[#86868b] text-sm">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
                        {doc.fileName && (!doc.processingStatus || doc.processingStatus === 'pending' || doc.processingStatus === 'error') && (
                          <>
                            <button
                              onClick={() => handleProcess(doc.id)}
                              disabled={isProcessing}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#8aab45] hover:bg-[#7a9a3a] text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                              title="Extract vaccination records with AI"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                              )}
                              {isProcessing ? t('processing') : 'AI Extract'}
                            </button>
                            <button
                              onClick={() => handleProcessDoctorNotes(doc.id)}
                              disabled={isProcessing}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                              title="Analyze handwritten doctor notes for exemptions & immunity"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Stethoscope className="w-3.5 h-3.5" />
                              )}
                              {isProcessing ? t('processing') : t('doctorNotes')}
                            </button>
                          </>
                        )}
                        {onUpdate && editingId !== doc.id && (
                          <button
                            onClick={() => { setEditingId(doc.id); setEditName(doc.name); }}
                            className="text-[#86868b] hover:text-[#4a7fb5] transition-colors p-1"
                            title={t('rename')}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {doc.fileName && (
                          <button
                            onClick={() => handleDownload(doc.id, doc.fileName || doc.name)}
                            className="text-[#86868b] hover:text-blue-500 transition-colors p-1"
                            title={t('download')}
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="text-[#86868b] hover:text-red-500 transition-colors p-1"
                          title={t('delete')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {doc.processingStatus === 'completed' && parsed && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                          className="flex items-center gap-1 text-sm text-[#4a7fb5] hover:text-[#3a6a9a] font-medium"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {(() => {
                            const parts = [];
                            if (parsed.vaccinations?.length) parts.push(`${parsed.vaccinations.length} vaccination${parsed.vaccinations.length !== 1 ? 's' : ''}`);
                            if ((parsed as any).exemptions?.length) parts.push(`${(parsed as any).exemptions.length} exemption${(parsed as any).exemptions.length !== 1 ? 's' : ''}`);
                            return parts.length > 0 ? parts.join(' & ') + ' found' : 'View extracted data';
                          })()}
                        </button>
                      </div>
                    )}
                  </div>

                  {isExpanded && parsed && (
                    <div className="border-t border-black/5 bg-[#f5f5f7] p-4 space-y-4">
                      {parsed.summary && (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
                          <p className="text-sm text-blue-800">{parsed.summary}</p>
                        </div>
                      )}

                      {parsed.patient_info && (parsed.patient_info.full_name || parsed.patient_info.date_of_birth) && (
                        <div className="bg-white rounded-2xl p-3 border-0">
                          <h5 className="text-xs font-semibold text-[#1d1d1f] uppercase mb-2">Patient Information</h5>
                          <div className="text-sm text-[#86868b] space-y-1">
                            {parsed.patient_info.full_name && <p>Name: {parsed.patient_info.full_name}</p>}
                            {parsed.patient_info.date_of_birth && <p>DOB: {parsed.patient_info.date_of_birth}</p>}
                          </div>
                        </div>
                      )}

                      {parsed.vaccinations && parsed.vaccinations.length > 0 && (() => {
                        const alreadyImported = vaccinations.some(v => v.documentId === doc.id);
                        const completeRecords = parsed.vaccinations.filter((v: any) => v.vaccine_name && v.date);
                        const incompleteRecords = parsed.vaccinations.filter((v: any) => !v.vaccine_name || !v.date);
                        return (
                        <div>
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <h5 className="text-xs font-semibold text-[#1d1d1f] uppercase">{t('parsedVaccinations')}</h5>
                            {alreadyImported ? (
                              <span className="flex items-center gap-1 px-3 py-1.5 bg-[#4d9068]/10 text-[#4d9068] text-xs font-medium rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Imported to Timeline
                              </span>
                            ) : completeRecords.length > 0 ? (
                              <div className="flex items-center gap-2">
                                {incompleteRecords.length > 0 && (
                                  <span className="text-xs text-amber-600">
                                    {incompleteRecords.length} need{incompleteRecords.length === 1 ? 's' : ''} review
                                  </span>
                                )}
                                <button
                                  onClick={() => handleImportVaccinations(doc.id)}
                                  disabled={isImporting}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#4d9068] hover:bg-[#3d7a58] text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                                >
                                  {isImporting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Import className="w-3.5 h-3.5" />
                                  )}
                                  {isImporting ? 'Importing...' : `Import ${completeRecords.length} Complete`}
                                </button>
                              </div>
                            ) : (
                              <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {t('reviewRequired')}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {parsed.vaccinations.map((v: any, i: number) => {
                              const isEditing = editingVaccIdx?.docId === doc.id && editingVaccIdx?.idx === i;
                              const missingRequired = !v.vaccine_name || !v.date;
                              const missingFields = v.missing_fields || [];
                              const isAlreadyImported = vaccinations.some(vr => vr.documentId === doc.id);
                              const confidence = v.confidence || 'medium';

                              if (isEditing) {
                                return (
                                  <div key={i} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h6 className="text-xs font-semibold text-amber-800 uppercase">Fill in missing details</h6>
                                      <button onClick={() => setEditingVaccIdx(null)} className="text-[#86868b] hover:text-[#1d1d1f]"><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-[#86868b] mb-1 block">Vaccine Name *</label>
                                        <AutocompleteInput value={editVaccForm.vaccine_name} onChange={(val) => setEditVaccForm(p => ({...p, vaccine_name: val}))} suggestions={VACCINES} placeholder="e.g. COVID-19 Pfizer" className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full" />
                                      </div>
                                      <div>
                                        <label className="text-xs text-[#86868b] mb-1 block">Date *</label>
                                        <input type="date" value={editVaccForm.date} onChange={(e) => setEditVaccForm(p => ({...p, date: e.target.value}))} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full" />
                                      </div>
                                      <div>
                                        <label className="text-xs text-[#86868b] mb-1 block">Dose Number</label>
                                        <input type="number" min="1" max="10" value={editVaccForm.dose_number} onChange={(e) => setEditVaccForm(p => ({...p, dose_number: e.target.value}))} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full" placeholder="e.g. 1" />
                                      </div>
                                      <div>
                                        <label className="text-xs text-[#86868b] mb-1 block">Provider</label>
                                        <AutocompleteInput value={editVaccForm.provider} onChange={(val) => setEditVaccForm(p => ({...p, provider: val}))} suggestions={HEALTHCARE_PROVIDERS} placeholder="e.g. CVS Pharmacy" className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full" />
                                      </div>
                                      <div>
                                        <label className="text-xs text-[#86868b] mb-1 block">Country</label>
                                        <AutocompleteInput value={editVaccForm.country_given} onChange={(val) => setEditVaccForm(p => ({...p, country_given: val}))} suggestions={COUNTRIES} placeholder="e.g. United States" className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full" />
                                      </div>
                                      <div>
                                        <label className="text-xs text-[#86868b] mb-1 block">Location</label>
                                        <input type="text" value={editVaccForm.location} onChange={(e) => setEditVaccForm(p => ({...p, location: e.target.value}))} className="bg-white border border-black/10 rounded-xl px-3 py-2 text-sm w-full" placeholder="e.g. Main Street Clinic" />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <button onClick={() => setEditingVaccIdx(null)} className="px-3 py-1.5 text-xs text-[#86868b] hover:text-[#1d1d1f] rounded-full">{t('cancel')}</button>
                                      <button
                                        onClick={() => handleImportSingleVacc(doc.id)}
                                        disabled={importingSingle || !editVaccForm.vaccine_name || !editVaccForm.date}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#4d9068] hover:bg-[#3d7a58] text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                                      >
                                        {importingSingle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Import className="w-3.5 h-3.5" />}
                                        {importingSingle ? 'Importing...' : 'Import This Record'}
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div key={i} className={`rounded-2xl p-3 border-0 ${missingRequired ? 'bg-amber-50 border border-amber-200' : 'bg-white'}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-[#1d1d1f]">{v.vaccine_name || <span className="text-amber-600 italic">Name not found</span>}</span>
                                    {v.dose_number && (
                                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Dose {v.dose_number}</span>
                                    )}
                                    {confidence === 'low' && (
                                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Low confidence</span>
                                    )}
                                    {missingRequired && !isAlreadyImported && (
                                      <button
                                        onClick={() => startEditVacc(doc.id, i, v)}
                                        className="ml-auto flex items-center gap-1 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-full transition-colors"
                                      >
                                        <Pencil className="w-3 h-3" />
                                        Fill Missing Info
                                      </button>
                                    )}
                                    {!missingRequired && !isAlreadyImported && (
                                      <button
                                        onClick={() => startEditVacc(doc.id, i, v)}
                                        className="ml-auto text-[#86868b] hover:text-[#4a7fb5] transition-colors p-1"
                                        title="Edit before importing"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-[#86868b]">
                                    {v.date ? <span>Date: {v.date}</span> : <span className="text-amber-600">Date: not found</span>}
                                    {v.provider && <span>Provider: {v.provider}</span>}
                                    {v.country_given && <span>Country: {v.country_given}</span>}
                                    {v.location && <span>Location: {v.location}</span>}
                                  </div>
                                  {missingFields.length > 0 && !missingRequired && (
                                    <p className="text-xs text-[#86868b]/70 mt-1 italic">
                                      {missingFields.map((f: string) => {
                                        const labels: Record<string, string> = {
                                          dose_number: 'Dose Number',
                                          provider: 'Provider',
                                          country_given: 'Country',
                                          location: 'Location',
                                          date: 'Date',
                                          vaccine_name: 'Vaccine Name',
                                        };
                                        return labels[f] || f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                      }).join(', ')} — not explicitly stated in document
                                    </p>
                                  )}
                                  {v.notes && <p className="text-xs text-[#86868b] mt-1">{v.notes}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        );
                      })()}

                      {(parsed as any).exemptions && (parsed as any).exemptions.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-semibold text-[#1d1d1f] uppercase flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                              {t('medicalExemptions')}
                            </h5>
                            <button
                              onClick={() => handleImportExemptions(doc.id)}
                              disabled={isImporting}
                              className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                            >
                              {isImporting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5" />
                              )}
                              {isImporting ? t('processing') : t('importAll')}
                            </button>
                          </div>
                          <div className="space-y-2">
                            {(parsed as any).exemptions.map((ex: any, i: number) => {
                              const typeLabels: Record<string, { label: string; color: string }> = {
                                natural_immunity: { label: 'Natural Immunity', color: 'bg-green-100 text-green-700' },
                                medical_contraindication: { label: 'Medical Exemption', color: 'bg-red-100 text-red-700' },
                                prior_infection: { label: 'Prior Infection', color: 'bg-orange-100 text-orange-700' },
                                titer_positive: { label: 'Positive Titer', color: 'bg-blue-100 text-blue-700' },
                                other: { label: 'Other', color: 'bg-[#f5f5f7] text-[#86868b]' },
                              };
                              const typeInfo = typeLabels[ex.exemption_type] || typeLabels.other;
                              return (
                                <div key={i} className="bg-white rounded-2xl p-3 border-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                                    <span className="font-semibold text-sm text-[#1d1d1f]">{ex.vaccine_name}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
                                  </div>
                                  <p className="text-xs text-[#86868b] ml-6 mb-1">{ex.reason}</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-[#86868b] ml-6">
                                    {ex.doctor_name && <span>Doctor: {ex.doctor_name}</span>}
                                    {ex.doctor_license && <span>License: {ex.doctor_license}</span>}
                                    {ex.document_date && <span>Date: {ex.document_date}</span>}
                                  </div>
                                  {ex.notes && <p className="text-xs text-[#86868b] mt-1 ml-6 italic">{ex.notes}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {parsed.vaccinations?.length === 0 && !(parsed as any).exemptions?.length && (
                        <div className="text-sm text-[#86868b] text-center py-2">
                          {t('noDocuments')}
                        </div>
                      )}

                      {doc.processingStatus === 'completed' && (
                      <div className="bg-white rounded-2xl p-4 border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Languages className="w-4 h-4 text-[#4a7fb5]" />
                          <h5 className="text-xs font-semibold text-[#1d1d1f] uppercase">Translate Document</h5>
                        </div>
                        <p className="text-xs text-[#86868b] mb-3">
                          {doc.originalLanguage && doc.originalLanguage !== 'en'
                            ? `Original: ${(() => {
                                const langNames: Record<string, string> = { es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ar: 'Arabic', hi: 'Hindi', ru: 'Russian', it: 'Italian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish', uk: 'Ukrainian', sv: 'Swedish', da: 'Danish', fi: 'Finnish', nb: 'Norwegian', cs: 'Czech', ro: 'Romanian', hu: 'Hungarian', el: 'Greek', bg: 'Bulgarian', sk: 'Slovak', sl: 'Slovenian', et: 'Estonian', lv: 'Latvian', lt: 'Lithuanian', id: 'Indonesian' };
                                return langNames[doc.originalLanguage?.toLowerCase() || ''] || doc.originalLanguage;
                              })()}. Translated to English during processing. Choose another language below to translate further.`
                            : 'Translate this document into any supported language. Useful for visa applications, school enrollment, or sharing records internationally.'
                          }
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={translatingDocId === doc.id ? translateLang : ''}
                            onChange={(e) => {
                              setTranslatingDocId(doc.id);
                              setTranslateLang(e.target.value);
                              setTranslatedResult(null);
                              setTranslateError(null);
                            }}
                            className="bg-[#f5f5f7] border-0 rounded-xl px-3 py-2 text-sm text-[#1d1d1f] flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#4a7fb5]/30"
                          >
                            <option value="">{languagesLoaded ? 'Select target language...' : 'Loading languages...'}</option>
                            {Object.entries(supportedLanguages).map(([code, name]) => (
                              <option key={code} value={code}>{name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleTranslateDocument(doc.id, translateLang)}
                            disabled={isTranslating || !translateLang || translatingDocId !== doc.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#4a7fb5] hover:bg-[#3d6d9e] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                          >
                            {isTranslating && translatingDocId === doc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Languages className="w-4 h-4" />
                            )}
                            {isTranslating && translatingDocId === doc.id ? 'Translating...' : 'Translate'}
                          </button>
                        </div>

                        {translateError && translatingDocId === doc.id && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {translateError}
                          </div>
                        )}

                        {translatedResult && translatedResult.docId === doc.id && (
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-[#4a7fb5]">
                                Translated to {translatedResult.langName}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={handleCopyTranslation}
                                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#86868b] hover:text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-lg transition-colors"
                                  title="Copy translation"
                                >
                                  {copiedTranslation ? <Check className="w-3 h-3 text-[#4d9068]" /> : <Copy className="w-3 h-3" />}
                                  {copiedTranslation ? 'Copied' : 'Copy'}
                                </button>
                                <button
                                  onClick={handleDownloadTranslation}
                                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#86868b] hover:text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] rounded-lg transition-colors"
                                  title="Download as text file"
                                >
                                  <FileDown className="w-3 h-3" />
                                  Download
                                </button>
                              </div>
                            </div>
                            <div className="bg-[#f5f5f7] rounded-xl p-4 max-h-64 overflow-y-auto">
                              <pre className="text-sm text-[#1d1d1f] whitespace-pre-wrap font-sans leading-relaxed">{translatedResult.text}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {exemptions.length > 0 && (
        <div className="bg-white rounded-2xl border-0 p-6">
          <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1d1d1f]/30" />
            {t('medicalExemptions')} ({exemptions.length})
          </h3>
          <div className="space-y-2">
            {exemptions.map((ex) => {
              const typeLabels: Record<string, { label: string; color: string }> = {
                natural_immunity: { label: 'Natural Immunity', color: 'bg-green-100 text-green-700' },
                medical_contraindication: { label: 'Medical Exemption', color: 'bg-red-100 text-red-700' },
                prior_infection: { label: 'Prior Infection', color: 'bg-orange-100 text-orange-700' },
                titer_positive: { label: 'Positive Titer', color: 'bg-blue-100 text-blue-700' },
                other: { label: 'Other', color: 'bg-[#f5f5f7] text-[#86868b]' },
              };
              const typeInfo = typeLabels[ex.exemptionType] || typeLabels.other;
              return (
                <div key={ex.id} className="flex items-center justify-between bg-[#f5f5f7] rounded-2xl p-3 border-0">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1d1d1f]">{ex.vaccineName}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
                      </div>
                      <p className="text-xs text-[#86868b]">{ex.reason}</p>
                      {ex.doctorName && <p className="text-xs text-[#86868b]">Dr. {ex.doctorName}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#86868b] mt-3">
            These exemptions will be considered when checking compliance requirements.
          </p>
        </div>
      )}
    </div>
  );
}
