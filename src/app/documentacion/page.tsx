'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  Scale, 
  Lock, 
  Eye,
  Cookie,
  Users,
  AlertTriangle,
  Globe,
  Mail,
  ChevronRight,
  Zap,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentacionPage() {
  const [activeSection, setActiveSection] = useState('terminos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'terminos', icon: FileText, title: 'Términos de Uso' },
    { id: 'privacidad', icon: Lock, title: 'Política de Privacidad' },
    { id: 'cookies', icon: Cookie, title: 'Política de Cookies' },
    { id: 'condiciones', icon: Scale, title: 'Condiciones de Servicio' },
    { id: 'derechos', icon: Shield, title: 'Derechos de Autor' },
    { id: 'contacto', icon: Mail, title: 'Contacto Legal' },
  ];

  return (
    <div className="min-h-screen bg-background electric-bg">
      {/* Header */}
      <header className="border-b border-purple-500/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              ØΞ AI
            </h1>
            <Zap className="w-4 h-4 text-cyan-400" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs md:text-sm">
                <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-purple-500/10 bg-gradient-to-r from-purple-600/10 via-cyan-600/10 to-blue-600/10">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 md:mb-4">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Documentación Legal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Centro de Documentación
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
            Términos legales, políticas de privacidad y condiciones de uso de ØΞ AI.
          </p>
          
          {/* Quick Links */}
          <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6">
            <Link href="/documentacion/api">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-sm">
                <FileText className="w-4 h-4 mr-2" />
                Documentación API
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Section Selector */}
      <div className="md:hidden border-b border-purple-500/10 bg-background/80 backdrop-blur-xl sticky top-[57px] z-40">
        <div className="px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-secondary/50 rounded-xl border border-purple-500/20"
          >
            <span className="flex items-center gap-2">
              {sections.find(s => s.id === activeSection)?.icon && (
                <>{(() => {
                  const Icon = sections.find(s => s.id === activeSection)!.icon;
                  return <Icon className="w-4 h-4 text-purple-400" />;
                })()}</>
              )}
              <span className="text-sm">{sections.find(s => s.id === activeSection)?.title}</span>
            </span>
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          
          {mobileMenuOpen && (
            <div className="mt-2 bg-card/95 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/10 text-foreground'
                        : 'hover:bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid md:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block md:col-span-1">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-foreground border border-purple-500/30'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3 space-y-6 md:space-y-8">
            {/* Términos de Uso */}
            {activeSection === 'terminos' && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Términos de Uso</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Última actualización: Marzo 2026</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none space-y-4 md:space-y-6 text-muted-foreground">
                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">1. Aceptación de los Términos</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Al acceder y utilizar ØΞ AI, usted acepta estar sujeto a estos términos de uso. 
                      Si no está de acuerdo con alguna parte de estos términos, no deberá utilizar nuestros servicios.
                      ØΞ AI es una plataforma propiedad de <strong className="text-purple-400">OSKITAR</strong> y 
                      <strong className="text-cyan-400"> EDU G.</strong>, fundada el 6 de Marzo de 2026.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">2. Descripción del Servicio</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      ØΞ AI proporciona servicios de inteligencia artificial para la generación de contenido, 
                      incluyendo pero no limitado a: ideas virales, scripts para videos, captions para redes sociales, 
                      miniaturas y ganchos para contenido multimedia.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">3. Uso Aceptable</h3>
                    <ul className="text-xs md:text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>El usuario se compromete a utilizar el servicio de manera legal y ética.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Está prohibido generar contenido que viole derechos de terceros.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>No se permite el uso automatizado o de bots sin autorización previa.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>El contenido generado es responsabilidad del usuario final.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">4. Límites de Uso</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Los usuarios no registrados tienen un límite de <strong className="text-cyan-400">5 mensajes gratuitos</strong>. 
                      Para uso ilimitado, es necesario crear una cuenta. Nos reservamos el derecho de modificar 
                      estos límites en cualquier momento.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">5. Propiedad Intelectual</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      El contenido generado por ØΞ AI puede ser utilizado por el usuario para fines comerciales 
                      y personales. Sin embargo, la plataforma, su código fuente y diseño son propiedad exclusiva 
                      de los fundadores OSKITAR y EDU G.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Política de Privacidad */}
            {activeSection === 'privacidad' && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Política de Privacidad</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Última actualización: Marzo 2026</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6 text-muted-foreground">
                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">1. Datos que Recopilamos</h3>
                    <ul className="text-xs md:text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-foreground">Datos de registro:</strong> Email, nombre (opcional), contraseña (encriptada).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-foreground">Historial de chat:</strong> Conversaciones guardadas para mejorar el servicio.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-foreground">Datos de uso:</strong> Estadísticas anónimas de uso de la plataforma.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">2. Uso de los Datos</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Utilizamos sus datos para: proporcionar el servicio, mejorar la calidad de las respuestas, 
                      personalizar la experiencia, enviar notificaciones importantes y garantizar la seguridad de la plataforma.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">3. Protección de Datos</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos, 
                      incluyendo encriptación SSL/TLS, hashes seguros para contraseñas, y acceso restringido 
                      a datos personales.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">4. Sus Derechos</h3>
                    <ul className="text-xs md:text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Acceso a sus datos personales.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Rectificación de datos incorrectos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Eliminación de su cuenta y datos asociados.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Portabilidad de datos.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Política de Cookies */}
            {activeSection === 'cookies' && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Política de Cookies</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Última actualización: Marzo 2026</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6 text-muted-foreground">
                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-pink-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">¿Qué son las Cookies?</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita 
                      nuestro sitio web. Nos ayudan a proporcionar una mejor experiencia de usuario.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-pink-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Cookies que Utilizamos</h3>
                    <ul className="text-xs md:text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <Cookie className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-foreground">Cookies esenciales:</strong> Necesarias para el funcionamiento del servicio.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Cookie className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-foreground">Cookies de sesión:</strong> Mantienen su sesión activa.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Cookie className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                        <span><strong className="text-foreground">Cookies de preferencias:</strong> Guardan sus preferencias de uso.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-pink-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Gestión de Cookies</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la 
                      funcionalidad de la plataforma. Consulte la configuración de su navegador para más información.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Condiciones de Servicio */}
            {activeSection === 'condiciones' && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Condiciones de Servicio</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Última actualización: Marzo 2026</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6 text-muted-foreground">
                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-blue-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">1. Disponibilidad del Servicio</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Nos esforzamos por mantener el servicio disponible 24/7, pero no garantizamos disponibilidad 
                      ininterrumpida. Podemos realizar mantenimiento programado con aviso previo cuando sea posible.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-blue-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">2. Modificaciones</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios 
                      serán notificados a través de la plataforma o por correo electrónico.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-blue-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">3. Limitación de Responsabilidad</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      ØΞ AI proporciona contenido generado por IA. No nos hacemos responsables del uso final 
                      del contenido generado. El usuario es responsable de verificar la exactitud y legalidad 
                      del contenido antes de su uso.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-4 md:p-5 border border-purple-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">4. Terminación</h3>
                        <p className="text-xs md:text-sm leading-relaxed">
                          Podemos suspender o terminar cuentas que violen estos términos sin previo aviso.
                          El usuario también puede eliminar su cuenta en cualquier momento desde la configuración.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Derechos de Autor */}
            {activeSection === 'derechos' && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Derechos de Autor</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Última actualización: Marzo 2026</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6 text-muted-foreground">
                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Propiedad de la Plataforma</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      <strong className="text-purple-400">ØΞ AI</strong> y todos sus componentes (diseño, código, logotipos, 
                      nombres) son propiedad de <strong className="text-purple-400">OSKITAR</strong> y 
                      <strong className="text-cyan-400"> EDU G.</strong>. La plataforma está registrada y protegida 
                      bajo las leyes de propiedad intelectual aplicables.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Contenido Generado</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      El contenido generado por la IA puede ser utilizado libremente por el usuario. Sin embargo, 
                      no se garantiza la originalidad absoluta del contenido y el usuario debe verificar que no 
                      infrinja derechos de terceros.
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Licencia de Uso</h3>
                    <p className="text-xs md:text-sm leading-relaxed">
                      Al utilizar ØΞ AI, se le otorga una licencia limitada, no exclusiva y revocable para 
                      utilizar la plataforma de acuerdo con estos términos.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl p-4 md:p-5 border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">Fundadores</h4>
                        <p className="text-xs md:text-sm">
                          <span className="text-purple-400">OSKITAR</span> & 
                          <span className="text-cyan-400"> EDU G.</span> - Desde Marzo 2026
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contacto Legal */}
            {activeSection === 'contacto' && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Contacto Legal</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Para consultas legales y soporte</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6 text-muted-foreground">
                  <div className="bg-secondary/30 rounded-xl p-4 md:p-6 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Información de Contacto</h3>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm md:text-base">Correo Electrónico</p>
                          <p className="text-xs md:text-sm">legal@oeai.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 md:w-5 md:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm md:text-base">Sitio Web</p>
                          <p className="text-xs md:text-sm">www.oeai.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Horario de Atención</h3>
                    <p className="text-xs md:text-sm">
                      Lunes a Viernes: 9:00 AM - 6:00 PM (GMT-5)<br />
                      Respuesta estimada: 24-48 horas hábiles
                    </p>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-4 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3">Para Solicitudes de:</h3>
                    <ul className="text-xs md:text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Eliminación de datos personales (GDPR/LOPD)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Violación de derechos de autor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Consultas sobre términos legales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Colaboraciones y partnerships</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/10 bg-card/30 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
              © 2026 ØΞ AI. Todos los derechos reservados.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              Hecho con <span className="text-pink-400">♥</span> por{' '}
              <span className="text-purple-400">OSKITAR</span> & 
              <span className="text-cyan-400"> EDU G.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
