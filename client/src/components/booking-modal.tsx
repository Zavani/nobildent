import { useState } from "react";
import { X, Calendar, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookingSchema = z.object({
  nume: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.string().email("Adresa de email nu este validă"),
  telefon: z.string().min(10, "Numărul de telefon trebuie să aibă cel puțin 10 cifre"),
  dataZi: z.string().min(1, "Data este obligatorie"),
  oraSlot: z.string().min(1, "Ora este obligatorie"),
  serviciu: z.string().min(1, "Serviciul este obligatoriu"),
  mesaj: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: BookingForm) => {
      // Combine date and time into datetime-local format
      const dataProgramare = `${data.dataZi}T${data.oraSlot}`;
      const appointmentData = {
        nume: data.nume,
        email: data.email,
        telefon: data.telefon,
        dataProgramare,
        serviciu: data.serviciu,
        mesaj: data.mesaj,
      };
      await apiRequest("POST", "/api/appointments", appointmentData);
    },
    onSuccess: () => {
      toast({
        title: "Succes!",
        description: "Programarea a fost trimisă cu succes! Vă vom contacta în curând pentru confirmare.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      reset();
      onClose();
    },
    onError: (error: Error) => {
      console.error("Booking error:", error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la trimiterea programării. Încercați din nou.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingForm) => {
    createAppointmentMutation.mutate(data);
  };

  // Set minimum date to tomorrow at 9:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const minDate = tomorrow.toISOString().slice(0, 16);

  // Generate time slots from 9:00 to 17:00 in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="modal-booking">
      <div className="glass-morphism rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-neon-blue" data-testid="text-booking-title">Fă o Programare</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            data-testid="button-close-booking"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="floating-label">
            <input 
              {...register("nume")}
              type="text" 
              placeholder=" " 
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
              data-testid="input-nume"
            />
            <label className="floating-label-text">Nume Complet</label>
            {errors.nume && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-nume">{errors.nume.message}</p>
            )}
          </div>
          
          <div className="floating-label">
            <input 
              {...register("email")}
              type="email" 
              placeholder=" " 
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
              data-testid="input-email"
            />
            <label className="floating-label-text">Email</label>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-email">{errors.email.message}</p>
            )}
          </div>
          
          <div className="floating-label">
            <input 
              {...register("telefon")}
              type="tel" 
              placeholder=" " 
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
              data-testid="input-telefon"
            />
            <label className="floating-label-text">Telefon</label>
            {errors.telefon && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-telefon">{errors.telefon.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Data Programării</label>
            <input 
              {...register("dataZi")}
              type="date" 
              min={tomorrow.toISOString().slice(0, 10)}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
              data-testid="input-data-zi"
            />
            {errors.dataZi && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-data-zi">{errors.dataZi.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2 text-sm font-medium">Ora Programării</label>
            <select 
              {...register("oraSlot")}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
              data-testid="select-ora-slot"
            >
              <option value="" className="bg-gray-800">Selectează ora</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} className="bg-gray-800">
                  {slot}
                </option>
              ))}
            </select>
            {errors.oraSlot && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-ora-slot">{errors.oraSlot.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2 text-sm font-medium">Serviciu Dorit</label>
            <select 
              {...register("serviciu")}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
              data-testid="select-serviciu"
            >
              <option value="" className="bg-gray-800">Selectează serviciul</option>
              <option value="Tratamente Generale" className="bg-gray-800">Tratamente Generale</option>
              <option value="Estetica Dentară" className="bg-gray-800">Estetica Dentară</option>
              <option value="Implantologie" className="bg-gray-800">Implantologie</option>
              <option value="Ortodonție" className="bg-gray-800">Ortodonție</option>
              <option value="Chirurgie Orală" className="bg-gray-800">Chirurgie Orală</option>
              <option value="Pedodonție" className="bg-gray-800">Pedodonție</option>
            </select>
            {errors.serviciu && (
              <p className="text-red-400 text-sm mt-1" data-testid="error-serviciu">{errors.serviciu.message}</p>
            )}
          </div>
          
          <div className="floating-label">
            <textarea 
              {...register("mesaj")}
              placeholder=" " 
              rows={3} 
              className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors resize-none"
              data-testid="textarea-mesaj"
            />
            <label className="floating-label-text">Mesaj Opțional</label>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-logo-brown py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            data-testid="button-submit-booking"
          >
            {isSubmitting ? (
              <>⏳ Trimite...</>
            ) : (
              <>
                <Calendar className="inline mr-2" size={20} />
                Finalizează Programarea
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
