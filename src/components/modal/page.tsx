"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
};

export default function Modal({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">{cancelText}</Button>

        {onSubmit && (
          <Button color="success" onClick={onSubmit}>
            {submitText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
