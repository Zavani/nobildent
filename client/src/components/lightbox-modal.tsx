import { X } from "lucide-react";

interface LightboxModalProps {
  image: { src: string; alt: string } | null;
  onClose: () => void;
}

export default function LightboxModal({ image, onClose }: LightboxModalProps) {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      data-testid="modal-lightbox"
    >
      <div className="max-w-4xl max-h-full">
        <img 
          src={image.src} 
          alt={image.alt} 
          className="max-w-full max-h-full object-contain rounded-lg"
          data-testid="img-lightbox"
        />
      </div>
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-white text-2xl hover:text-neon-blue transition-colors"
        data-testid="button-close-lightbox"
      >
        <X size={32} />
      </button>
    </div>
  );
}