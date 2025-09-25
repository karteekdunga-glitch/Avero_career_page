// src/components/LoadingOverlay.jsx
import { Spinner } from "./Spinner";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <Spinner size="lg" />
    </div>
  );
}
