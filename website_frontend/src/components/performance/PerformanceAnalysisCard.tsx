import { Camera, ChevronRight, Sparkles, Upload, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PerformanceAnalysisCard() {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
            <Camera className="h-7 w-7 text-purple-700" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Analyze Your Performance
              </h2>

              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>

            <p className="mt-1 max-w-xl text-sm text-gray-500">
              Record your movement using your camera or upload a video to get
              AI-powered performance analysis.
            </p>

            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                AI Analysis
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Movement Tracking
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Camera Based
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="flex shrink-0 gap-3">
          {/* Use Camera */}
          <button
            onClick={() => navigate("/performance-analysis")}
            className="flex items-center gap-2 rounded-lg bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
          >
            <Camera className="h-4 w-4" />
            Use Camera
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Upload Video */}
          <button
            onClick={() => navigate("/performance-analysis?mode=upload")}
            className="flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            <Upload className="h-4 w-4" />
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
}
