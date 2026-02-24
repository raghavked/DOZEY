import { useState, useRef } from 'react';
import { UploadedDocument, VaccinationRecord, ParsedVaccinationData, MedicalExemption } from '@/types';
import { Upload, FileText, Image, Trash2, Plus, Download, Pencil, Check, X, Sparkles, Loader2, ChevronDown, ChevronUp, Import, AlertCircle, CheckCircle2, Globe, Stethoscope, ShieldCheck } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { CustomSelect } from '@/components/CustomSelect';
import { AutocompleteInput } from '@/components/AutocompleteInput';
import { VACCINES, COUNTRIES, HEALTHCARE_PROVIDERS } from '@/lib/autocomplete-data';

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onUpload: (formData: FormData) => void;
  onUpdate?: (id: string, data: { name?: string; type?: string; country?: string }) => void;
  onDelete: (id: string) => void;
  onAddVaccination: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
  onRefresh?: () => void;
  exemptions?: MedicalExemption[];
}

function ProcessingStatusBadge({ status }: { status: string | null | undefined }) {
  if (!status || status === 'pending') return null;

  const config: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Loader2 className="w-3 h-3 animate-spin" />, label: 'Processing...' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Processed' },
    error: { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle className="w-3 h-3" />, label: 'Error' },
  };

  const c = config[status] || config.error;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  );
}

export function DocumentUpload({ documents, onUpload, onUpdate, onDelete, onAddVaccination, onRefresh, exemptions = [] }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const country = prompt('Which country is this document from?') || 'Unknown';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('type', file.type.includes('pdf') ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'document');
      formData.append('country', country);
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
        throw new Error(err.message || 'Processing failed');
      }

      setExpandedDoc(docId);
      onRefresh?.();
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
      alert(`Successfully imported ${data.imported} vaccination record${data.imported !== 1 ? 's' : ''}!`);
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
        throw new Error(err.message || 'Processing failed');
      }

      setExpandedDoc(docId);
      onRefresh?.();
    } catch (err: any) {
      setProcessError(err.message || 'Failed to process doctor notes');
    } finally {
      setProcessingId(null);
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

  const [manualForm, setManualForm] = useState({
    vaccineName: '',
    date: '',
    doseNumber: 1,
    location: '',
    countryGiven: '',
    provider: '',
    notes: '',
    verified: false,
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVaccination(manualForm);
    setManualForm({
      vaccineName: '',
      date: '',
      doseNumber: 1,
      location: '',
      countryGiven: '',
      provider: '',
      notes: '',
      verified: false,
    });
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
            <h1 className="text-[#1d1d1f] font-semibold">Upload Documents</h1>
            <p className="text-[#86868b]">Import vaccine records from PDFs, photos, or scans. Our AI can extract and translate the data automatically.</p>
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
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-[#86868b] text-sm">
                    Supports: PDFs, JPG, PNG, Word docs (max 10MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full bg-[#4a7fb5] hover:bg-[#3a6a9a] text-white py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Or Enter Vaccine Details Manually
          </button>
        </div>
      </div>

      {showManualEntry && (
        <div className="bg-[#f5f5f7] rounded-2xl border-0 p-8">
          <h2 className="text-sm font-semibold text-[#1d1d1f] mb-6">Manual Entry</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AutocompleteInput
                id="vaccineName"
                label="Vaccine Name"
                value={manualForm.vaccineName}
                onChange={(val) => setManualForm(prev => ({ ...prev, vaccineName: val }))}
                suggestions={VACCINES}
                required
                placeholder="e.g., COVID-19, Measles, Hepatitis B"
              />
              <div>
                <label htmlFor="date" className="block text-[#86868b] mb-2">Date Administered *</label>
                <input
                  type="date"
                  id="date"
                  value={manualForm.date}
                  onChange={(e) => setManualForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="w-full px-4 py-2 bg-[#f5f5f7] border-0 rounded-xl focus:ring-2 focus:ring-[#4a7fb5] focus:border-transparent outline-none"
                />
              </div>
              <AutocompleteInput
                id="countryGiven"
                label="Country Given"
                value={manualForm.countryGiven}
                onChange={(val) => setManualForm(prev => ({ ...prev, countryGiven: val }))}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., India, USA, Germany"
              />
              <CustomSelect
                id="doseNumber"
                label="Dose Number"
                value={String(manualForm.doseNumber)}
                onChange={(val) => setManualForm(prev => ({ ...prev, doseNumber: parseInt(val) }))}
                options={[1, 2, 3, 4, 5].map(n => ({ value: String(n), label: `Dose ${n}` }))}
                required
              />
              <AutocompleteInput
                id="location"
                label="Location / Country"
                value={manualForm.location}
                onChange={(val) => setManualForm(prev => ({ ...prev, location: val }))}
                suggestions={COUNTRIES}
                required
                placeholder="e.g., City Hospital, Local Clinic"
              />
              <AutocompleteInput
                id="provider"
                label="Healthcare Provider"
                value={manualForm.provider}
                onChange={(val) => setManualForm(prev => ({ ...prev, provider: val }))}
                suggestions={HEALTHCARE_PROVIDERS}
                required
                placeholder="e.g., Dr. Smith"
              />
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-[#86868b] mb-2">Notes (Optional)</label>
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
                Add Vaccine Record
              </button>
              <button type="button" onClick={() => setShowManualEntry(false)} className="flex-1 bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] py-3 rounded-full transition-colors">
                Cancel
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
          <h2 className="font-semibold text-[#1d1d1f] mb-6">Uploaded Documents</h2>
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
                          <p className="text-[#86868b] text-sm">From: {doc.country}</p>
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
                              {isProcessing ? 'Processing...' : 'AI Extract'}
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
                              {isProcessing ? 'Analyzing...' : 'Doctor Notes'}
                            </button>
                          </>
                        )}
                        {onUpdate && editingId !== doc.id && (
                          <button
                            onClick={() => { setEditingId(doc.id); setEditName(doc.name); }}
                            className="text-[#86868b] hover:text-[#4a7fb5] transition-colors p-1"
                            title="Rename"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {doc.fileName && (
                          <button
                            onClick={() => handleDownload(doc.id, doc.fileName || doc.name)}
                            className="text-[#86868b] hover:text-blue-500 transition-colors p-1"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="text-[#86868b] hover:text-red-500 transition-colors p-1"
                          title="Delete"
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

                      {parsed.vaccinations && parsed.vaccinations.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-semibold text-[#1d1d1f] uppercase">Extracted Vaccinations</h5>
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
                              {isImporting ? 'Importing...' : 'Import All to Timeline'}
                            </button>
                          </div>
                          <div className="space-y-2">
                            {parsed.vaccinations.map((v, i) => (
                              <div key={i} className="bg-white rounded-2xl p-3 border-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-[#1d1d1f]">{v.vaccine_name}</span>
                                  {v.dose_number && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Dose {v.dose_number}</span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-[#86868b]">
                                  {v.date && <span>Date: {v.date}</span>}
                                  {v.provider && <span>Provider: {v.provider}</span>}
                                  {v.country_given && <span>Country: {v.country_given}</span>}
                                  {v.location && <span>Location: {v.location}</span>}
                                </div>
                                {v.notes && <p className="text-xs text-[#86868b] mt-1">{v.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(parsed as any).exemptions && (parsed as any).exemptions.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-semibold text-[#1d1d1f] uppercase flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                              Medical Exemptions / Immunity Evidence
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
                              {isImporting ? 'Importing...' : 'Import Exemptions'}
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
                          No vaccination records or exemptions found in this document.
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
            Saved Medical Exemptions ({exemptions.length})
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
