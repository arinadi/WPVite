import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { Rocket, ArrowRight, Globe } from 'lucide-react';

export function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    siteTitle: '',
    tagline: '',
  });

  const setupMutation = useMutation({
    mutationFn: (data: typeof formData) => api.post('/api/setup', data),
    onSuccess: () => {
      toast.success('Site setup complete!');
      navigate('/admin');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleNext = () => {
    if (step === 1 && !formData.siteTitle) {
      toast.error('Please enter a site title');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    setupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-blue-600 p-8 md:w-1/3 text-white flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg mb-6">W</div>
            <h2 className="text-xl font-bold mb-2">Setup Wizard</h2>
            <p className="text-blue-100 text-sm">Let's get your new site ready for launch.</p>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-white' : 'text-blue-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-white text-blue-600' : 'bg-blue-500/50'}`}>1</div>
              <span className="text-sm font-medium">Site Identity</span>
            </div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-white' : 'text-blue-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-white text-blue-600' : 'bg-blue-500/50'}`}>2</div>
              <span className="text-sm font-medium">Review & Launch</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:w-2/3">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Name your site</h3>
                <p className="text-gray-500 text-sm">You can change this anytime in settings.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                  <input
                    type="text"
                    value={formData.siteTitle}
                    onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. My Awesome Blog"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Just another WPVite site"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ready to launch?</h3>
                <p className="text-gray-500 text-sm">Here is a summary of your new site.</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Title</p>
                    <p className="font-medium text-gray-900">{formData.siteTitle}</p>
                  </div>
                </div>
                {formData.tagline && (
                  <div className="flex items-center gap-3">
                    <div className="w-5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Tagline</p>
                      <p className="font-medium text-gray-900">{formData.tagline}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={setupMutation.isPending}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {setupMutation.isPending ? 'Launching...' : 'Launch Site'} 
                  {!setupMutation.isPending && <Rocket className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
