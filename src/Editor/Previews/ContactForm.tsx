import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { Check, Error as ErrorIcon } from "@mui/icons-material";

export default function ContactForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate random success/error for demo
    setStatus(Math.random() > 0.3 ? "success" : "error");

    // Reset after 3 seconds
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <Box
      sx={{
        px: 4,
        py: 20,
        backgroundColor: "background.paper",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" marginBottom={3} fontWeight="bold">
        Get in Touch
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          disabled={status === "loading"}
          placeholder="Your name"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          disabled={status === "loading"}
          placeholder="your@email.com"
        />

        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          required
          disabled={status === "loading"}
          placeholder="Your message here..."
        />

        {status === "success" && (
          <Alert icon={<Check fontSize="inherit" />} severity="success">
            Message sent successfully! We'll get back to you soon.
          </Alert>
        )}

        {status === "error" && (
          <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error">
            Something went wrong. Please try again.
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size={isMobile ? "medium" : "large"}
          disabled={status === "loading"}
          sx={{
            gap: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {status === "loading" && <CircularProgress size={20} />}
          {status === "loading" ? "Sending..." : "Send Message"}
        </Button>
      </Box>
    </Box>
  );
}

