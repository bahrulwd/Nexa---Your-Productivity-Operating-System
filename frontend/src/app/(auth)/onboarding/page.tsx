import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Goal = 'deadline' | 'burnout' | 'priority';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<Goal>('deadline');
  const [selectedCapacity, setSelectedCapacity] = useState<number>(8);
  const [selectedDays, setSelectedDays] = useState<string[]>(['M-0', 'T-1', 'W-2', 'T-3', 'F-4']);
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number>(0);
  const [roleInput, setRoleInput] = useState<string>('Tech Developer');

  const handleSkipOrComplete = () => {
    localStorage.setItem('nexa_onboarding_completed', 'true');
    localStorage.setItem('nexa_user_goal', selectedGoal);

    // Save daily limit & active days & role in nexa_settings
    const settings = {
      role: roleInput || 'Founder / General',
      dailyLimit: selectedCapacity,
      activeDays: selectedDays,
      alertsEnabled: true,
      hideCompleted: false
    };
    localStorage.setItem('nexa_settings', JSON.stringify(settings));

    // Get current local user if exists to preserve other properties
    const localUserStr = localStorage.getItem('nexa_user');
    let localUserObj: any = {};
    if (localUserStr) {
      try {
        localUserObj = JSON.parse(localUserStr);
      } catch { }
    }
    const updatedUser = {
      ...localUserObj,
      avatarUrl: `preset:avatar-${selectedAvatarIndex + 1}`
    };
    localStorage.setItem('nexa_user', JSON.stringify(updatedUser));

    // Dispatch settings updated event
    window.dispatchEvent(new Event('nexa_settings_updated'));

    navigate('/');
  };

  const nextStep = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    } else {
      handleSkipOrComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  const DAYS = [
    { label: 'M', index: 0 },
    { label: 'T', index: 1 },
    { label: 'W', index: 2 },
    { label: 'T', index: 3 },
    { label: 'F', index: 4 },
    { label: 'S', index: 5 },
    { label: 'S', index: 6 },
  ];

  const decrementFocus = () => {
    if (selectedCapacity > 1) {
      setSelectedCapacity(prev => prev - 1);
    }
  };

  const incrementFocus = () => {
    if (selectedCapacity < 24) {
      setSelectedCapacity(prev => prev + 1);
    }
  };

  const handleDayToggle = (dayLabel: string, index: number) => {
    const key = `${dayLabel}-${index}`;
    if (selectedDays.includes(key)) {
      setSelectedDays(prev => prev.filter(d => d !== key));
    } else {
      setSelectedDays(prev => [...prev, key]);
    }
  };

  // Dynamic aside content
  let asideTitle = '';
  let asideDesc = '';
  if (step === 1) {
    asideTitle = 'Kuasai waktu Anda. Bukan sebaliknya.';
    asideDesc = 'Bergabunglah dengan profesional yang bekerja lebih cerdas dengan Smart Priority System.';
  } else if (step === 2) {
    asideTitle = 'Atur Ritme Fokus Anda.';
    asideDesc = 'Mencegah burnout harian dengan menetapkan kapasitas batas kerja yang ideal.';
  } else {
    asideTitle = 'Personalisasikan Profil Anda.';
    asideDesc = 'Identitas unik Anda membantu menyesuaikan visual workspace dan grafik kemajuan.';
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9] flex items-center justify-center p-4 md:p-8 antialiased select-none relative overflow-hidden font-sans">
      {/* Aurora Background Elements */}
      <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#6C5DD3]/10 rounded-full blur-[130px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF75A0]/8 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" />

      {/* Main split bento container */}
      <main className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row border border-[#F3F4F6]/80 min-h-[500px] md:min-h-[550px] z-10">
        
        {/* Left Side: Branding & Glassmorphic Shapes (40%) */}
        <aside className="relative flex flex-col w-full md:w-[40%] bg-[#2A2753] overflow-hidden p-8 md:p-12 text-white justify-between">
          {/* Glassmorphic Decorative Shapes */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 backdrop-blur-[10px] border border-white/10 rounded-full opacity-20 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-full opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 backdrop-blur-[10px] border border-white/10 rotate-45 opacity-15 pointer-events-none" />

          {/* Logo */}
          <nav className="relative z-10">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="/images/LogoPanjang.png"
                alt="Nexa Logo"
                className="h-7 object-contain hover:brightness-110 hover:scale-[1.02] transition-all duration-300"
              />
            </div>
          </nav>

          {/* Taglines */}
          <div className="relative z-10 flex-grow flex flex-col justify-center my-8 md:my-0">
            <h1 className="font-display font-black text-2xl md:text-3xl text-white mb-4 leading-tight">
              {asideTitle.split('. ')[0]}. <br />
              <span className="text-[#fec886]">{asideTitle.split('. ')[1]}</span>
            </h1>
            <p className="font-sans text-[13px] text-white/70 leading-relaxed font-semibold">
              {asideDesc}
            </p>
          </div>

          {/* Footer Progress */}
          <div className="relative z-10 pt-6 border-t border-white/10 select-none">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
                Step {step} of 3
              </span>
              <div className="flex gap-2">
                <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-white' : 'bg-white/20'}`} />
                <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-white' : 'bg-white/20'}`} />
                <div className={`h-1.5 w-16 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-white' : 'bg-white/20'}`} />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Interactive Content (60%) */}
        <section className="flex-grow w-full md:w-[60%] bg-white flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[440px] flex flex-col gap-6 justify-between h-full">
            
            {step === 1 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* Header */}
                <header className="text-left select-none">
                  <h2 className="font-display font-black text-[22px] md:text-[24px] leading-tight text-[#2A2753] mb-2">
                    Apa target utama Anda bersama Nexa?
                  </h2>
                  <p className="text-xs md:text-sm font-semibold text-[#9CA3AF]">
                    Pilih satu fokus agar kami dapat menyesuaikan algoritma prioritas untuk Anda.
                  </p>
                </header>

                {/* Cards Stack */}
                <div className="flex flex-col gap-3">
                  {/* Card 1: burnout */}
                  <button 
                    onClick={() => setSelectedGoal('burnout')}
                    className={`group flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:border-[#7C3AED] hover:shadow-sm active:scale-[0.98] cursor-pointer ${
                      selectedGoal === 'burnout'
                        ? 'bg-[#7C3AED]/5 border-2 border-[#7C3AED] shadow-sm'
                        : 'bg-white border border-[#c8c5d0]'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedGoal === 'burnout' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'bg-[#F8F9FB] text-[#7C3AED]'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: selectedGoal === 'burnout' ? "'FILL' 1" : "'FILL' 0" }}>
                        rocket_launch
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-display font-bold text-sm text-[#2A2753]">Meningkatkan Fokus &amp; Flow</h3>
                      <p className="text-[11px] text-[#9CA3AF] font-semibold leading-relaxed">Minimalkan distraksi dan kelola notifikasi pintar.</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedGoal === 'burnout' ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-[#c8c5d0]'
                    }`}>
                      {selectedGoal === 'burnout' ? (
                        <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#7C3AED] opacity-0" />
                      )}
                    </div>
                  </button>

                  {/* Card 2: deadline */}
                  <button 
                    onClick={() => setSelectedGoal('deadline')}
                    className={`group flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:border-[#7C3AED] hover:shadow-sm active:scale-[0.98] cursor-pointer ${
                      selectedGoal === 'deadline'
                        ? 'bg-[#7C3AED]/5 border-2 border-[#7C3AED] shadow-sm'
                        : 'bg-white border border-[#c8c5d0]'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedGoal === 'deadline' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'bg-[#F8F9FB] text-[#7C3AED]'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: selectedGoal === 'deadline' ? "'FILL' 1" : "'FILL' 0" }}>
                        schedule
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-display font-bold text-sm text-[#2A2753]">Menyelesaikan Tugas Tepat Waktu</h3>
                      <p className="text-[11px] text-[#9CA3AF] font-semibold leading-relaxed">Sistem peringatan dini untuk deadline kritis.</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedGoal === 'deadline' ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-[#c8c5d0]'
                    }`}>
                      {selectedGoal === 'deadline' ? (
                        <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#7C3AED] opacity-0" />
                      )}
                    </div>
                  </button>

                  {/* Card 3: priority */}
                  <button 
                    onClick={() => setSelectedGoal('priority')}
                    className={`group flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:border-[#7C3AED] hover:shadow-sm active:scale-[0.98] cursor-pointer ${
                      selectedGoal === 'priority'
                        ? 'bg-[#7C3AED]/5 border-2 border-[#7C3AED] shadow-sm'
                        : 'bg-white border border-[#c8c5d0]'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedGoal === 'priority' ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'bg-[#F8F9FB] text-[#7C3AED]'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: selectedGoal === 'priority' ? "'FILL' 1" : "'FILL' 0" }}>
                        groups
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-display font-bold text-sm text-[#2A2753]">Menyusun Prioritas Lebih Baik</h3>
                      <p className="text-[11px] text-[#9CA3AF] font-semibold leading-relaxed">Biarkan sistem yang mengurutkan task Anda secara cerdas.</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedGoal === 'priority' ? 'border-[#7C3AED] bg-[#7C3AED]' : 'border-[#c8c5d0]'
                    }`}>
                      {selectedGoal === 'priority' ? (
                        <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#7C3AED] opacity-0" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#F3F4F6]">
                  <button 
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6C5DD3] text-white py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 hover:translate-y-[-1px] active:translate-y-0 shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
                  >
                    <span>Lanjutkan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <button 
                    onClick={handleSkipOrComplete}
                    className="w-full mt-3 text-[#9CA3AF] font-bold text-[11px] text-center hover:text-[#2A2753] transition-colors cursor-pointer"
                  >
                    Lewati untuk sekarang
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-6 animate-fade-in justify-between h-full">
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <header className="text-left select-none">
                    <h2 className="font-display font-black text-[22px] md:text-[24px] leading-tight text-[#2A2753] mb-2">
                      Atur Kapasitas Fokus Anda
                    </h2>
                    <p className="text-xs md:text-sm font-semibold text-[#9CA3AF]">
                      Tentukan batas beban kerja ideal Anda per hari dan hari kerja aktif.
                    </p>
                  </header>

                  {/* Hours Picker Card */}
                  <div className="p-4 bg-white border border-[#c8c5d0] rounded-2xl flex flex-col items-center select-none">
                    <span className="text-[10px] font-extrabold text-[#2A2753]/60 uppercase tracking-widest mb-3">
                      Target Jam Fokus Harian
                    </span>
                    <div className="flex items-center justify-between w-full max-w-[280px]">
                      <button 
                        onClick={decrementFocus}
                        className="w-10 h-10 flex items-center justify-center border border-[#2A2753]/15 text-[#2A2753] rounded-full hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] hover:border-[#7C3AED]/30 transition-all active:scale-90 cursor-pointer shadow-sm bg-white"
                      >
                        <span className="material-symbols-outlined font-bold">remove</span>
                      </button>
                      <div className="flex flex-col items-center">
                        <span className="text-[44px] leading-none font-black text-[#7C3AED] tabular-nums">
                          {selectedCapacity}
                        </span>
                        <span className="text-[9px] font-extrabold text-[#7C3AED] uppercase tracking-wider mt-1">Jam / Hari</span>
                      </div>
                      <button 
                        onClick={incrementFocus}
                        className="w-10 h-10 flex items-center justify-center border border-[#2A2753]/15 text-[#2A2753] rounded-full hover:bg-[#7C3AED]/10 hover:text-[#7C3AED] hover:border-[#7C3AED]/30 transition-all active:scale-90 cursor-pointer shadow-sm bg-white"
                      >
                        <span className="material-symbols-outlined font-bold">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Days Picker Card */}
                  <div className="p-4 bg-white border border-[#c8c5d0] rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-[#2A2753]/60 uppercase tracking-widest mb-3">
                      Hari Kerja Aktif
                    </span>
                    <div className="flex justify-between w-full gap-1.5">
                      {DAYS.map((day) => {
                        const dayKey = `${day.label}-${day.index}`;
                        const active = selectedDays.includes(dayKey);
                        return (
                          <button
                            key={dayKey}
                            onClick={() => handleDayToggle(day.label, day.index)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-xs transition-all cursor-pointer ${
                              active 
                                ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20 active:scale-95' 
                                : 'bg-[#F8F9FB] border border-[#2A2753]/10 text-[#2A2753]/70 hover:bg-[#7C3AED]/5 hover:border-[#7C3AED]/30 active:scale-95'
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#F3F4F6] flex gap-4 items-center">
                  <button 
                    onClick={prevStep}
                    className="w-1/3 border border-[#c8c5d0] text-[#2A2753]/70 py-3 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Kembali</span>
                  </button>
                  <button 
                    onClick={nextStep}
                    className="w-2/3 bg-gradient-to-r from-[#7C3AED] to-[#6C5DD3] text-white py-3 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 hover:translate-y-[-1px] active:translate-y-0 shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
                  >
                    <span>Lanjutkan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-6 animate-fade-in justify-between h-full">
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <header className="text-left select-none">
                    <h2 className="font-display font-black text-[22px] md:text-[24px] leading-tight text-[#2A2753] mb-2">
                      Sentuhan Terakhir...
                    </h2>
                    <p className="text-xs md:text-sm font-semibold text-[#9CA3AF]">
                      Pilih avatar dan isi peran Anda untuk mempersonalisasi workspace.
                    </p>
                  </header>

                  {/* Avatar Picker Card */}
                  <div className="p-4 bg-white border border-[#c8c5d0] rounded-2xl select-none">
                    <span className="text-[10px] font-extrabold text-[#2A2753]/60 uppercase tracking-widest mb-3 block text-center">
                      PILIH AVATAR ANDA
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        '/images/AvatarNexa/avatar1.png',
                        '/images/AvatarNexa/avatar2.png',
                        '/images/AvatarNexa/avatar3.png',
                        '/images/AvatarNexa/avatar4.png',
                        '/images/AvatarNexa/avatar5.png',
                        '/images/AvatarNexa/avatar6.png',
                        '/images/AvatarNexa/avatar7.png',
                        '/images/AvatarNexa/avatar8.png',
                      ].map((path, idx) => {
                        const isSelected = selectedAvatarIndex === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedAvatarIndex(idx)}
                            className="flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 relative"
                          >
                            <div 
                              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-gradient-to-tr from-[#7C3AED] to-[#FF75A0] p-[2px] shadow-md shadow-[#7C3AED]/20 scale-105' 
                                  : 'p-0'
                              }`}
                            >
                              <div 
                                className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 bg-[#F8F9FB] ${
                                  isSelected ? 'border-2 border-white' : 'border border-[#2A2753]/15'
                                }`}
                              >
                                <img
                                  src={path}
                                  alt={`Avatar Option ${idx + 1}`}
                                  className="w-full h-full object-cover select-none"
                                />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role selection dropdown */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-extrabold text-[#2A2753]/60 uppercase tracking-widest" htmlFor="role-select">
                      Peran / Pekerjaan Utama
                    </label>
                    <select 
                      id="role-select"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F8F9FB] text-sm font-semibold rounded-xl border border-[#c8c5d0] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 outline-none transition-all text-[#2A2753]"
                    >
                      <option value="Tech Developer">Developer / Programmer / IT</option>
                      <option value="Creative Designer">Designer / Animator / Artist</option>
                      <option value="Writer & Marketing">Writer / Copywriter / Marketer</option>
                      <option value="Student / Education">Mahasiswa / Siswa / Akademisi</option>
                      <option value="Founder / General">Founder / Manager / Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#F3F4F6] flex gap-4 items-center">
                  <button 
                    onClick={prevStep}
                    className="w-1/3 border border-[#c8c5d0] text-[#2A2753]/70 py-3 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#F8F9FB] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Kembali</span>
                  </button>
                  <button 
                    onClick={nextStep}
                    className="w-2/3 bg-gradient-to-r from-[#7C3AED] to-[#6C5DD3] text-white py-3 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 hover:translate-y-[-1px] active:translate-y-0 shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
                  >
                    <span>Mulai Gunakan Nexa</span>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
};

export default OnboardingPage;
