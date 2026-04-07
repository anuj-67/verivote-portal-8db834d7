import { useState, useRef } from 'react';
import { FileText, Lock, FileUp, CheckCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import FingerprintSVG from '../components/FingerprintSVG';
import { useEnrollment } from '../context/EnrollmentContext';

const DocumentsPage = () => {
  const { enrollmentData, setEnrollmentData, setCurrentPage, dashboardStats, setDashboardStats } = useEnrollment();
  const [loading, setLoading] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState(enrollmentData.aadhaarFormatted);
  const [hashState, setHashState] = useState<'idle' | 'hashing' | 'done'>(enrollmentData.aadhaarHashed ? 'done' : 'idle');
  const [fpState, setFpState] = useState<0 | 1 | 2 | 3>(enrollmentData.fingerprintCaptured ? 2 : 0);
  const [quality, setQuality] = useState(enrollmentData.fingerprintQuality);
  const [photoFile, setPhotoFile] = useState<string>('');
  const [aadhaarDocFile, setAadhaarDocFile] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const photoRef = useRef<HTMLInputElement>(null);
  const aadhaarDocRef = useRef<HTMLInputElement>(null);
  const fpFileRef = useRef<HTMLInputElement>(null);

  const d = enrollmentData;
  const update = (field: string, value: any) => setEnrollmentData(prev => ({ ...prev, [field]: value }));

  const formatAadhaar = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 12);
    const parts = [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8, 12)].filter(Boolean);
    return parts.join('-');
  };

  const handleAadhaarChange = (val: string) => {
    const formatted = formatAadhaar(val);
    setAadhaarInput(formatted);
    update('aadhaarFormatted', formatted);
    if (hashState === 'done') { setHashState('idle'); update('aadhaarHashed', false); }
  };

  const handleAadhaarBlur = () => {
    const digits = aadhaarInput.replace(/\D/g, '');
    if (digits.length === 12) {
      setHashState('hashing');
      setTimeout(() => { setHashState('done'); update('aadhaarHashed', true); }, 1200);
    }
  };

  const handleCapture = () => {
    setFpState(1); setQuality(0);
    setTimeout(() => {
      let q = 0;
      const interval = setInterval(() => {
        q += 3;
        if (q >= 91) { setQuality(91); clearInterval(interval); setTimeout(() => { setFpState(2); update('fingerprintCaptured', true); update('fingerprintQuality', 91); }, 800); }
        else setQuality(q);
      }, 30);
    }, 500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoFile(file.name); setPhotoPreview(URL.createObjectURL(file)); update('photoUploaded', true); }
  };

  const handleAadhaarDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setAadhaarDocFile(file.name); update('aadhaarDocUploaded', true); }
  };

  const canSubmit = d.declarationChecked && d.fingerprintCaptured && d.aadhaarHashed;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setDashboardStats(prev => ({ ...prev, enrollmentsToday: prev.enrollmentsToday + 1 }));
      setLoading(false);
      setCurrentPage('success');
    }, 2500);
  };

  const fpBorderColor = fpState === 1 ? 'border-blue-primary' : fpState === 2 ? 'border-green-success' : fpState === 3 ? 'border-saffron' : 'border-border-color';
  const fpColor = fpState === 1 ? '#4F7C82' : fpState === 2 ? '#2e7d32' : fpState === 3 ? '#93B1B5' : '#9ca3af';
  const qualityLabel = quality <= 40 ? 'Poor' : quality <= 70 ? 'Good' : 'Excellent';
  const qualityColor = quality <= 40 ? 'text-red-error' : quality <= 70 ? 'text-saffron' : 'text-green-success';
  const barColor = quality <= 40 ? 'bg-red-500' : quality <= 70 ? 'bg-orange-500' : 'bg-green-500';

  const checklistItem = (label: string, done: boolean, doneText: string) => (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-xs text-text-primary">{label}</span>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-text-muted'}`}>
        {done ? `✅ ${doneText}` : '⚪ Pending'}
      </span>
    </div>
  );

  return (
    <Layout>
      <ProgressBar currentStep={3} />
      <div className="animate-fade-in-up">
        <div className="mx-4 md:mx-8 mt-6 mb-4">
          <h1 className="font-heading text-2xl font-bold" style={{ color: '#0B2E33' }}>New Voter Registration — Step 3 of 3</h1>
        </div>

        <div className="mx-4 md:mx-8 mt-4 mb-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 bg-gray-50 border-b border-border-color border-l-4 border-l-blue-primary flex items-center gap-2">
                <FileText size={18} className="text-blue-primary" />
                <span className="font-heading text-base font-semibold" style={{ color: '#0B2E33' }}>Part D: Identity Documents</span>
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* Aadhaar */}
                <div>
                  <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Aadhaar Number <span className="text-red-error">*</span></label>
                  <div className="relative">
                    <input
                      value={aadhaarInput}
                      onChange={e => handleAadhaarChange(e.target.value)}
                      onBlur={handleAadhaarBlur}
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength={14}
                      className="w-full px-3.5 py-2.5 text-sm border border-border-color rounded-md outline-none transition-all duration-200 font-body focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20"
                    />
                    {hashState === 'hashing' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-primary flex items-center gap-1"><Loader2 className="animate-spin" size={14} />🔒 Securing...</span>}
                    {hashState === 'done' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-success animate-fade-in-up">✅ Hashed & Secured</span>}
                  </div>
                  {aadhaarInput.replace(/\D/g, '').length > 0 && aadhaarInput.replace(/\D/g, '').length < 12 && hashState !== 'hashing' && (
                    <p className="text-xs text-red-error mt-1">Aadhaar must be 12 digits</p>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-50 border border-border-color rounded-lg p-3 flex gap-2 items-start">
                  <Lock className="text-text-muted flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-text-muted">Privacy Notice: Your Aadhaar number is converted to an irreversible SHA-256 hash on this device. The raw number is never transmitted or stored by VeriVote systems.</p>
                </div>

                {/* Aadhaar Upload */}
                <div>
                  <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Upload Aadhaar Card <span className="text-red-error">*</span></label>
                  <input type="file" ref={aadhaarDocRef} accept=".jpg,.jpeg,.png" className="hidden" onChange={handleAadhaarDocUpload} />
                  {!aadhaarDocFile ? (
                    <div onClick={() => aadhaarDocRef.current?.click()} className="border-2 border-dashed border-border-color rounded-xl p-6 text-center cursor-pointer hover:border-blue-primary hover:bg-blue-light transition-all">
                      <FileUp className="mx-auto text-text-muted mb-2" size={24} />
                      <p className="text-sm text-text-primary">Click to upload or drag & drop</p>
                      <p className="text-xs text-text-muted">JPG, PNG — max 5MB</p>
                    </div>
                  ) : (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="text-green-success" size={20} />
                      <span className="text-sm text-text-primary">{aadhaarDocFile}</span>
                      <span className="ml-auto text-xs text-green-success font-semibold">✅ Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Passport Photo <span className="text-red-error">*</span></label>
                  <input type="file" ref={photoRef} accept=".jpg,.jpeg,.png" className="hidden" onChange={handlePhotoUpload} />
                  {!photoFile ? (
                    <div onClick={() => photoRef.current?.click()} className="border-2 border-dashed border-border-color rounded-xl p-6 text-center cursor-pointer hover:border-blue-primary hover:bg-blue-light transition-all">
                      <FileUp className="mx-auto text-text-muted mb-2" size={24} />
                      <p className="text-sm text-text-primary">Click to upload passport photo</p>
                      <p className="text-xs text-text-muted">JPG, PNG — max 5MB</p>
                    </div>
                  ) : (
                    <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center gap-3">
                      {photoPreview && <img src={photoPreview} alt="Photo" className="w-16 h-16 rounded-md object-cover" />}
                      <span className="text-sm text-text-primary">{photoFile}</span>
                      <span className="ml-auto text-xs text-green-success font-semibold">✅ Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Declaration */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-4">
                  <p className="font-heading font-bold text-sm text-amber-800 mb-3">📋 Enrollment Officer Declaration</p>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={d.declarationChecked}
                      onChange={e => update('declarationChecked', e.target.checked)}
                      className="mt-1 w-[18px] h-[18px] accent-blue-primary"
                    />
                    <span className="text-sm text-amber-900">
                      I, the undersigned Enrollment Officer, hereby certify that:
                      <br />• I have verified the voter's identity documents in person
                      <br />• The voter is an Indian citizen above 18 years of age
                      <br />• All information entered is accurate to the best of my knowledge
                      <br />• The biometric data belongs to the voter present before me
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Biometric */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-4">
              <h3 className="font-heading font-bold text-base flex items-center gap-2 mb-1" style={{ color: '#0B2E33' }}>
                <span>🖐</span> Part E: Biometric
              </h3>
              <p className="text-sm text-text-muted mb-4">Ask the voter to place their RIGHT index finger flat and still on the MFS100 scanner below.</p>

              {/* Fingerprint Box */}
              <div className={`mx-auto w-[140px] h-[140px] border-2 rounded-2xl flex items-center justify-center transition-all duration-500 ${fpBorderColor} ${fpState === 1 ? 'animate-pulse-glow' : ''}`}
                style={{ backgroundColor: fpState === 0 ? '#f9fafb' : 'transparent' }}>
                <FingerprintSVG color={fpColor} size={80} />
              </div>
              {fpState === 1 && <p className="text-center text-sm text-blue-primary mt-2 font-semibold">Scanning...</p>}
              {fpState === 2 && <p className="text-center text-sm text-green-success mt-2 font-semibold">✅ Captured</p>}

              {/* Quality */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-heading font-semibold">
                  <span>Capture Quality</span>
                  <span className={qualityColor}>{fpState > 0 ? qualityLabel : '—'}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${quality}%` }} />
                </div>
                {fpState > 0 && <p className="text-xs text-right mt-1 text-text-muted">{quality}%</p>}
              </div>

              {/* Buttons */}
              <button onClick={handleCapture} disabled={fpState === 1} className={`w-full mt-4 font-heading font-bold rounded-md px-4 py-2.5 text-sm transition-all duration-200 ${
                fpState === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-primary hover:bg-blue-dark text-white'
              }`}>
                {fpState === 1 ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={16} />Scanning...</span> : '🖐 Capture Fingerprint (MFS100)'}
              </button>

              <input type="file" ref={fpFileRef} accept=".bmp,.png,.wsq" className="hidden" onChange={() => { setFpState(2); setQuality(91); update('fingerprintCaptured', true); update('fingerprintQuality', 91); }} />
              <button onClick={() => fpFileRef.current?.click()} className="w-full mt-2 bg-white border border-blue-primary text-blue-primary font-heading font-semibold rounded-md px-4 py-2 text-sm hover:bg-blue-light transition-all">
                📁 Upload Fingerprint File (Testing Only)
              </button>

              {d.fingerprintCaptured && (
                <button onClick={() => { setFpState(0); setQuality(0); update('fingerprintCaptured', false); update('fingerprintQuality', 0); }}
                  className="w-full text-center mt-2 text-xs text-text-muted hover:underline">
                  🔄 Retry Capture
                </button>
              )}

              {/* Checklist */}
              <div className="mt-6 pt-4 border-t border-border-color">
                <p className="text-xs font-heading font-bold uppercase tracking-wide text-text-muted mb-3">Capture Checklist</p>
                {checklistItem('🔒 Aadhaar Hash', d.aadhaarHashed, 'Secured')}
                {checklistItem('📷 Passport Photo', d.photoUploaded, 'Uploaded')}
                {checklistItem('🖐 Fingerprint', d.fingerprintCaptured, 'Captured')}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mx-4 md:mx-8 mb-8 flex gap-4">
          <button onClick={() => setCurrentPage('address')} className="bg-white border border-blue-primary text-blue-primary font-heading font-semibold rounded-md px-6 py-2.5 hover:bg-blue-light transition-all">← Back</button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className={`flex-1 font-heading font-bold rounded-md px-6 py-2.5 transition-all duration-200 ${
              !canSubmit || loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-primary hover:bg-blue-dark text-white hover:-translate-y-0.5 hover:shadow-md'
            }`}
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} />Submitting enrollment...</span>
              : canSubmit ? 'Submit Enrollment →' : 'Complete all fields above to submit'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentsPage;
