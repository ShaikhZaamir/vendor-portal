"use client";

import Button from "./Button";

export type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">

                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="text-gray-600 mt-2 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel} className="w-24">
                        {cancelText}
                    </Button>
                    <Button variant="danger" onClick={onConfirm} className="w-24">
                        {confirmText}
                    </Button>
                </div>

            </div>
        </div>
    );
}
