import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Circle,
  Square,
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  Upload,
  Trophy,
  Target,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const exercises = [
  "Squats",
  "Push-ups",
  "Sit-ups",
  "Vertical Jump",
  "Long Jump",
];

export default function PerformanceAnalysis() {
  const navigate = useNavigate();

  // -----------------------------
  // REFS
  // -----------------------------

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -----------------------------
  // STATES
  // -----------------------------

  const [selectedExercise, setSelectedExercise] = useState("Squats");

  const [cameraStarted, setCameraStarted] = useState(false);
  const [recording, setRecording] = useState(false);

  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const [uploadedVideo, setUploadedVideo] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);

  // -----------------------------
  // START CAMERA
  // -----------------------------

  const startCamera = async () => {
    try {
      // If an old stream exists, stop it first
      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      setCameraStarted(true);
      setRecordedVideo(null);
      setRecordedBlob(null);
      setUploadedVideo(false);
      setShowScoreCard(false);

      // Wait for video element to render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current
            .play()
            .catch((error) => console.error("Video play error:", error));
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Camera access was denied. Please allow camera permission in your browser.",
      );
    }
  };

  // -----------------------------
  // START RECORDING
  // -----------------------------

  const startRecording = () => {
    if (!streamRef.current) {
      alert("Please start the camera first.");
      return;
    }

    chunksRef.current = [];

    let mimeType = "video/webm";

    // Browser compatibility
    if (!MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/mp4";
    }

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType,
    });

    mediaRecorderRef.current = recorder;

    // Collect video data
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    // When recording stops
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType,
      });

      console.log("Recorded video blob:", blob);
      console.log("Recorded video size:", blob.size);

      // IMPORTANT:
      // Store the blob
      setRecordedBlob(blob);

      // Create URL for preview
      const videoUrl = URL.createObjectURL(blob);

      setRecordedVideo(videoUrl);

      setUploadedVideo(false);
      setShowScoreCard(false);

      console.log("Recorded video URL created:", videoUrl);
    };

    // Start recording
    recorder.start(100);

    setRecording(true);

    console.log("Recording started");
  };

  // -----------------------------
  // STOP RECORDING
  // -----------------------------

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);

    console.log("Recording stopped");
  };

  // -----------------------------
  // UPLOAD VIDEO BUTTON
  // -----------------------------

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // -----------------------------
  // HANDLE VIDEO UPLOAD
  // -----------------------------

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate video
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    console.log("Uploaded video:", file.name);
    console.log("Uploaded video size:", file.size);

    // Stop camera
    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;

    setCameraStarted(false);
    setRecording(false);

    // Create preview URL
    const videoUrl = URL.createObjectURL(file);

    setRecordedVideo(videoUrl);
    setRecordedBlob(file);

    setUploadedVideo(true);
    setShowScoreCard(false);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------
  // RESET / CHANGE VIDEO
  // -----------------------------

  const resetRecording = () => {
    // Stop camera
    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;

    // Revoke old URL
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }

    setRecordedVideo(null);
    setRecordedBlob(null);

    setUploadedVideo(false);
    setShowScoreCard(false);

    setCameraStarted(false);
    setRecording(false);

    chunksRef.current = [];

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -----------------------------
  // SHOW SCORE CARD
  // -----------------------------

  const showResults = () => {
    if (!recordedBlob) {
      alert("Please record or upload a video first.");
      return;
    }

    console.log("Video ready for AI analysis");
    console.log("Exercise:", selectedExercise);
    console.log("Video:", recordedBlob);

    /*
      ---------------------------------------------
      LATER CONNECT AIML API HERE
      ---------------------------------------------

      Example:

      const formData = new FormData();

      formData.append("video", recordedBlob);
      formData.append("exercise", selectedExercise);

      fetch("YOUR_AIML_API_URL", {
        method: "POST",
        body: formData,
      });

      ---------------------------------------------
    */

    // Temporary demo score
    setShowScoreCard(true);
  };

  // -----------------------------
  // CLEANUP WHEN PAGE CLOSES
  // -----------------------------

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo);
      }
    };
  }, [recordedVideo]);

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Performance Analysis
          </h1>

          <p className="text-sm text-gray-500">
            Record or upload your movement and get AI-powered performance
            analysis.
          </p>
        </div>
      </div>

      {/* ================= MAIN ================= */}

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ================= LEFT SIDE ================= */}

          <div className="lg:col-span-2">
            {/* ================= CAMERA / VIDEO ================= */}

            <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
              <div className="relative aspect-video">
                {/* CAMERA NOT STARTED + NO VIDEO */}

                {!cameraStarted && !recordedVideo && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                      <Camera className="h-8 w-8" />
                    </div>

                    <h2 className="text-xl font-semibold">Camera Ready</h2>

                    <p className="mt-2 text-sm text-gray-400">
                      Start your camera or upload an existing video.
                    </p>

                    {/* BUTTONS */}

                    <div className="mt-6 flex gap-3">
                      {/* START CAMERA */}

                      <button
                        onClick={startCamera}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                      >
                        <Camera className="h-5 w-5" />
                        Start Camera
                      </button>

                      {/* UPLOAD */}

                      <button
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-100"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Video
                      </button>
                    </div>

                    {/* HIDDEN INPUT */}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {/* ================= RECORDED / UPLOADED VIDEO ================= */}

                {recordedVideo && (
                  <video
                    key={recordedVideo}
                    src={recordedVideo}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain"
                  />
                )}

                {/* ================= LIVE CAMERA ================= */}

                {cameraStarted && !recordedVideo && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      onLoadedMetadata={() => {
                        videoRef.current?.play();
                      }}
                      className="h-full w-full object-cover"
                    />

                    {/* RECORDING INDICATOR */}

                    {recording && (
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
                        <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                        Recording
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ================= CAMERA CONTROLS ================= */}

            {cameraStarted && !recordedVideo && (
              <div className="mt-4 flex justify-center gap-3">
                {!recording && (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                  >
                    <Circle className="h-4 w-4 fill-white" />
                    Start Recording
                  </button>
                )}

                {recording && (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
                  >
                    <Square className="h-4 w-4 fill-white" />
                    Stop Recording
                  </button>
                )}
              </div>
            )}

            {/* ================= VIDEO ACTIONS ================= */}

            {recordedVideo && !showScoreCard && (
              <div className="mt-6 rounded-xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {uploadedVideo
                        ? "Uploaded Performance"
                        : "Recorded Performance"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {uploadedVideo
                        ? "Your uploaded video is ready for analysis."
                        : "Your recorded video is ready for analysis."}
                    </p>
                  </div>

                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>

                {/* ACTION BUTTONS */}

                <div className="mt-4 flex gap-3">
                  {/* SHOW SCORE */}

                  <button
                    onClick={showResults}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                  >
                    <Trophy className="h-5 w-5" />
                    Show Score Card
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* CHANGE VIDEO */}

                  <button
                    onClick={resetRecording}
                    className="flex items-center gap-2 rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Change Video
                  </button>
                </div>
              </div>
            )}

            {/* ================= SCORE CARD ================= */}

            {showScoreCard && (
              <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
                {/* SCORE HEADER */}

                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Trophy className="h-8 w-8 text-purple-600" />
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Performance Score
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedExercise} Assessment
                  </p>
                </div>

                {/* MAIN SCORE */}

                <div className="mt-6 flex justify-center">
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-purple-500">
                    <span className="text-4xl font-bold text-gray-900">85</span>

                    <span className="text-sm text-gray-500">/ 100</span>
                  </div>
                </div>

                {/* METRICS */}

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-purple-50 p-4 text-center">
                    <Activity className="mx-auto h-5 w-5 text-purple-600" />

                    <p className="mt-2 text-xl font-bold text-gray-900">88%</p>

                    <p className="text-xs text-gray-500">Form</p>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-4 text-center">
                    <Target className="mx-auto h-5 w-5 text-purple-600" />

                    <p className="mt-2 text-xl font-bold text-gray-900">84%</p>

                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-4 text-center">
                    <Trophy className="mx-auto h-5 w-5 text-purple-600" />

                    <p className="mt-2 text-xl font-bold text-gray-900">Good</p>

                    <p className="text-xs text-gray-500">Performance</p>
                  </div>
                </div>

                {/* FEEDBACK */}

                <div className="mt-6 rounded-xl bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    AI Feedback
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    Good performance! Maintain proper body alignment and focus
                    on consistent movement throughout the exercise.
                  </p>
                </div>

                {/* CONTINUE */}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  Continue to Dashboard
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Assessment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the movement you want to analyze.
            </p>

            <div className="mt-5 space-y-3">
              {exercises.map((exercise) => (
                <button
                  key={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                    selectedExercise === exercise
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {exercise}
                </button>
              ))}
            </div>

            {/* SELECTED EXERCISE */}

            <div className="mt-8 rounded-xl bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-900">
                Selected Exercise
              </p>

              <p className="mt-1 text-lg font-bold text-purple-700">
                {selectedExercise}
              </p>
            </div>

            {/* INSTRUCTIONS */}

            <div className="mt-6 text-xs leading-5 text-gray-500">
              <p>• Keep your full body visible.</p>
              <p>• Place the camera at a suitable distance.</p>
              <p>• Make sure the area is well lit.</p>
              <p>• Perform the movement naturally.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
