import { Trash2, X } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, title = 'Delete this item?' , message = 'This action cannot be undone.' }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(15, 31, 61, 0.5)' }}
      onClick={onCancel}
    >
      <div
        className="glass-panel w-full max-w-sm p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-500" />
        </div>

        {/* Text */}
        <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
        <p className="font-body text-sm text-mist mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-ghost flex-1 py-2.5 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-body text-xs font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}