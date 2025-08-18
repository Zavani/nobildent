import { useState } from "react";
import { Shield, BarChart3, Calendar, Download, LogOut, Phone, Edit, Trash2, Eye, EyeOff, Check, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BookingModal from "@/components/booking-modal";
import type { Programare } from "@shared/schema";

type AdminView = 'login' | 'dashboard' | 'appointments' | 'exports';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'confirmed':
      return 'bg-green-500/20 text-green-300';
    case 'rescheduled':
      return 'bg-blue-500/20 text-blue-300';
    case 'completed':
      return 'bg-purple-500/20 text-purple-300';
    case 'cancelled':
      return 'bg-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'În așteptare';
    case 'confirmed':
      return 'Confirmat';
    case 'rescheduled':
      return 'Reprogramat';
    case 'completed':
      return 'Finalizat';
    case 'cancelled':
      return 'Anulat';
    default:
      return status;
  }
};

export default function Admin() {
  const [currentView, setCurrentView] = useState<AdminView>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      await apiRequest("POST", "/api/admin/login", credentials);
    },
    onSuccess: () => {
      setCurrentView('dashboard');
      toast({
        title: "Succes!",
        description: "Te-ai conectat cu succes.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Date de autentificare invalide!",
        variant: "destructive",
      });
    },
  });

  // Fetch appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Programare[]>({
    queryKey: ["/api/appointments"],
    enabled: currentView !== 'login',
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery<{ today: number; week: number; month: number }>({
    queryKey: ["/api/admin/stats"],
    enabled: currentView !== 'login',
  });

  // Update appointment status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Succes!",
        description: "Statusul programării a fost actualizat.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul programării.",
        variant: "destructive",
      });
    },
  });

  // Delete appointment
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Succes!",
        description: "Programarea a fost ștearsă.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge programarea.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const handleDirectCall = (phoneNumber: string) => {
    // Open phone dialer with the patient's number
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleConfirmAppointment = (appointmentId: string) => {
    updateStatusMutation.mutate({
      id: appointmentId,
      status: 'confirmed'
    });
  };

  const handleDelete = (appointmentId: string) => {
    if (confirm('Sunteți sigur că doriți să ștergeți această programare?')) {
      deleteAppointmentMutation.mutate(appointmentId);
    }
  };

  const logout = () => {
    setCurrentView('login');
    setUsername('');
    setPassword('');
  };

  if (currentView === 'login') {
    return (
      <div className="fixed inset-0 bg-dark-primary flex items-center justify-center p-4">
        <div className="glass-morphism rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-4xl text-neon-blue mb-4">
              <Shield size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-neon-blue" data-testid="text-admin-login-title">Admin Login</h2>
            <p className="text-gray-400" data-testid="text-admin-login-subtitle">Acces securizat la panoul de administrare</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="floating-label">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" " 
                required 
                className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white focus:border-neon-blue focus:outline-none transition-colors"
                data-testid="input-admin-username"
              />
              <label>Utilizator</label>
            </div>
            
            <div className="floating-label relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" " 
                required 
                className="w-full bg-white/10 border border-white/20 rounded-lg p-4 pr-12 text-white focus:border-neon-blue focus:outline-none transition-colors"
                data-testid="input-admin-password"
              />
              <label>Parolă</label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-neon-blue to-electric-purple py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 neon-glow disabled:opacity-50"
              data-testid="button-admin-login"
            >
              {loginMutation.isPending ? '⏳ Conectare...' : (
                <>
                  <Shield className="inline mr-2" size={20} />
                  Conectează-te
                </>
              )}
            </button>
            
            <a 
              href="/"
              className="block w-full text-center glass-morphism py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300"
              data-testid="link-back-to-site"
            >
              Înapoi la Site
            </a>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-primary to-dark-secondary">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="admin-sidebar w-64 p-6">
          <div className="text-2xl font-bold text-neon-blue mb-8" data-testid="text-admin-panel-title">
            <Shield className="inline mr-2" size={24} />
            Admin Panel
          </div>
          <nav className="space-y-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`block w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors ${currentView === 'dashboard' ? 'bg-neon-blue/20 text-neon-blue' : ''}`}
              data-testid="nav-dashboard"
            >
              <BarChart3 className="inline mr-3" size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('appointments')}
              className={`block w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors ${currentView === 'appointments' ? 'bg-neon-blue/20 text-neon-blue' : ''}`}
              data-testid="nav-appointments"
            >
              <Calendar className="inline mr-3" size={20} />
              Programări
            </button>
            <button
              onClick={() => setCurrentView('exports')}
              className={`block w-full text-left p-3 rounded-lg hover:bg-white/10 transition-colors ${currentView === 'exports' ? 'bg-neon-blue/20 text-neon-blue' : ''}`}
              data-testid="nav-exports"
            >
              <Download className="inline mr-3" size={20} />
              Export
            </button>
            <button
              onClick={logout}
              className="block w-full text-left p-3 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="inline mr-3" size={20} />
              Logout
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-neon-blue" data-testid="text-dashboard-title">Dashboard Programări</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass-morphism rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Programări Astăzi</p>
                      <p className="text-2xl font-bold text-neon-blue" data-testid="stat-today">{stats?.today || 0}</p>
                    </div>
                    <div className="text-neon-blue text-3xl">
                      <Calendar size={36} />
                    </div>
                  </div>
                </div>
                
                <div className="glass-morphism rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Această Săptămână</p>
                      <p className="text-2xl font-bold text-electric-purple" data-testid="stat-week">{stats?.week || 0}</p>
                    </div>
                    <div className="text-electric-purple text-3xl">
                      <Calendar size={36} />
                    </div>
                  </div>
                </div>
                
                <div className="glass-morphism rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Luna</p>
                      <p className="text-2xl font-bold text-accent-cyan" data-testid="stat-month">{stats?.month || 0}</p>
                    </div>
                    <div className="text-accent-cyan text-3xl">
                      <Calendar size={36} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4" data-testid="text-chart-title">Evoluția Programărilor</h3>
                <div className="h-64 bg-gradient-to-r from-neon-blue/20 to-electric-purple/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-neon-blue mb-2 mx-auto" />
                    <p data-testid="text-chart-placeholder">Grafic Programări</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments View */}
          {currentView === 'appointments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-neon-blue" data-testid="text-appointments-title">Gestionare Programări</h2>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="bg-neon-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  data-testid="button-add-appointment"
                >
                  <Plus size={20} />
                  <span>Adaugă Programare</span>
                </button>
              </div>
              
              <div className="glass-morphism rounded-xl overflow-hidden">
                {appointmentsLoading ? (
                  <div className="p-8 text-center" data-testid="loading-appointments">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
                    <p>Se încarcă programările...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-400" data-testid="empty-appointments">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nu există programări disponibile</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="p-4 text-left">Pacient</th>
                          <th className="p-4 text-left">Contact</th>
                          <th className="p-4 text-left">Data & Ora</th>
                          <th className="p-4 text-left">Serviciu</th>
                          <th className="p-4 text-left">Status</th>
                          <th className="p-4 text-left">Acțiuni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {appointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-white/5" data-testid={`row-appointment-${appointment.id}`}>
                            <td className="p-4">
                              <div className="font-semibold" data-testid={`text-patient-name-${appointment.id}`}>{appointment.nume}</div>
                              <div className="text-sm text-gray-400" data-testid={`text-patient-message-${appointment.id}`}>{appointment.mesaj || 'Fără mesaj'}</div>
                            </td>
                            <td className="p-4">
                              <div data-testid={`text-patient-email-${appointment.id}`}>{appointment.email}</div>
                              <div className="text-sm text-gray-400" data-testid={`text-patient-phone-${appointment.id}`}>{appointment.telefon}</div>
                            </td>
                            <td className="p-4" data-testid={`text-appointment-date-${appointment.id}`}>
                              {new Date(appointment.dataProgramare).toLocaleString('ro-RO')}
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-neon-blue font-medium" data-testid={`text-service-${appointment.id}`}>
                                {appointment.serviciu || 'N/A'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`} data-testid={`status-${appointment.id}`}>
                                {getStatusLabel(appointment.status)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleDirectCall(appointment.telefon)}
                                  className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors"
                                  title="Sună Pacientul"
                                  data-testid={`button-call-${appointment.id}`}
                                >
                                  <Phone size={16} />
                                </button>
                                <button 
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    appointment.status === 'confirmed' 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  }`}
                                  title={appointment.status === 'confirmed' ? 'Confirmat' : 'Confirmă'}
                                  data-testid={`button-confirm-${appointment.id}`}
                                >
                                  <Check size={16} />
                                  {appointment.status === 'confirmed' && (
                                    <span className="ml-1 text-xs">Confirmat</span>
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleDelete(appointment.id)}
                                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors"
                                  title="Șterge"
                                  data-testid={`button-delete-${appointment.id}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Export View */}
          {currentView === 'exports' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-neon-blue" data-testid="text-exports-title">Export Programări</h2>
              
              <div className="glass-morphism rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Selectează Perioada</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">De la:</label>
                        <input 
                          type="date" 
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                          data-testid="input-date-from"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Până la:</label>
                        <input 
                          type="date" 
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                          data-testid="input-date-to"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4">Format Export</h3>
                    <div className="space-y-4">
                      <button className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors flex items-center justify-center" data-testid="button-export-excel">
                        <Download className="mr-3" size={20} />
                        Export Excel (.xlsx)
                      </button>
                      <button className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg transition-colors flex items-center justify-center" data-testid="button-export-pdf">
                        <Download className="mr-3" size={20} />
                        Export PDF
                      </button>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors flex items-center justify-center" data-testid="button-export-csv">
                        <Download className="mr-3" size={20} />
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
