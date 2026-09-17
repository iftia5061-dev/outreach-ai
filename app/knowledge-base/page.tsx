'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Toast from '@/components/Toast';

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [documents, setDocuments] = useState([
    { id: 1, name: "Company Brochure.pdf", size: "2.4 MB", uploadedAt: "Sep 10, 2026" },
    { id: 2, name: "Service Catalog.pdf", size: "1.8 MB", uploadedAt: "Sep 12, 2026" },
    { id: 3, name: "Pricing Guide.pdf", size: "0.9 MB", uploadedAt: "Sep 14, 2026" },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSave = () => {
    setToast({ message: 'Knowledge base updated!', type: 'success' });
  };

  const handleUploadDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      name: `New Document ${documents.length + 1}.pdf`,
      size: "1.0 MB",
      uploadedAt: new Date().toLocaleDateString()
    };
    setDocuments([...documents, newDoc]);
    setToast({ message: 'Document uploaded successfully!', type: 'success' });
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(d => d.id !== id));
    setToast({ message: 'Document deleted', type: 'info' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
      >
        ← Back
      </button>
      <h2 className="text-base font-semibold text-white mb-6">Knowledge Base</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-white">Company Information</p>
              <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Edit</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
                <input type="text" defaultValue="Aegean Yacht Group" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Services Offered</label>
                <textarea rows={3} defaultValue="Shipyard refits, dry docking, maintenance, hull repairs, engine overhauls" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Locations</label>
                <input type="text" defaultValue="Greece, Malta, Italy, France, Libya" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-white">Services</p>
              <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Edit</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Refit Services</label>
                <textarea rows={2} defaultValue="Complete yacht refits, interior upgrades, exterior refinishing" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Maintenance Services</label>
                <textarea rows={2} defaultValue="Routine maintenance, system checks, preventive care" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Dry Docking</label>
                <textarea rows={2} defaultValue="Professional dry docking facilities, hull inspection, underwater repairs" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white resize-none" />
              </div>
            </div>
          </div>

          {/* Shipyard Locations */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-white">Shipyard Locations</p>
              <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Edit</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Greece</label>
                <input type="text" defaultValue="Athens, Piraeus - Full service yard" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Malta</label>
                <input type="text" defaultValue="Valletta - Mediterranean hub" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Italy</label>
                <input type="text" defaultValue="Genoa, La Spezia - Northern Italy" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">France</label>
                <input type="text" defaultValue="Marseille, Nice - Mediterranean coast" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Libya</label>
                <input type="text" defaultValue="Tripoli - North Africa" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
            </div>
          </div>

          {/* Refit Capabilities */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium text-white">Refit Capabilities</p>
              <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Edit</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Yacht Size Range</label>
                <input type="text" defaultValue="20m - 100m" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Specializations</label>
                <textarea rows={2} defaultValue="Luxury yachts, commercial vessels, sailing yachts, motor yachts" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Certifications</label>
                <input type="text" defaultValue="ISO 9001, RINA, Lloyd's Register" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-white">FAQs</p>
            <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Add FAQ</button>
          </div>
          <div className="space-y-3">
            <div className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">What is your typical refit timeline?</p>
              <p className="text-xs text-gray-400">Typical refit projects range from 2-6 months depending on scope and vessel size.</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">Do you offer warranty on refit work?</p>
              <p className="text-xs text-gray-400">Yes, we offer 12-month warranty on all refit work and materials.</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">Can you handle emergency repairs?</p>
              <p className="text-xs text-gray-400">Yes, we have emergency response teams available 24/7 for urgent repairs.</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-white">Contact Information</p>
            <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input type="email" defaultValue="contact@aegeanyacht.com" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone</label>
              <input type="tel" defaultValue="+30 210 123 4567" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">WhatsApp</label>
              <input type="tel" defaultValue="+30 210 123 4567" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">LinkedIn</label>
              <input type="text" defaultValue="linkedin.com/company/aegean-yacht" className="w-full border border-gray-700 bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-600 text-white" />
            </div>
          </div>
        </div>

        {/* AI Response Rules */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-white">AI Response Rules</p>
            <button className="text-xs px-2 py-1 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">Add Rule</button>
          </div>
          <div className="space-y-3">
            <div className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">Always mention Greece location first</p>
              <p className="text-xs text-gray-400">Prioritize Greece shipyard in initial responses</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">Never discuss pricing over email</p>
              <p className="text-xs text-gray-400">Direct pricing discussions to scheduled calls</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-3">
              <p className="text-sm font-medium text-white mb-2">Offer 15-minute consultation</p>
              <p className="text-xs text-gray-400">Always suggest brief call for detailed discussions</p>
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-white">Documents</p>
            <Button 
              variant="primary"
              size="sm"
              onClick={handleUploadDocument}
            >
              Upload Document
            </Button>
          </div>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center border border-gray-700 rounded-lg p-3">
                <div>
                  <p className="text-sm text-white font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.size} · {doc.uploadedAt}</p>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteDocument(doc.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleSave}
            variant="primary"
          >
            Save Changes
          </Button>
        </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
