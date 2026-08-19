import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Circle,
  Square,
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const exercises = [
  "Squats",
  "Push-ups",
  "Sit-ups",
  "Vertical Jump",
  "Long Jump",
];

export default function PerformanceAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [selectedExercise, setSelectedExercise] = useState("Squats");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [recording, setRecording] = useState(false);

  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);

  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Check whether user came from "Upload Video"
  const uploadMode =
    new URLSearchParams(location.search).get("mode") === "upload";

  // ---------------- CAMERA ----------------

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraStarted(true);
    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Camera access was denied. Please allow camera permission in your browser.",
      );
    }
  };

  // ---------------- RECORDING ----------------

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "video/webm",
      });

      const videoUrl = URL.createObjectURL(blob);

      setRecordedVideo(videoUrl);
    };

    recorder.start();

    setRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();

    setRecording(false);
  };

  const resetRecording = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }

    setRecordedVideo(null);
    chunksRef.current = [];
  };

  // ---------------- UPLOAD VIDEO ----------------

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Only allow video files
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file.");
      return;
    }

    // Remove old uploaded video
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo);
    }

    const videoUrl = URL.createObjectURL(file);

    setUploadedFile(file);
    setUploadedVideo(videoUrl);
  };

  const removeUploadedVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo);
    }

    setUploadedVideo(null);
    setUploadedFile(null);
  };

  // ---------------- CLEANUP ----------------

  useEffect(() => {
    return () => {
      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo);
      }

      if (uploadedVideo) {
        URL.revokeObjectURL(uploadedVideo);
      }
    };
  }, [recordedVideo, uploadedVideo]);

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
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
            Record your movement or upload a video for AI-powered analysis.
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            {/* ================= UPLOAD MODE ================= */}

            {uploadMode ? (
              <div className="rounded-2xl border bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Upload className="h-6 w-6 text-purple-700" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Upload Your Performance Video
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select a video from your computer.
                    </p>
                  </div>
                </div>

                {/* Upload box */}
                {!uploadedVideo && (
                  <label className="flex min-h-[350px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/40 transition hover:bg-purple-50">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                      <Video className="h-8 w-8 text-purple-700" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">
                      Choose a video
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      MP4, WebM, MOV and other video formats
                    </p>

                    <span className="mt-5 rounded-lg bg-purple-700 px-6 py-3 text-sm font-semibold text-white">
                      Browse Videos
                    </span>

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                )}

                {/* Uploaded video preview */}
                {uploadedVideo && (
                  <div>
                    <div className="relative overflow-hidden rounded-xl bg-black">
                      <video
                        src={uploadedVideo}
                        controls
                        className="aspect-video w-full object-contain"
                      />

                      <button
                        onClick={removeUploadedVideo}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* File information */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-purple-600" />

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {uploadedFile?.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {uploadedFile
                              ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analyze button */}
                    <button
                      onClick={() => {
                        console.log(
                          "Uploaded video:",
                          uploadedFile,
                          "Exercise:",
                          selectedExercise,
                        );

                        alert(
                          `Video ready for AI analysis: ${selectedExercise}`,
                        );
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Analyze Performance
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ================= CAMERA MODE ================= */

              <>
                <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
                  <div className="relative aspect-video">
                    {!cameraStarted ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                          <Camera className="h-8 w-8" />
                        </div>

                        <h2 className="text-xl font-semibold">Camera Ready</h2>

                        <p className="mt-2 text-sm text-gray-400">
                          Start your camera to begin performance analysis.
                        </p>

                        <button
                          onClick={startCamera}
                          className="mt-6 flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                        >
                          <Camera className="h-5 w-5" />
                          Start Camera
                        </button>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover"
                        />

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

                {/* CAMERA CONTROLS */}
                {cameraStarted && (
                  <div className="mt-4 flex justify-center gap-3">
                    {!recording && !recordedVideo && (
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

                    {recordedVideo && (
                      <button
                        onClick={resetRecording}
                        className="flex items-center gap-2 rounded-lg border bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Record Again
                      </button>
                    )}
                  </div>
                )}

                {/* RECORDED VIDEO */}
                {recordedVideo && (
                  <div className="mt-6 rounded-xl border bg-white p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">
                      Recorded Performance
                    </h3>

                    <video
                      src={recordedVideo}
                      controls
                      className="w-full rounded-lg"
                    />

                    <button
                      onClick={() => {
                        console.log(
                          "Ready to send video for:",
                          selectedExercise,
                        );

                        alert(
                          `Video ready for AI analysis: ${selectedExercise}`,
                        );
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Analyze Performance
                    </button>
                  </div>
                )}
              </>
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

            <div className="mt-8 rounded-xl bg-purple-50 p-4">
              <p className="text-sm font-semibold text-purple-900">
                Selected Exercise
              </p>

              <p className="mt-1 text-lg font-bold text-purple-700">
                {selectedExercise}
              </p>
            </div>

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
