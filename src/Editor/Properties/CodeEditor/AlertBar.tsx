import { Alert, Typography } from "@mui/material";
import type { ValidationError } from "../../Design/compiler";

type AlertBarProps = {
  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
  validationWarnings: ValidationError[];
  setValidationWarnings: (warnings: ValidationError[]) => void;
  error: string | null;
  handleReset: () => void;
};

function AlertBar(props: AlertBarProps) {
  const {
    validationErrors,
    setValidationErrors,
    validationWarnings,
    setValidationWarnings,
    error,
    handleReset,
  } = props;

  return (
    <>
      {/* Show validation errors (pre-evaluation) */}
      {validationErrors.length > 0 && (
        <Alert
          severity="error"
          onClose={() => setValidationErrors([])}
          sx={{
            pl: 1.5,
            py: 1,
          }}
        >
          <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
            Validation Error{validationErrors.length > 1 ? "s" : ""}:
          </Typography>
          {validationErrors.map((err: ValidationError, idx: number) => (
              <Typography
                key={idx}
                variant="caption"
                component="div"
                sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
              >
                {err.line && err.column ? `Line ${err.line}:${err.column} - ` : ""}
                {err.message}
              </Typography>
            )
          )}
        </Alert>
      )}

      {/* Show evaluation errors (post-evaluation from store) */}
      {error && !validationErrors.length && (
        <Alert
          severity="error"
          onClose={handleReset}
          sx={{
            pl: 1.5,
            py: 1,
          }}
        >
          <Typography
            variant="caption"
            component="pre"
            sx={{ whiteSpace: "pre-wrap", m: 0, p: 0 }}
          >
            {error}
          </Typography>
        </Alert>
      )}

      {/* Show warnings (non-blocking) */}
      {validationWarnings.length > 0 && !validationErrors.length && (
        <Alert
          severity="warning"
          onClose={() => setValidationWarnings([])}
          sx={{
            pl: 1.5,
            py: 1,
          }}
        >
          <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
            Warning{validationWarnings.length > 1 ? "s" : ""}:
          </Typography>
          {validationWarnings.map((warn: ValidationError, idx: number) => (
              <Typography
                key={idx}
                variant="caption"
                component="div"
                sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
              >
                {warn.line && warn.column
                  ? `Line ${warn.line}:${warn.column} - `
                  : ""}
                {warn.message}
              </Typography>
            )
          )}
        </Alert>
      )}
    </>
  );
}

export default AlertBar;
