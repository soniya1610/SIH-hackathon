import { CheckCircle, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ScoreCard() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

  const exercise = state.exercise || "Squats";
  const score = state.score || 85;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Result
          </h1>

          <p className="mt-1 text-gray-500">
            Here's your performance analysis result.
          </p>
        </div>

        {/* Score Card */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* Top */}
          <div className="bg-purple-700 px-8 py-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <Trophy className="h-8 w-8" />
            </div>

            <p className="text-sm font-medium text-purple-100">{exercise}</p>

            <div className="mt-2 text-6xl font-bold">{score}</div>

            <p className="mt-2 text-purple-100">Performance Score</p>
          </div>

          {/* Results */}
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">Overall Score</p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {score}/100
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">Movement Quality</p>

              <p className="mt-2 text-2xl font-bold text-green-600">Good</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">Assessment</p>

              <p className="mt-2 text-2xl font-bold text-purple-700">
                Complete
              </p>
            </div>
          </div>

          {/* AI Result */}
          <div className="px-6 pb-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                <div>
                  <h3 className="font-semibold text-green-900">
                    Analysis Complete
                  </h3>

                  <p className="mt-1 text-sm text-green-700">
                    Your movement has been successfully analyzed. Detailed AI
                    insights and recommendations can be displayed here.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 border-t p-6 sm:flex-row sm:justify-end">
            <button
              onClick={() => navigate("/performance-analysis")}
              className="flex items-center justify-center gap-2 rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Analyze Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-800"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
