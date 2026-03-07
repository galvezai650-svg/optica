'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  Crown, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Zap,
  Eye,
  EyeOff,
  ArrowLeft,
  DollarSign,
  MessageSquare,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Rocket
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  plan: 'BASIC' | 'PRO' | 'ULTRA';
  messageCount: number;
  imageCount: number;
  createdAt: string;
  payments: Payment[];
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  plan: 'BASIC' | 'PRO' | 'ULTRA';
  createdAt: string;
}

const PLAN_COLORS = {
  BASIC: 'bg-secondary text-muted-foreground',
  PRO: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  ULTRA: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30',
};

const PLAN_ICONS = {
  BASIC: null,
  PRO: Crown,
  ULTRA: Rocket,
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'payments'>('users');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error al autenticar');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [usersRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/payments'),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.payments || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handlePlanChange = async (userId: string, newPlan: 'BASIC' | 'PRO' | 'ULTRA') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: newPlan }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error changing plan:', error);
    }
  };

  const handlePaymentStatus = async (paymentId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background electric-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>

          <div className="bg-card/80 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Panel Admin
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Ingresa la clave de administrador
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Clave de administrador"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-purple-500/20 focus:border-purple-500/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                disabled={isLoading || !password}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                Acceder
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background electric-bg">
      {/* Header */}
      <header className="border-b border-purple-500/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ØΞ AI Admin
              </h1>
              <p className="text-xs text-muted-foreground">Panel de Administración</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="border-purple-500/30 hover:bg-purple-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b border-purple-500/10 bg-gradient-to-r from-purple-600/5 via-cyan-600/5 to-blue-600/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Usuarios</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.plan === 'PRO').length}</p>
                  <p className="text-xs text-muted-foreground">PRO</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.filter(u => u.plan === 'ULTRA').length}</p>
                  <p className="text-xs text-muted-foreground">ULTRA</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{payments.filter(p => p.status === 'PENDING').length}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${payments.filter(p => p.status === 'APPROVED').reduce((acc, p) => acc + p.amount, 0).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'outline'}
            className={activeTab === 'users' ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'border-purple-500/30'}
          >
            <Users className="w-4 h-4 mr-2" />
            Usuarios
          </Button>
          <Button
            onClick={() => setActiveTab('payments')}
            variant={activeTab === 'payments' ? 'default' : 'outline'}
            className={activeTab === 'payments' ? 'bg-gradient-to-r from-purple-600 to-cyan-600' : 'border-purple-500/30'}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Pagos
            {payments.filter(p => p.status === 'PENDING').length > 0 && (
              <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                {payments.filter(p => p.status === 'PENDING').length}
              </span>
            )}
          </Button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50 border-b border-purple-500/10">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Usuario</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Mensajes</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Imágenes</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Fecha</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const PlanIcon = PLAN_ICONS[user.plan];
                      return (
                        <tr key={user.id} className="border-b border-purple-500/5 hover:bg-secondary/20">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                                {user.name?.[0] || user.email[0].toUpperCase()}
                              </div>
                              <span className="font-medium truncate max-w-[100px]">{user.name || 'Sin nombre'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                            {user.email}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${PLAN_COLORS[user.plan]}`}>
                              {PlanIcon && <PlanIcon className="w-3 h-3" />}
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm hidden sm:table-cell">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-purple-400" />
                              {user.messageCount}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm hidden sm:table-cell">
                            <div className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-cyan-400" />
                              {user.imageCount}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <select
                              value={user.plan}
                              onChange={(e) => handlePlanChange(user.id, e.target.value as 'BASIC' | 'PRO' | 'ULTRA')}
                              className="bg-secondary border border-purple-500/20 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-purple-500/50"
                            >
                              <option value="BASIC">BASIC</option>
                              <option value="PRO">PRO</option>
                              <option value="ULTRA">ULTRA</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-8 text-center text-muted-foreground">
                No hay solicitudes de pago
              </div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`bg-card/50 backdrop-blur-sm border rounded-2xl p-4 ${
                    payment.status === 'PENDING' 
                      ? 'border-yellow-500/30 bg-yellow-500/5' 
                      : payment.status === 'APPROVED'
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        payment.status === 'PENDING' 
                          ? 'bg-yellow-500/20' 
                          : payment.status === 'APPROVED'
                          ? 'bg-green-500/20'
                          : 'bg-red-500/20'
                      }`}>
                        {payment.status === 'PENDING' && <Clock className="w-6 h-6 text-yellow-400" />}
                        {payment.status === 'APPROVED' && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                        {payment.status === 'REJECTED' && <XCircle className="w-6 h-6 text-red-400" />}
                      </div>
                      <div>
                        <p className="font-medium">{users.find(u => u.id === payment.userId)?.email || 'Usuario'}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ${payment.amount}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${PLAN_COLORS[payment.plan]}`}>
                            {PLAN_ICONS[payment.plan] && (() => {
                              const Icon = PLAN_ICONS[payment.plan]!;
                              return <Icon className="w-3 h-3" />;
                            })()}
                            Plan {payment.plan}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(payment.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {payment.status === 'PENDING' && (
                        <>
                          <Button
                            onClick={() => handlePaymentStatus(payment.id, 'APPROVED')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-500"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            onClick={() => handlePaymentStatus(payment.id, 'REJECTED')}
                            size="sm"
                            variant="destructive"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      {payment.status === 'APPROVED' && (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Aprobado - Plan {payment.plan}
                        </span>
                      )}
                      {payment.status === 'REJECTED' && (
                        <span className="flex items-center gap-1 text-red-400 text-sm">
                          <XCircle className="w-4 h-4" />
                          Rechazado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
