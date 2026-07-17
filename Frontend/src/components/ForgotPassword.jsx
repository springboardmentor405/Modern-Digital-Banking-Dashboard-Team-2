import React, { useState, useEffect } from "react";

export default function ForgotPassword({ onClose = () => {} }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill("")); 
  const [timer, setTimer] = useState(27); 
  useEffect(() => {
    let interval = null;
    if (sent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sent, timer]);

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    
    setSent(true);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp.join(""));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={onClose}>
          ✕
        </button>

        {!sent ? (
          <>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Reset your password</h3>
            <p className="text-sm text-slate-500 mb-6">
              Enter your account email and we'll send a 6-digit verification code.
            </p>

            <form onSubmit={handleSubmitEmail} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Reset your password</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              A 6 digit email OTP was sent to <span className="font-semibold text-slate-800">{email}</span>. 
              Enter that code here to proceed.
            </p>

            <form onSubmit={handleVerifyOtp}>
              {/* OTP Input Container */}
              <div className="flex gap-2 mb-6 justify-between">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 border-2 border-slate-100 rounded-xl text-center text-xl font-bold focus:border-indigo-500 focus:outline-none transition-all"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                ))}
              </div>

              <p className="text-sm text-slate-400 mb-6">
                Didn't get OTP? - <span className="text-slate-500">resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</span>
              </p>

              <button 
                type="submit" 
                className="w-full py-3 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors shadow-md"
              >
                Verify email OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}