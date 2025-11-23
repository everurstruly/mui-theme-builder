import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SponsorModalProps {
  open: boolean;
  onClose: () => void;
  address: string;
}

export default function SponsorModal({ open, onClose, address }: SponsorModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e: any) {
      void e;
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = address;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const handleClose = () => {
    setShowQR(false);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="sponsor-dialog-title"
      id="sponsor-dialog"
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: "6rem" },
        },
      }}
    >
      <DialogTitle
        id="sponsor-dialog-title"
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <QrCode2Icon color="primary" />
        Sponsor via Bitcoin
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Your support keeps these tools alive and helps fund new features. Send any
          amount to the Bitcoin address below.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Bitcoin Address Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
          >
            Bitcoin Address
          </Typography>
          <TextField
            fullWidth
            value={address}
            InputProps={{
              readOnly: true,
              sx: {
                fontFamily: "monospace",
                fontSize: "0.875rem",
              },
              endAdornment: (
                <IconButton
                  onClick={handleCopy}
                  aria-label="Copy Bitcoin address to clipboard"
                  edge="end"
                  color={copied ? "success" : "default"}
                >
                  {copied ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              ),
            }}
            variant="outlined"
          />
          {copied && (
            <Alert
              severity="success"
              sx={{ mt: 1.5 }}
              icon={<CheckCircleIcon fontSize="inherit" />}
            >
              Address copied to clipboard!
            </Alert>
          )}
        </Box>

        {/* QR Code Section */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowQR(!showQR)}
            aria-label={showQR ? "Hide QR code" : "Show QR code"}
            startIcon={<QrCode2Icon />}
          >
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </Button>

          {showQR && (
            <Box
              sx={{
                mt: 2,
                width: "100%",
                aspectRatio: "1",
                maxWidth: 240,
                mx: "auto",
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                QR code will appear here
                <br />
                (Generate using address prop)
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Optional Twitter Handle */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
          >
            Get a Shoutout (Optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="@yourhandle"
            variant="outlined"
            helperText="Include your Twitter/X handle to get a public thank-you on the project repo and website"
            InputProps={{
              startAdornment: (
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mr: 0.5 }}
                >
                  @
                </Typography>
              ),
            }}
          />
        </Box>

        {/* Lightning Network Note */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Lightning Network supported.</strong> Small amounts welcome —
            every satoshi helps!
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
        <Button
          onClick={handleCopy}
          variant="contained"
          startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
          disabled={copied}
        >
          {copied ? "Copied!" : "Copy Address"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
