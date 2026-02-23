import { useState, useRef } from 'react';
import { UploadedDocument, VaccinationRecord } from '@/types';
import { Upload, FileText, Image, Trash2, Plus, Download, Pencil, Check, X } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onUpload: (formData: FormData) => void;
  onUpdate?: (id: string, data: { name?: string; type?: string; country?: string }) => void;
  onDelete: (id: string) => void;
  onAddVaccination: (vaccination: Omit<VaccinationRecord, 'id'>) => void;
}

export function DocumentUpload({ documents, onUpload, onUpdate, onDelete, onAddVaccination }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
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
            <p className="text-gray-600">Import vaccine records from PDFs, photos, or scans</p>
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

      {documents.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-gray-900 mb-6">Uploaded Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                    <p className="text-gray-600 text-sm">From: {doc.country}</p>
                    {doc.fileSize && (
                      <p className="text-gray-500 text-xs">{formatFileSize(doc.fileSize)}</p>
                    )}
                    <p className="text-gray-500 text-sm">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {onUpdate && editingId !== doc.id && (
                      <button
                        onClick={() => { setEditingId(doc.id); setEditName(doc.name); }}
                        className="text-gray-400 hover:text-[#1051a5] transition-colors"
                        title="Rename"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {doc.fileName && (
                      <button
                        onClick={() => handleDownload(doc.id, doc.fileName || doc.name)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
