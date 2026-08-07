import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import apiClient from "../services/apiClient";
import ProfileDisplayNameForm from "../components/ProfileDisplayNameForm";

/**
 * Page-local UI state machine per TD §14 (CMP-F030-002, FD-F030-002):
 *   Idle -> Loading -> Loaded/Error
 *   Loaded -> Saving -> Success/Error
 *   Success -> Loaded (continue viewing)
 *   Error -> Saving (user retries) / Error -> Loaded (page remains usable)
 */
type Phase = "Loading" | "Loaded" | "Saving" | "Success" | "Error";

/** GET /api/profile/ response body (API-F030-001). The unset stored value is JSON null. */
interface ProfileResponse {
  display_name: string | null;
}

const SUCCESS_MESSAGE_DURATION_MS = 2000;

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("Loading");
  /**
   * Distinguishes a load failure (no stored value available, no save allowed — AC-F030-006/007)
   * from a save failure (previously loaded value unchanged, page remains usable — AC-F030-006).
   */
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get<ProfileResponse>("/profile/")
      .then((response) => {
        if (cancelled) return;
        setDisplayName(response.data.display_name);
        setLoadFailed(false);
        setPhase("Loaded");
      })
      .catch(() => {
        if (cancelled) return;
        setLoadFailed(true);
        setPhase("Error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase !== "Success") return;
    const timer = window.setTimeout(() => setPhase("Loaded"), SUCCESS_MESSAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const handleSave = (value: string) => {
    setPhase("Saving");
    apiClient
      .put("/profile/", { display_name: value })
      .then(() => {
        // A resolved (non-error) PUT is a confirmed save (Open Contract Item 1 — no response-body
        // parsing and no refetch-after-save decision are implemented).
        setDisplayName(value);
        setPhase("Success");
      })
      .catch(() => {
        // Save failure: the previously loaded value is unchanged (AC-F030-006).
        setPhase("Error");
      });
  };

  const showForm =
    phase === "Loaded" || phase === "Saving" || phase === "Success" || (phase === "Error" && !loadFailed);

  return (
    <Box sx={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
      <Typography variant="h1" component="h1" gutterBottom>
        Profile
      </Typography>

      {phase === "Loading" && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={20} />
          <Typography>Loading your profile...</Typography>
        </Box>
      )}

      {phase === "Error" && loadFailed && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          Failed to load your profile. Please try again later.
        </Alert>
      )}

      {showForm && (
        <>
          {phase === "Success" && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Display name saved.
            </Alert>
          )}
          {phase === "Error" && !loadFailed && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              Failed to save your display name. Your saved value is unchanged.
            </Alert>
          )}
          <ProfileDisplayNameForm displayName={displayName} saving={phase === "Saving"} onSave={handleSave} />
        </>
      )}
    </Box>
  );
}
