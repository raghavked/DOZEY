import { useState, useRef } from 'react';
import { UploadedDocument, VaccinationRecord, ParsedVaccinationData } from '@/types';
import { Upload, FileText, Image, Trash2, Plus, Download, Pencil, Check, X, Sparkles, Loader2, ChevronDown, ChevronUp, Import, AlertCircle, CheckCircle2, Globe } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onUpload: (formData: FormData) => void;
  onUpdate?: (id: string, data: { name?: string; type?: string; country?: string }) => void;
  onDelete: (id: string) => void;
  onAddVaccination: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
  onRefresh?: () => void;
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

export function DocumentUpload({ documents, onUpload, onUpdate, onDelete, onAddVaccination, onRefresh }: DocumentUploadProps) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-8 h-8 text-[#1051a5]" />
          <div>
            <h1 className="text-[#22283a]">Upload Documents</h1>
            <p className="text-gray-600">Import vaccine records from PDFs, photos, or scans. Our AI can extract and translate the data automatically.</p>
          </div>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
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
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
              {uploading ? (
                <p className="text-[#1051a5] mb-2 font-medium">Uploading...</p>
              ) : (
                <>
                  <p className="text-gray-700 mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-gray-500 text-sm">
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
            className="w-full bg-[#1051a5] hover:bg-[#0d4185] text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Or Enter Vaccine Details Manually
          </button>
        </div>
      </div>

      {showManualEntry && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6">Manual Entry</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vaccineName" className="block text-gray-700 mb-2">Vaccine Name *</label>
                <input
                  type="text"
                  id="vaccineName"
                  value={manualForm.vaccineName}
                  onChange={(e) => setManualForm(prev => ({ ...prev, vaccineName: e.target.value }))}
                  required
                  placeholder="e.g., COVID-19, Measles, Hepatitis B"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-700 mb-2">Date Administered *</label>
                <input
                  type="date"
                  id="date"
                  value={manualForm.date}
                  onChange={(e) => setManualForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="countryGiven" className="block text-gray-700 mb-2">Country Given *</label>
                <input
                  type="text"
                  id="countryGiven"
                  value={manualForm.countryGiven}
                  onChange={(e) => setManualForm(prev => ({ ...prev, countryGiven: e.target.value }))}
                  required
                  placeholder="e.g., India, USA, Germany"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="doseNumber" className="block text-gray-700 mb-2">Dose Number *</label>
                <select
                  id="doseNumber"
                  value={manualForm.doseNumber}
                  onChange={(e) => setManualForm(prev => ({ ...prev, doseNumber: parseInt(e.target.value) }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>Dose {num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  id="location"
                  value={manualForm.location}
                  onChange={(e) => setManualForm(prev => ({ ...prev, location: e.target.value }))}
                  required
                  placeholder="e.g., City Hospital, Local Clinic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="provider" className="block text-gray-700 mb-2">Healthcare Provider *</label>
                <input
                  type="text"
                  id="provider"
                  value={manualForm.provider}
                  onChange={(e) => setManualForm(prev => ({ ...prev, provider: e.target.value }))}
                  required
                  placeholder="e.g., Dr. Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  id="notes"
                  value={manualForm.notes}
                  onChange={(e) => setManualForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any additional information"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-[#1051a5] hover:bg-[#0d4185] text-white py-3 rounded-lg transition-colors">
                Add Vaccine Record
              </button>
              <button type="button" onClick={() => setShowManualEntry(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {processError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{processError}</p>
          <button onClick={() => setProcessError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {documents.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6">Uploaded Documents</h2>
          <div className="space-y-4">
            {documents.map(doc => {
              const parsed = getParsedData(doc);
              const isExpanded = expandedDoc === doc.id;
              const isProcessing = processingId === doc.id;
              const isImporting = importingId === doc.id;

              return (
                <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#1051a5] outline-none"
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
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <h4 className="text-gray-900 truncate">{doc.name}</h4>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-gray-600 text-sm">From: {doc.country}</p>
                          {doc.fileSize && (
                            <span className="text-gray-400 text-xs">({formatFileSize(doc.fileSize)})</span>
                          )}
                          <ProcessingStatusBadge status={doc.processingStatus} />
                          {doc.originalLanguage && doc.originalLanguage !== 'en' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              <Globe className="w-3 h-3" /> {doc.originalLanguage.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {doc.fileName && (!doc.processingStatus || doc.processingStatus === 'pending' || doc.processingStatus === 'error') && (
                          <button
                            onClick={() => handleProcess(doc.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#97bf2d] hover:bg-[#87af1d] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                            title="Extract & translate with AI"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                            {isProcessing ? 'Processing...' : 'AI Extract'}
                          </button>
                        )}
                        {onUpdate && editingId !== doc.id && (
                          <button
                            onClick={() => { setEditingId(doc.id); setEditName(doc.name); }}
                            className="text-gray-400 hover:text-[#1051a5] transition-colors p-1"
                            title="Rename"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {doc.fileName && (
                          <button
                            onClick={() => handleDownload(doc.id, doc.fileName || doc.name)}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(doc.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
                          className="flex items-center gap-1 text-sm text-[#1051a5] hover:text-[#0d4185] font-medium"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {parsed.vaccinations?.length
                            ? `${parsed.vaccinations.length} vaccination${parsed.vaccinations.length !== 1 ? 's' : ''} found`
                            : 'View extracted data'}
                        </button>
                      </div>
                    )}
                  </div>

                  {isExpanded && parsed && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                      {parsed.summary && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">{parsed.summary}</p>
                        </div>
                      )}

                      {parsed.patient_info && (parsed.patient_info.full_name || parsed.patient_info.date_of_birth) && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Patient Information</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            {parsed.patient_info.full_name && <p>Name: {parsed.patient_info.full_name}</p>}
                            {parsed.patient_info.date_of_birth && <p>DOB: {parsed.patient_info.date_of_birth}</p>}
                          </div>
                        </div>
                      )}

                      {parsed.vaccinations && parsed.vaccinations.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-semibold text-gray-500 uppercase">Extracted Vaccinations</h5>
                            <button
                              onClick={() => handleImportVaccinations(doc.id)}
                              disabled={isImporting}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#26844f] hover:bg-[#1e6b3f] text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
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
                              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-gray-900">{v.vaccine_name}</span>
                                  {v.dose_number && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Dose {v.dose_number}</span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-gray-600">
                                  {v.date && <span>Date: {v.date}</span>}
                                  {v.provider && <span>Provider: {v.provider}</span>}
                                  {v.country_given && <span>Country: {v.country_given}</span>}
                                  {v.location && <span>Location: {v.location}</span>}
                                </div>
                                {v.notes && <p className="text-xs text-gray-500 mt-1">{v.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {parsed.vaccinations?.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          No vaccination records found in this document.
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
    </div>
  );
}
