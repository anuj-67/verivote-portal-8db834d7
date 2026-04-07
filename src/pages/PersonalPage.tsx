import { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { useEnrollment } from '../context/EnrollmentContext';

const PersonalPage = () => {
  const { enrollmentData, setEnrollmentData, setCurrentPage } = useEnrollment();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const d = enrollmentData;
  const update = (field: string, value: string | number | null) => setEnrollmentData(prev => ({ ...prev, [field]: value }));

  const calcAge = (dob: string) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleDobChange = (val: string) => {
    update('dob', val);
    const age = calcAge(val);
    update('age', age);
    if (age !== null && age < 18) setErrors(p => ({ ...p, dob: 'Voter must be 18 or older' }));
    else setErrors(p => ({ ...p, dob: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!d.fullName || d.fullName.length < 3) errs.fullName = 'Full name must be at least 3 characters';
    if (!d.dob) errs.dob = 'Date of birth is required';
    else if (d.age !== null && d.age < 18) errs.dob = 'Voter must be 18 or older';
    if (!d.gender) errs.gender = 'Gender is required';
    if (!d.relativeName) errs.relativeName = 'This field is required';
    if (!d.relationType) errs.relationType = 'Select a relation';
    if (!d.mobile || !/^[6-9]\d{9}$/.test(d.mobile)) errs.mobile = 'Enter valid 10-digit mobile number';
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    console.log('enrollmentData (personal):', enrollmentData);
    setLoading(true);
    setTimeout(() => { setLoading(false); setCurrentPage('address'); }, 600);
  };

  const genders = [
    { value: 'Male', emoji: '👨' },
    { value: 'Female', emoji: '👩' },
    { value: 'Transgender / Other', emoji: '⚧' },
  ];

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 text-sm border rounded-md outline-none transition-all duration-200 font-body ${
      errors[field] ? 'border-red-error focus:ring-2 focus:ring-red-error/20' : 'border-border-color focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20'
    }`;

  return (
    <Layout>
      <ProgressBar currentStep={1} />
      <div className={`animate-fade-in-up ${shake ? 'animate-shake' : ''}`}>
        <div className="mx-4 md:mx-8 mt-6 mb-4">
          <h1 className="font-heading text-2xl font-bold" style={{ color: '#0B2E33' }}>New Voter Registration — Step 1 of 3</h1>
          <p className="text-sm text-text-muted mt-1">Fill in the voter's personal details exactly as they appear on the Aadhaar card</p>
        </div>

        <div className="mx-4 md:mx-8 mb-8 bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 bg-gray-50 border-b border-border-color border-l-4 border-l-blue-primary flex items-center gap-2">
            <User size={18} className="text-blue-primary" />
            <span className="font-heading text-base font-semibold" style={{ color: '#0B2E33' }}>Part A: Personal Identity</span>
          </div>

          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Full Name <span className="text-red-error">*</span></label>
              <input value={d.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Exactly as printed on Aadhaar card" className={inputClass('fullName')} />
              <p className="text-xs text-text-muted mt-1">Do not use initials — write full name as on Aadhaar</p>
              {errors.fullName && <p className="text-xs text-red-error mt-1">{errors.fullName}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Date of Birth <span className="text-red-error">*</span></label>
              <input type="date" value={d.dob} max={new Date().toISOString().split('T')[0]} onChange={e => handleDobChange(e.target.value)} className={inputClass('dob')} />
              {errors.dob && <p className="text-xs text-red-error mt-1">{errors.dob}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Age</label>
              <div className="relative">
                <input readOnly value={d.age !== null ? `${d.age} years` : ''} placeholder="Auto-calculated" className="w-full px-3.5 py-2.5 text-sm border border-border-color rounded-md bg-gray-50 text-text-muted font-body" />
                {d.age !== null && d.age >= 18 && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-success">✅</span>}
              </div>
            </div>

            {/* Gender */}
            <div className="md:col-span-2">
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Gender <span className="text-red-error">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                {genders.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => update('gender', g.value)}
                    className={`py-2.5 rounded-lg text-sm font-body transition-all border ${
                      d.gender === g.value ? 'bg-blue-primary text-white border-blue-primary' : 'bg-white border-border-color text-text-primary hover:bg-blue-light hover:border-blue-primary'
                    }`}
                  >
                    {g.emoji} {g.value}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-xs text-red-error mt-1">{errors.gender}</p>}
            </div>

            {/* Relative Name */}
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Father's / Husband's Name <span className="text-red-error">*</span></label>
              <input value={d.relativeName} onChange={e => update('relativeName', e.target.value)} className={inputClass('relativeName')} />
              {errors.relativeName && <p className="text-xs text-red-error mt-1">{errors.relativeName}</p>}
            </div>

            {/* Relation Type */}
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Relation <span className="text-red-error">*</span></label>
              <select value={d.relationType} onChange={e => update('relationType', e.target.value)} className={inputClass('relationType')}>
                <option value="">Select</option>
                {['Father', 'Mother', 'Husband', 'Guardian'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.relationType && <p className="text-xs text-red-error mt-1">{errors.relationType}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Mobile Number <span className="text-red-error">*</span></label>
              <div className="flex">
                <div className="flex items-center px-3 bg-white border border-r-0 border-border-color rounded-l-md text-sm text-text-muted">+91</div>
                <input
                  type="tel" maxLength={10} value={d.mobile}
                  onChange={e => { const v = e.target.value.replace(/\D/g, ''); update('mobile', v); }}
                  className={`flex-1 px-3.5 py-2.5 text-sm border rounded-r-md rounded-l-none outline-none transition-all duration-200 font-body ${
                    errors.mobile ? 'border-red-error' : 'border-border-color focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20'
                  }`}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">OTP alerts will be sent to this number</p>
              {errors.mobile && <p className="text-xs text-red-error mt-1">{errors.mobile}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="font-heading font-semibold text-sm text-text-primary mb-1 block">Email Address</label>
              <input type="email" value={d.email} onChange={e => update('email', e.target.value)} placeholder="Optional — for e-EPIC card delivery" className={inputClass('email')} />
            </div>
          </div>

          <div className="px-6 pb-6 flex justify-between">
            <button onClick={() => setCurrentPage('dashboard')} className="bg-white border border-blue-primary text-blue-primary font-heading font-semibold rounded-md px-6 py-2.5 hover:bg-blue-light transition-all duration-200">
              ← Back to Dashboard
            </button>
            <button onClick={handleNext} disabled={loading} className={`font-heading font-bold rounded-md px-6 py-2.5 transition-all duration-200 ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-primary hover:bg-blue-dark text-white hover:-translate-y-0.5 hover:shadow-md'}`}>
              {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} />Processing...</span> : 'Save & Next →'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PersonalPage;
