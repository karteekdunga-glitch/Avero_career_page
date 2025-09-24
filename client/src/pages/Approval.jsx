// client/src/pages/Approval.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const STAGES = ["Interview", "HR", "Selected"];

export default function Approval() {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch("http://localhost:4000/api/admin/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setApps(data);
      } catch (err) {
        console.error("❌ Failed to fetch apps", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, [token]);

  async function updateStatus(rowIndex, status) {
    try {
      await fetch(`http://localhost:4000/api/admin/applications/${rowIndex}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setApps((prev) =>
        prev.map((a) =>
          a.rowIndex === rowIndex ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  }

  function getStageIndex(status) {
    if (!status || status === "Application Received") return -1;
    return STAGES.indexOf(status);
  }

  if (loading) return <div className="p-6">Loading applications...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Approval Dashboard</h1>
      {apps.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {apps.map((app) => {
            const currentStageIndex = getStageIndex(app.status);

            return (
              <div key={app.rowIndex} className="border rounded-xl p-6 shadow bg-white">
                <h2 className="font-bold text-lg">{app.name}</h2>
                <p><b>Email:</b> {app.email}</p>
                <p><b>Phone:</b> {app.phone}</p>
                <p><b>Role:</b> {app.role}</p>
                {app.resumeUrl && (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    View Resume
                  </a>
                )}

                {/* Progress Tracker */}
                <div className="mt-6 relative flex justify-between items-center">
                  {STAGES.map((stage, index) => {
                    const isCompleted = currentStageIndex >= index;
                    let lineColor = "bg-gray-300";
                    if (isCompleted) lineColor = "bg-green-500";
                    if (app.status === "Rejected" && isCompleted)
                      lineColor = "bg-red-500";
                    if (currentStageIndex === -1 && index === 0)
                      lineColor = "bg-yellow-400";

                    return (
                      <div key={stage} className="flex flex-col items-center flex-1">
                        {index > 0 && (
                          <div
                            className={`h-1 ${lineColor}`}
                            style={{
                              position: "absolute",
                              top: "12px",
                              left: `${((index - 1) / (STAGES.length - 1)) * 100}%`,
                              width: `${100 / (STAGES.length - 1)}%`,
                            }}
                          />
                        )}
                        <div className="relative z-10 w-6 h-6 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-black"></div>
                        </div>
                        <span className="text-sm mt-2">{stage}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-2">
                  {STAGES.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(app.rowIndex, status)}
                      className={`px-3 py-1 rounded-lg text-white ${
                        app.status === status
                          ? "bg-green-600"
                          : "bg-gray-500 hover:bg-gray-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() => updateStatus(app.rowIndex, "Rejected")}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
