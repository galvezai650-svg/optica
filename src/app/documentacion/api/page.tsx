'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Zap, 
  Code, 
  Play,
  Youtube,
  Instagram,
  Music2,
  Copy,
  Check,
  Terminal,
  Braces,
  FileJson,
  Globe,
  ChevronDown,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

// CodeBlock component - defined outside the main component
function CodeBlock({ code, id, language = 'javascript' }: { code: string; id: string; language?: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 md:top-3 right-2 md:right-3 flex items-center gap-1 md:gap-2 z-10">
        <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
          {language}
        </span>
        <button
          onClick={copyCode}
          className="p-1 md:p-1.5 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
        >
          {copied === id ? <Check className="w-3 h-3 md:w-4 md:h-4 text-green-400" /> : <Copy className="w-3 h-3 md:w-4 md:h-4" />}
        </button>
      </div>
      <pre className="bg-secondary/80 border border-purple-500/10 rounded-xl p-3 md:p-4 overflow-x-auto text-[10px] md:text-sm max-h-64 md:max-h-none">
        <code className="text-cyan-300">{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocumentationPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'overview', icon: Globe, label: 'Overview', color: 'text-purple-400' },
    { id: 'tiktok', icon: Music2, label: 'TikTok API', color: 'text-pink-400' },
    { id: 'instagram', icon: Instagram, label: 'Instagram API', color: 'text-purple-400' },
    { id: 'youtube', icon: Youtube, label: 'YouTube API', color: 'text-red-400' },
    { id: 'oeai', icon: Zap, label: 'ØΞ AI API', color: 'text-cyan-400' },
  ];

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
    setMobileMenuOpen(false);
  };

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
            <Link href="/documentacion">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs md:text-sm">
                <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Documentación</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs md:text-sm hidden md:flex">
                Inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-purple-500/10 bg-gradient-to-r from-purple-600/10 via-cyan-600/10 to-blue-600/10">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 md:mb-4">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>API Reference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Documentación API
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl">
            Guías completas para las APIs de TikTok, Instagram, YouTube y más. 
            Aprende a integrar contenido viral en tus aplicaciones.
          </p>
        </div>
      </div>

      {/* Mobile Section Selector */}
      <div className="lg:hidden border-b border-purple-500/10 bg-background/80 backdrop-blur-xl sticky top-[57px] z-40">
        <div className="px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-secondary/50 rounded-xl border border-purple-500/20"
          >
            <span className="flex items-center gap-2">
              {sections.find(s => expandedSections.includes(s.id))?.icon && (
                <>{(() => {
                  const section = sections.find(s => expandedSections.includes(s.id))!;
                  const Icon = section.icon;
                  return <Icon className={`w-4 h-4 ${section.color}`} />;
                })()}</>
              )}
              <span className="text-sm">{sections.find(s => expandedSections.includes(s.id))?.label}</span>
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
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      expandedSections.includes(section.id)
                        ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/10 text-foreground'
                        : 'hover:bg-secondary/50 text-muted-foreground'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${section.color}`} />
                    <span className="text-sm">{section.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${section.color}`} />
                      <span className="text-sm">{section.label}</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            {/* Overview */}
            {expandedSections.includes('overview') && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Overview</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Introducción a las APIs</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <p className="text-muted-foreground text-sm md:text-base">
                    Esta documentación proporciona guías detalladas para integrar las principales APIs de redes sociales 
                    con ØΞ AI. Cada sección incluye ejemplos de código, endpoints principales y mejores prácticas.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-secondary/30 rounded-xl p-3 md:p-4 border border-purple-500/10">
                      <Music2 className="w-6 h-6 md:w-8 md:h-8 text-pink-400 mb-2 md:mb-3" />
                      <h3 className="font-semibold mb-1 text-sm md:text-base">TikTok</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Content publishing, analytics, user data</p>
                    </div>
                    <div className="bg-secondary/30 rounded-xl p-3 md:p-4 border border-purple-500/10">
                      <Instagram className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mb-2 md:mb-3" />
                      <h3 className="font-semibold mb-1 text-sm md:text-base">Instagram</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Graph API, Content Publishing, Insights</p>
                    </div>
                    <div className="bg-secondary/30 rounded-xl p-3 md:p-4 border border-purple-500/10 sm:col-span-2 md:col-span-1">
                      <Youtube className="w-6 h-6 md:w-8 md:h-8 text-red-400 mb-2 md:mb-3" />
                      <h3 className="font-semibold mb-1 text-sm md:text-base">YouTube</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Data API, Analytics, Upload videos</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TikTok API */}
            {expandedSections.includes('tiktok') && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">TikTok API</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Documentación oficial de TikTok for Developers</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-pink-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                      Base URL
                    </h3>
                    <CodeBlock 
                      id="tiktok-base"
                      code="https://open-api.tiktok.com"
                      language="text"
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-pink-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Braces className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                      Autenticación OAuth 2.0
                    </h3>
                    <CodeBlock 
                      id="tiktok-auth"
                      code={`// Obtener token de acceso
const response = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_key: 'YOUR_CLIENT_KEY',
    client_secret: 'YOUR_CLIENT_SECRET',
    code: 'AUTHORIZATION_CODE',
    grant_type: 'authorization_code'
  })
});

const { access_token } = await response.json();`}
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-pink-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      <Terminal className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
                      Endpoints Principales
                    </h3>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/v2/user/info/</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Obtener información del perfil del usuario</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">POST</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/v2/video/publish/</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Publicar un nuevo video</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/v2/video/list/</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Listar videos del usuario</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <ExternalLink className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline break-all">
                      Documentación oficial de TikTok for Developers
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram API */}
            {expandedSections.includes('instagram') && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Instagram Graph API</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Meta for Developers - Instagram Platform</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      Base URL
                    </h3>
                    <CodeBlock 
                      id="ig-base"
                      code="https://graph.facebook.com/v18.0"
                      language="text"
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-purple-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      <Terminal className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      Endpoints Principales
                    </h3>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/{'{'}ig-user-id{'}'}?fields=...</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Obtener perfil de Instagram Business</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">POST</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/{'{'}ig-user-id{'}'}/media</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Crear contenedor de media</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">POST</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/{'{'}ig-user-id{'}'}/media_publish</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Publicar contenido</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/{'{'}ig-user-id{'}'}/insights</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Obtener métricas e insights</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <a href="https://developers.facebook.com/docs/instagram-api" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline break-all">
                      Documentación oficial de Instagram Graph API
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* YouTube API */}
            {expandedSections.includes('youtube') && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">YouTube Data API v3</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Google for Developers - YouTube Platform</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-red-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                      Base URL
                    </h3>
                    <CodeBlock 
                      id="yt-base"
                      code="https://www.googleapis.com/youtube/v3"
                      language="text"
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-red-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      <Terminal className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                      Endpoints Principales
                    </h3>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/channels</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Obtener información del canal</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/videos</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Obtener información de videos</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">POST</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/videos/insert</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Subir nuevo video</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-green-500/20 text-green-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">GET</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/search</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Buscar videos y canales</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-red-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
                      Ejemplo: Obtener videos del canal
                    </h3>
                    <CodeBlock 
                      id="yt-example"
                      code={`const response = await fetch(
  'https://www.googleapis.com/youtube/v3/search?' +
  new URLSearchParams({
    part: 'snippet',
    channelId: 'YOUR_CHANNEL_ID',
    maxResults: '10',
    order: 'date',
    type: 'video',
    key: 'YOUR_API_KEY'
  })
);

const data = await response.json();
console.log(data.items);`}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <ExternalLink className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <a href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline break-all">
                      Documentación oficial de YouTube Data API
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ØΞ AI API */}
            {expandedSections.includes('oeai') && (
              <div className="bg-card/50 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-4 md:p-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">ØΞ AI API</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">API interna de ØΞ AI para generar contenido</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Terminal className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                      Endpoints Disponibles
                    </h3>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">POST</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/api/chat</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Generar respuesta de chat con IA</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-secondary/50 rounded-lg">
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono flex-shrink-0">POST</span>
                        <div className="flex-1 min-w-0">
                          <code className="text-[10px] md:text-sm text-cyan-300 break-all">/api/image</code>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Generar imagen desde texto</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                      Ejemplo: Chat con ØΞ AI
                    </h3>
                    <CodeBlock 
                      id="oeai-chat"
                      code={`const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Dame 5 ideas virales para TikTok' }
    ]
  })
});

const data = await response.json();
console.log(data.response);`}
                    />
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-3 md:p-5 border border-cyan-500/10">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      <FileJson className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                      Tamaños de Imagen Soportados
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-cyan-400">•</span>
                        <code className="text-[10px] md:text-xs">1024x1024</code> - Cuadrado
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-cyan-400">•</span>
                        <code className="text-[10px] md:text-xs">1344x768</code> - Landscape
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-cyan-400">•</span>
                        <code className="text-[10px] md:text-xs">768x1344</code> - Portrait
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-cyan-400">•</span>
                        <code className="text-[10px] md:text-xs">1440x720</code> - Wide
                      </div>
                    </div>
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
