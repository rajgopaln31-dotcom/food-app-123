import { Snackbar, Alert } from "@mui/material";

// One small message box (snackbar) used by many pages
export interface ToastState { open: boolean; message: string; severity: "success" | "error" | "info" | "warning"; }
export const emptyToast: ToastState = { open: false, message: "", severity: "success" };

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  return (
    <Snackbar open={toast.open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert severity={toast.severity} variant="filled" onClose={onClose}>{toast.message}</Alert>
    </Snackbar>
  );
}
export default Toast;
