import { useEffect, useState, type FormEvent } from "react";
import { Box, Button, TextField } from "@mui/material";

interface ProfileDisplayNameFormProps {
  /** Current stored display name (null when unset). Presented as the current value (C-F030-002). */
  displayName: string | null;
  /** True while ProfilePage is submitting the PUT; disables the save action. */
  saving: boolean;
  /** Exposed save action — ProfilePage performs the API call (API-F030-002). */
  onSave: (value: string) => void;
}

export default function ProfileDisplayNameForm({ displayName, saving, onSave }: ProfileDisplayNameFormProps) {
  const [editValue, setEditValue] = useState<string>(displayName ?? "");

  // Reset the draft on load and after a confirmed save (FIP §13). A failed save leaves the
  // draft intact so the user can retry (AC-F030-006).
  useEffect(() => {
    setEditValue(displayName ?? "");
  }, [displayName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(editValue);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Display name"
        value={editValue}
        onChange={(event) => setEditValue(event.target.value)}
        disabled={saving}
        fullWidth
      />
      <Box>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
