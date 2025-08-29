import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangleIcon, Loader2Icon } from 'lucide-react';
interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDanger?: boolean;
}
export const ActionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  isDanger = false
}: ActionDialogProps) => {
  return <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" actions={<>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm} disabled={isLoading} leftIcon={isLoading ? <Loader2Icon className="animate-spin" size={16} /> : undefined}>
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </>}>
      <div className="flex items-start gap-4">
        {isDanger && <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
            <AlertTriangleIcon size={20} />
          </div>}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </Modal>;
};
