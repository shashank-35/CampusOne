import { useState, useEffect } from 'react';
import { QrCode, Download, RefreshCw, ExternalLink } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function QRCodePage() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQR = async () => {
    setLoading(true);
    try {
      const res = await api.get('/qr/inquiry-form');
      setQrData(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQR(); }, []);

  const downloadQR = () => {
    if (!qrData?.qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrData.qrDataUrl;
    link.download = 'campusone-inquiry-qr.png';
    link.click();
    toast.success('QR code downloaded!');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiry QR Code</h1>
        <p className="text-gray-500 text-sm mt-1">
          Share this QR code with prospective students. When scanned, it opens the inquiry form.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col items-center gap-6">
        {loading ? (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800" />
          </div>
        ) : qrData ? (
          <>
            <div className="p-4 bg-white border-2 border-slate-200 rounded-xl shadow-inner">
              <img src={qrData.qrDataUrl} alt="Inquiry QR Code" className="w-64 h-64" />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Inquiry Form URL:</p>
              <a
                href={qrData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm flex items-center gap-1 justify-center"
              >
                {qrData.url} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download QR
              </button>
              <button
                onClick={fetchQR}
                className="flex items-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Failed to load QR code</p>
            <button
              onClick={fetchQR}
              className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <QrCode className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">How to use</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1 list-disc list-inside">
              <li>Print and display this QR code at your institute</li>
              <li>Students scan it with their phone camera</li>
              <li>They are taken directly to the inquiry form</li>
              <li>Submissions are automatically tracked as QR inquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
