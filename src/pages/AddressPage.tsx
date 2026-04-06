import { useState } from 'react';
import { MapPin, Info, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { useEnrollment } from '../context/EnrollmentContext';
import { stateDistricts, districtConstituencies, constituencyToParliamentary, constituencyToBoothDefault, indianStates } from '../data/locationData';

const AddressPage = () => {
  const { enrollmentData, setEnrollmentData, setCurrentPage } = useEnrollment();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [pincodeValid, setPincodeValid] = useState(false);

  const d = enrollmentData;
  const update = (field: string, value: string) => setEnrollmentData(prev => ({ ...prev, [field]: value }));

  const districts = stateDistricts[d.state] || [];
  const constituencies = districtConstituencies[d.district] || [];

  const handleStateChange = (val: string) => {
    update('state', val);
    update('district', '');
    update('constituency', '');
    update('parliamentaryConstituency', '');
    update('pollingBooth', '');
  };

  const handleDistrictChange = (val: string) => {
    update('district', val);
    update('constituency', '');
    update('parliamentaryConstituency', '');
    update('pollingBooth', '');
  };

  const handleConstituencyChange = (val: string) => {
    update('constituency', val);
    update('parliamentaryConstituency', constituencyToParliamentary[val] || '');
    update('pollingBooth', constituencyToBoothDefault[val] || `Booth #${Math.floor(Math.random() * 20 + 1)} — Community Center, ${val}`);
  };

  const handlePincodeChange = (val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 6);
    update('pincode', v);
    setPincodeValid(v.length === 6);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!d.houseNo) errs.houseNo = 'Required';
    if (!d.street) errs.street = 'Required';
    if (!d.city) errs.city = 'Required';
    if (!d.pincode || d.pincode.length !== 6) errs.pincode = 'Enter valid 6-digit PIN';
    if (!d.state) errs.state = 'Required';
    if (!d.district) errs.district = 'Select a district';
    if (!d.constituency) errs.constituency = 'Select a constituency';
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { setShake(true); setTimeout(() => setShake(false), 300); return; }
    console.log('enrollmentData (address):', enrollmentData);
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrentPage('documents'); }, 600);
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 text-sm border rounded-md outline-none transition-all duration-200 font-body ${
      errors[field] ? 'border-red-error' : 'border-border-color focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20'
    }`;

  return (
    <Layout>
      <ProgressBar currentStep={2} />
      <div className={`animate-fade-in-up ${shake ? 'animate-shake' : ''}`}>
        <div className="mx-4 md:mx-8 mt-6 mb-4">
          <h1 className="font-heading text-2xl font-bold" style={{ color: '#1a237e' }}>New Voter Registration — Step 2 of 3</h1>
        </div>

        {/* Info Banner */}
        <div className="mx-4 md:mx-8 bg-blue-light border-l-4 border-blue-primary rounded-lg p-4 flex gap-3 items-start">
          <Info className="text-blue-primary flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-blue-primary">In India, your registered address determines your constituency. Voters can only cast their ballot at the polling booth assigned to their residential address.</p>
        </div>

        <div className="mx-4 md:mx-8 mt-4 mb-8 bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-border-color border-l-4 border-l-blue-primary flex items-center gap-2">
            <MapPin size={18} className="text-blue-primary" />
            <span className="font-heading text-base font-semibold" style={{ color: '#1a237e' }}>Part B: Address & Constituency Details</span>
          </div>

          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">House No. / Flat No. <span className="text-red-error">*</span></label>
              <input value={d.houseNo} onChange={e => update('houseNo', e.target.value)} className={inputClass('houseNo')} />
              {errors.houseNo && <p className="text-xs text-red-error mt-1">{errors.houseNo}</p>}
            </div>

            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Street / Area / Mohalla <span className="text-red-error">*</span></label>
              <input value={d.street} onChange={e => update('street', e.target.value)} className={inputClass('street')} />
              {errors.street && <p className="text-xs text-red-error mt-1">{errors.street}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Village / Town / City <span className="text-red-error">*</span></label>
              <input value={d.city} onChange={e => update('city', e.target.value)} className={inputClass('city')} />
              {errors.city && <p className="text-xs text-red-error mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Pincode <span className="text-red-error">*</span></label>
              <div className="relative">
                <input value={d.pincode} onChange={e => handlePincodeChange(e.target.value)} maxLength={6} className={inputClass('pincode')} />
                {pincodeValid && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-success text-xs font-semibold animate-fade-in-up">✅ Valid PIN</span>}
              </div>
              {errors.pincode && <p className="text-xs text-red-error mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">State <span className="text-red-error">*</span></label>
              <select value={d.state} onChange={e => handleStateChange(e.target.value)} className={inputClass('state')}>
                <option value="">Select State</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="text-xs text-red-error mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">District <span className="text-red-error">*</span></label>
              <select value={d.district} onChange={e => handleDistrictChange(e.target.value)} disabled={!d.state} className={inputClass('district')}>
                <option value="">Select District</option>
                {districts.map(dd => <option key={dd} value={dd}>{dd}</option>)}
              </select>
              {errors.district && <p className="text-xs text-red-error mt-1">{errors.district}</p>}
            </div>

            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Assembly Constituency <span className="text-red-error">*</span></label>
              <select value={d.constituency} onChange={e => handleConstituencyChange(e.target.value)} disabled={!d.district} className={inputClass('constituency')}>
                <option value="">Select Constituency</option>
                {constituencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.constituency && <p className="text-xs text-red-error mt-1">{errors.constituency}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Parliamentary Constituency</label>
              <input readOnly value={d.parliamentaryConstituency} placeholder="Auto-assigned based on Assembly Constituency" className="w-full px-3.5 py-2.5 text-sm border border-border-color rounded-md bg-gray-50 text-text-muted font-body" />
              <p className="text-xs text-text-muted mt-1">Auto-assigned based on Assembly Constituency</p>
            </div>

            <div className="md:col-span-2">
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Assigned Polling Booth</label>
              <input readOnly value={d.pollingBooth} placeholder="Auto-assigned" className="w-full px-3.5 py-2.5 text-sm border border-border-color rounded-md bg-gray-50 text-text-muted font-body" />
              <p className="text-xs text-text-muted mt-1">Polling booth is automatically assigned based on your registered address</p>
            </div>
          </div>

          <div className="px-6 pb-6 flex justify-between">
            <button onClick={() => setCurrentPage('personal')} className="bg-white border border-blue-primary text-blue-primary font-heading font-semibold rounded-md px-6 py-2.5 hover:bg-blue-light transition-all duration-200">← Back</button>
            <button onClick={handleNext} disabled={loading} className={`font-heading font-bold rounded-md px-6 py-2.5 transition-all duration-200 ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-primary hover:bg-blue-dark text-white hover:-translate-y-0.5 hover:shadow-md'}`}>
              {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} />Processing...</span> : 'Save & Next →'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddressPage;
