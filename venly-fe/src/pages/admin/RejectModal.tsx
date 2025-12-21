import { useState } from "react";
import { adminApi } from "@/api/adminApi";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

interface RejectModalProps {
  startupId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RejectModal = ({
  startupId,
  onClose,
  onSuccess,
}: RejectModalProps) => {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await adminApi.rejectStartup(startupId, reason);

      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to reject startup. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <GlassCard className="w-full max-w-md space-y-4 p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Reject Startup
        </h2>

        <textarea
          className="w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-destructive"
          rows={4}
          placeholder="Enter reason for rejection"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default RejectModal;
