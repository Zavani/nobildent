import { Phone, Check, Calendar, X } from "lucide-react";

interface CallConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onConfirm: () => void;
  onReschedule: () => void;
}

export default function CallConfirmModal({ 
  isOpen, 
  onClose, 
  patientName, 
  onConfirm, 
  onReschedule 
}: CallConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="modal-call-confirm">
      <div className="glass-morphism rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-green-400 text-4xl mb-4">
            <Phone size={48} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-green-400" data-testid="text-call-title">Apel Efectuat</h3>
          <p className="text-gray-300 mt-2" data-testid="text-call-patient">
            Ai sunat pacientul <span className="font-semibold">{patientName}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={onConfirm}
            className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            data-testid="button-confirm-attendance"
          >
            <Check className="mr-2" size={20} />
            Confirmă Prezența
          </button>
          <button 
            onClick={onReschedule}
            className="w-full bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            data-testid="button-reschedule"
          >
            <Calendar className="mr-2" size={20} />
            Reprogramează
          </button>
          <button 
            onClick={onClose}
            className="w-full glass-morphism py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors flex items-center justify-center"
            data-testid="button-close-call"
          >
            <X className="mr-2" size={20} />
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}