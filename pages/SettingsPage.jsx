import React, { useContext, useState } from "react";
import { ThemeContext } from "../components/Theme/ThemeProvider";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Snackbar,
} from "@mui/material";

export default function SettingsPage() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(true);
    // Here you could also persist settings to backend/localStorage
  };

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 2,
        boxShadow: 2,
        p: 4,
        mt: 4,
        maxWidth: 500,
      }}
    >
      <Typography variant="h4" color="primary" fontWeight={700} mb={3}>
        Settings
      </Typography>
      <FormControlLabel
        control={<Switch checked={mode === "dark"} onChange={toggleTheme} />}
        label="Dark Mode"
      />
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        }
        label="Enable Notifications"
      />
      <br />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Settings
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Settings saved!"
      />
    </Box>
  );
}
