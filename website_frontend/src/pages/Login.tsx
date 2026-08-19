import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Phone, LockKeyhole } from "lucide-react";

export default function Login() {
  const [loginData, setLoginData] = useState({
    phone: "",
    otp: "",
  });

  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!showOtp) {
      setLoading(true);

      setTimeout(() => {
        setShowOtp(true);
        setLoading(false);
      }, 700);
    } else {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 700);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* =====================================================
          CLEAR STADIUM BACKGROUND
      ====================================================== */}

      <img
        src="https://i.pinimg.com/474x/4d/cc/bf/4dccbf753b815ed10c2194111001a058.jpg?nii=t"
        alt="Sports stadium"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {/* Very light overlay - stadium stays CLEAR */}
      <div className="absolute inset-0 bg-black/10" />

      {/* =====================================================
          LOGIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-8">
        {/* =================================================
            TRANSPARENT GLASS LOGIN CARD
        ================================================== */}

        <div
          className="
            w-full
            max-w-[510px]
            rounded-[24px]

            border
            border-white/30

            bg-white/[0.12]

            p-8
            sm:p-11

            shadow-[0_20px_60px_rgba(0,0,0,0.30)]

            backdrop-blur-[10px]
            backdrop-saturate-150
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col items-center text-center">
            {/* Shield */}

            <div
              className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full

                border
                border-white/35

                bg-white/15

                shadow-[0_8px_25px_rgba(0,0,0,0.20)]
              "
            >
              <Shield className="h-8 w-8 text-white" strokeWidth={1.8} />
            </div>

            {/* Title */}

            <h1
              className="
                text-[27px]
                font-bold
                tracking-tight
                text-white
                drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]
                sm:text-[31px]
              "
            >
              Sports Assessment Portal
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-white/85
                drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]
                sm:text-[15px]
              "
            >
              Secure access for officials and evaluators
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <form onSubmit={handleLogin} className="mt-9">
            {/* Login tab */}

            <div className="border-b border-white/25">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  border-b-2
                  border-white
                  pb-3
                "
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-white">
                  Login
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* =================================================
                PHONE NUMBER
            ================================================== */}

            <div className="mt-7">
              <label
                htmlFor="phone"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-white
                  drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]
                "
              >
                Phone Number
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl

                  border
                  border-white/30

                  bg-black/10

                  px-4
                  py-4

                  transition-all
                  duration-200

                  focus-within:border-white/60
                  focus-within:bg-black/15
                "
              >
                <Phone
                  className="h-[19px] w-[19px] shrink-0 text-white"
                  strokeWidth={1.8}
                />

                <input
                  id="phone"
                  type="tel"
                  placeholder="+91-1234-567-898"
                  value={loginData.phone}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
                  className="
                    w-full
                    bg-transparent
                    text-[15px]
                    text-white
                    outline-none
                    placeholder:text-white/65
                  "
                />
              </div>
            </div>

            {/* =================================================
                OTP
            ================================================== */}

            {showOtp && (
              <div className="mt-6">
                <label
                  htmlFor="otp"
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-white
                    drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]
                  "
                >
                  OTP Code
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/30
                    bg-black/10
                    px-4
                    py-4

                    focus-within:border-white/60
                    focus-within:bg-black/15
                  "
                >
                  <LockKeyhole
                    className="h-[19px] w-[19px] shrink-0 text-white"
                    strokeWidth={1.8}
                  />

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={loginData.otp}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        otp: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    required
                    className="
                      w-full
                      bg-transparent
                      text-[15px]
                      tracking-[4px]
                      text-white
                      outline-none
                      placeholder:text-white/65
                      placeholder:tracking-normal
                    "
                  />
                </div>

                <p className="mt-2 text-xs text-white/75">
                  Code sent to {loginData.phone}
                </p>
              </div>
            )}

            {/* =================================================
                BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                mt-8
                w-full
                rounded-xl

                border
                border-white/30

                bg-white/85

                px-4
                py-4

                text-sm
                font-semibold
                text-[#172033]

                shadow-[0_8px_25px_rgba(0,0,0,0.25)]

                transition-all
                duration-200

                hover:bg-white

                active:scale-[0.99]

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading
                ? showOtp
                  ? "Verifying..."
                  : "Sending OTP..."
                : showOtp
                  ? "Verify & Login"
                  : "Send OTP"}
            </button>

            {/* =================================================
                FORGOT PASSWORD
            ================================================== */}

            <div className="mt-6 text-center">
              <button
                type="button"
                className="
                  text-sm
                  font-medium
                  text-white
                  drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]
                  hover:underline
                "
              >
                Forgot Password?
              </button>
            </div>
          </form>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="mt-8 border-t border-white/20 pt-5 text-center">
            <p className="text-xs text-white/65">
              Secure access for authorized officials and evaluators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
