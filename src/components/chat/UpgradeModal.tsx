'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Check, 
  X, 
  ExternalLink, 
  Loader2,
  MessageSquare,
  Image as ImageIcon,
  Clock,
  MessageCircle,
  Rocket,
  Zap,
  Star,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useChatStore, Plan } from '@/stores/chat-store';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAYMENT_LINKS = {
  PRO: 'https://mpago.li/1pmRqCN',
  ULTRA: 'https://mpago.li/2WKm6JV',
};

const PLANS = {
  BASIC: {
    name: 'BASIC',
    price: 0,
    priceText: 'Gratis',
    icon: Zap,
    color: 'from-gray-500 to-gray-600',
    borderColor: 'border-gray-500/30',
    bgColor: 'bg-gray-500/5',
    features: [
      { text: '5 mensajes por día', included: true },
      { text: 'Modelo básico', included: true },
      { text: '2 imágenes por día', included: true },
      { text: 'Sin prioridad', included: false },
      { text: 'Historial de chats', included: false },
    ],
  },
  PRO: {
    name: 'PRO',
    price: 17,
    priceText: '$17 / mes',
    icon: Crown,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/5',
    paymentUrl: 'https://mpago.li/1pmRqCN',
    features: [
      { text: 'Chats ilimitados', included: true },
      { text: '10 imágenes por día', included: true },
      { text: 'Mejor modelo', included: true },
      { text: 'Historial de chats', included: true },
      { text: 'Velocidad mejorada', included: true },
    ],
  },
  ULTRA: {
    name: 'ULTRA',
    price: 29,
    priceText: '$29 / mes',
    icon: Rocket,
    color: 'from-purple-500 via-pink-500 to-orange-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    paymentUrl: 'https://mpago.li/2WKm6JV',
    features: [
      { text: 'Todo lo del PRO', included: true },
      { text: 'Modelo más avanzado', included: true },
      { text: 'Razonamiento más fuerte', included: true },
      { text: 'Imágenes ilimitadas', included: true },
      { text: 'Prioridad en servidores', included: true },
      { text: 'Nuevas funciones primero', included: true },
    ],
  },
};

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { user, setPendingPayment, pendingPayment } = useChatStore();
  const [isLoading, setIsLoading] = useState<Plan | null>(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>('PRO');

  const handleUpgrade = async (plan: 'PRO' | 'ULTRA') => {
    if (!user) return;
    
    setIsLoading(plan);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan }),
      });

      const data = await response.json();
      
      if (data.paymentUrl) {
        setPendingPayment(data.payment);
        setSelectedPlan(plan);
        setPaymentStarted(true);
        // Open payment URL in new tab - use direct URL from response
        const paymentUrl = PAYMENT_LINKS[plan] || data.paymentUrl;
        window.open(paymentUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const whatsappNumber = '5491123456789'; // Replace with actual number
  const whatsappMessage = encodeURIComponent('Hola! Quiero consultar sobre el estado de mi pago para el plan PRO/ULTRA de ØΞ AI');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/20">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-card animate-bounce">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl sm:text-3xl text-center bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Planes ØΞ AI
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Elige el plan perfecto para ti
          </p>
        </DialogHeader>

        <div className="mt-6">
          {/* Payment Started Status */}
          {paymentStarted && pendingPayment ? (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl p-6 border border-yellow-500/30 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-400 text-lg mb-1">
                    ¡Estamos aprobando tu transferencia!
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Plan: <strong className="text-foreground">{pendingPayment.plan}</strong> (${pendingPayment.amount})
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Tiempo máximo de espera: <strong className="text-foreground">24 horas</strong>
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Consultar estado por WhatsApp
                    </a>
                    <Button
                      onClick={() => {
                        setPaymentStarted(false);
                        onOpenChange(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs border-yellow-500/30 hover:bg-yellow-500/10"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Plans Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* BASIC Plan */}
              <div className={`relative rounded-2xl p-5 border ${PLANS.BASIC.borderColor} ${PLANS.BASIC.bgColor}`}>
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${PLANS.BASIC.color} flex items-center justify-center mb-3`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{PLANS.BASIC.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{PLANS.BASIC.priceText}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {PLANS.BASIC.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-red-400/50 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                {user?.plan === 'BASIC' && (
                  <div className="mt-4 text-center">
                    <span className="text-xs bg-secondary px-3 py-1 rounded-full text-muted-foreground">
                      Plan actual
                    </span>
                  </div>
                )}
              </div>

              {/* PRO Plan */}
              <div className={`relative rounded-2xl p-5 border-2 ${PLANS.PRO.borderColor} ${PLANS.PRO.bgColor} shadow-lg shadow-cyan-500/10`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${PLANS.PRO.color} flex items-center justify-center mb-3`}>
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{PLANS.PRO.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{PLANS.PRO.priceText}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {PLANS.PRO.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
                {user?.plan === 'PRO' ? (
                  <div className="text-center">
                    <span className="text-xs bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400">
                      Tu plan actual
                    </span>
                  </div>
                ) : user?.plan === 'BASIC' && (
                  <Button
                    onClick={() => handleUpgrade('PRO')}
                    disabled={isLoading !== null}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  >
                    {isLoading === 'PRO' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Crown className="w-4 h-4 mr-2" />
                    )}
                    Obtener PRO
                  </Button>
                )}
              </div>

              {/* ULTRA Plan */}
              <div className={`relative rounded-2xl p-5 border-2 ${PLANS.ULTRA.borderColor} ${PLANS.ULTRA.bgColor} shadow-lg shadow-purple-500/10`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    MÁXIMO
                  </span>
                </div>
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${PLANS.ULTRA.color} flex items-center justify-center mb-3`}>
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{PLANS.ULTRA.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{PLANS.ULTRA.priceText}</span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {PLANS.ULTRA.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
                {user?.plan === 'ULTRA' ? (
                  <div className="text-center">
                    <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-3 py-1 rounded-full text-purple-400">
                      Tu plan actual
                    </span>
                  </div>
                ) : user?.plan !== 'ULTRA' && (
                  <Button
                    onClick={() => handleUpgrade('ULTRA')}
                    disabled={isLoading !== null}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500"
                  >
                    {isLoading === 'ULTRA' ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Rocket className="w-4 h-4 mr-2" />
                    )}
                    Obtener ULTRA
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-purple-500/10">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Pagos seguros via Mercado Pago
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Activación en menos de 24h
              </span>
              <a href="/documentacion" className="text-purple-400 hover:underline">
                Términos de servicio
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
