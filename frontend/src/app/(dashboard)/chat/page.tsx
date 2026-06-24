import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to show a premium skeleton state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse pb-6">
        <div className="h-6 bg-gray-200 rounded-2xl w-32 mb-2"></div>
        <div className="grid grid-cols-12 gap-6 items-stretch">
          <div className="col-span-12 md:col-span-5 bg-white border border-[#F3F4F6] rounded-3xl p-8 h-[380px]">
            <div className="h-6 bg-gray-200 rounded-xl w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          </div>
          <div className="col-span-12 md:col-span-7 bg-white border border-[#F3F4F6] rounded-3xl p-8 h-[380px] space-y-6">
            <div className="h-6 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative h-[calc(100vh-140px)] animate-slide-up select-none">
      
      {/* Background Teaser Layer (Unclickable, Blurred) */}
      <div className="flex-1 overflow-hidden pointer-events-none blur-[3px] opacity-15 select-none flex flex-col gap-5">
        <div className="flex space-x-6 border-b border-gray-100 pb-2">
          <span className="font-bold text-xs text-[#2A2753] border-b-2 border-[#2A2753] pb-2">Focus Today</span>
          <span className="font-bold text-xs text-gray-400">Focus Suggestion</span>
          <span className="font-bold text-xs text-gray-400">Focus History</span>
          <span className="font-bold text-xs text-gray-400">Workload Insight</span>
        </div>
        
        <div className="grid grid-cols-12 gap-6 items-stretch flex-grow">
          {/* Left: Large Timer Block */}
          <div className="col-span-12 md:col-span-5 bg-white rounded-3xl p-6 flex flex-col items-center justify-center space-y-6 border border-[#F3F4F6]">
            <div className="w-56 h-56 rounded-full border-[10px] border-[#2A2753]/5 flex items-center justify-center relative">
              <span className="text-6xl font-black text-[#15113d]">25:00</span>
            </div>
            <div className="flex space-x-4 w-full justify-center">
              <div className="w-28 h-10 bg-[#15113d] rounded-xl"></div>
              <div className="w-10 h-10 border border-[#F3F4F6] rounded-xl"></div>
            </div>
          </div>

          {/* Right: Bento Cards */}
          <div className="col-span-12 md:col-span-7 flex flex-col space-y-6">
            <div className="h-1/2 bg-white rounded-3xl p-5 border border-[#F3F4F6] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 bg-gray-100 rounded"></div>
                <div className="h-5 w-14 bg-gray-100 rounded-full"></div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="h-10 w-full bg-gray-50 rounded-xl"></div>
                <div className="h-10 w-full bg-gray-50 rounded-xl"></div>
              </div>
            </div>
            <div className="h-1/2 bg-white rounded-3xl p-5 border border-[#F3F4F6] flex flex-col justify-between">
              <div className="h-5 w-36 bg-gray-100 rounded"></div>
              <div className="flex items-end space-x-2 h-20 mt-4">
                <div className="w-full bg-[#fec886] h-[40%] rounded-t-lg"></div>
                <div className="w-full bg-[#2a2753] h-[70%] rounded-t-lg"></div>
                <div className="w-full bg-[#2a2753] h-[90%] rounded-t-lg"></div>
                <div className="w-full bg-[#fec886] h-[50%] rounded-t-lg"></div>
                <div className="w-full bg-[#2a2753] h-[60%] rounded-t-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Foreground Layer (Coming Soon Modal) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(42,39,83,0.08)] flex flex-col items-center text-center space-y-6 border border-[#F3F4F6] transform hover:scale-[1.01] transition-transform duration-500">
          <div className="w-20 h-20 bg-[#FFF2EB] rounded-2xl flex items-center justify-center mb-2 animate-bounce border border-[#FFDFCD]/40 shadow-sm">
            <img
              src="/images/icon/NexaFocus.png"
              alt="Nexa Focus Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-[#15113d] leading-tight">Ruang Fokus Anda Sedang Diracik</h2>
            <p className="font-sans text-[12.5px] font-bold text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
              Nexa Focus akan mengintegrasikan Focus Timer, Smart Suggestions, dan Workload Insights ke dalam satu pusat kendali tanpa distraksi. Kami sedang menyiapkan pengalaman terbaik untuk Anda.
            </p>
          </div>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F3F4F6] to-transparent my-2"></div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 border border-[#2a2753] text-[#2a2753] font-bold text-xs rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Kembali ke Dashboard
            </button>
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 bg-[#7C3AED] text-white font-bold text-xs rounded-xl opacity-50 cursor-not-allowed"
            >
              Ingatkan Saya
            </button>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTLuNxA_VMm9FXo1KIPf4ZRGo1c-2mPkah5iEHKC8-_aWjUWeRVxKT4dN8QjTuoduoVJtMfEQmv3jDBALnYr50MfrRIG-F4RLbueiGSZZasoWrVqtglNurS4Gjz5WPjZUgDbPrVIKfhYGQQ0quWRwl-BAXZ-5iDY0-S4-9pdq6BzP-qr_mGk5lBd9WCO6Kt8FCobYo9W-XaLzq14w8-qtZOj7Rc27rsWCUeeI8pXLeI4Y9Bd2jwNenWd9DJHnTNuZIu_bQN0_BoN5X"
                />
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcJPZDLnRQsfEzYmw7na76nhOC2m9TgW2AYZYFHiwYAjqZ4BZMKyHKkJ1q6aKIkbp6Vd19aI4puNNYIAANdsUeLHYMQQGpcYTiF19MlIrZiye0N5xP9gYmHJWpo34qXC0GjfTGF9d-7DSa_iWwY2U35XXa654-iCoxtLCtkEHy2rQpvPpg84aUQeHernpXH7-oJz8DliIIe1TjC043vNq1yOBPwuB-HWrNvv4A7aY8id4CHqwhjUXFHNyX5ig1NUg_bVBBeJsc3NNP"
                />
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Avatar 3"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTwwfbk0pBLa1GxsFyBxA9wONi0KSgXOw3MywVflCIcuVG9Y3Eaf88uvAppcROGroylcLtMrWE-6MyMTw_cggWf8WE96PsKBm6Pr0Rluhyzdb0FxdUJiCL1rno6L4Yi-afh2GPdNSdLyN7lB15sR_zOUdm9PaHGtGVVgvQk-V0rO4FyXd8LUi2Vf-nCgRD5ErpRRN9xmFa9vk0oA-aAPfvoLNL-BLEF6xzt72jAzQ527xrCG-4gARN8IwFPg7JpEC_qSaB1oPXvL0B"
                />
              </div>
            </div>
            <span className="text-[11px] text-gray-500 font-bold">800+ User menantikan fitur ini</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
