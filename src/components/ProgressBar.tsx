import { Check } from 'lucide-react';

const steps = ['Personal Details', 'Address & Constituency', 'Documents & Biometrics'];

const ProgressBar = ({ currentStep }: { currentStep: number }) => (
  <div className="bg-card-bg mx-8 mt-6 px-6 py-5 rounded-xl shadow-sm">
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {steps.map((label, i) => {
        const step = i + 1;
        const completed = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all duration-500 ${
                completed ? 'bg-green-success text-white' : active ? 'bg-blue-primary text-white' : 'bg-white border-2 border-border-color text-text-muted'
              }`}>
                {completed ? <Check size={18} /> : step}
              </div>
              <span className={`text-xs font-heading font-medium mt-2 text-center whitespace-nowrap ${
                completed ? 'text-green-success' : active ? 'text-blue-primary font-bold' : 'text-text-muted'
              }`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-3 bg-border-color rounded-full overflow-hidden mt-[-20px]">
                <div className={`h-full rounded-full transition-all duration-500 ${
                  completed ? 'bg-green-success w-full' : 'w-0'
                }`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ProgressBar;
