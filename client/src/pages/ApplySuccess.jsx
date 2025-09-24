export default function ApplySuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center animate-pop">
        <div className="flex justify-center mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="40" fill="#2fb57c" />
            <path d="M26 44l10 10 20-20" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Thank You for Applying!</h1>
        <p className="text-lg text-gray-700 mb-5">
          Your application has been received.<br />
          We appreciate your interest in joining <span className="font-bold text-[var(--brand)]">Avero Advisors</span>.
        </p>
        <div className="text-base text-gray-600 mb-6">
          Our team will review your details and reach out with next steps.<br />
          Wishing you the best of luck!
        </div>
        <div className="flex justify-center">
          <a 
            href="/" 
            className="inline-block px-6 py-2 rounded-full bg-[var(--brand)] text-white font-semibold shadow 
                       hover:scale-105 hover:bg-[var(--accent)] transform transition duration-300"
          >
            Back to Home
          </a>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.5s ease-out; }
      `}</style>
    </div>
  );
}
