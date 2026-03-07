'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, Code, Sparkles, Heart, Rocket, Users, Calendar, Globe, Award, Lightbulb, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-purple-500/20 shadow-2xl shadow-purple-500/20">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center border-2 border-card animate-pulse">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Sobre ØΞ AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Historia */}
          <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl p-4 sm:p-5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Nuestra Historia
              </h3>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              <span className="text-purple-400 font-semibold">ØΞ AI</span> nació el <span className="text-cyan-400 font-semibold">6 de Marzo de 2026</span> como una idea repentina. 
              Lo que comenzó como un concepto innovador se transformó rápidamente en una plataforma revolucionaria 
              diseñada para <span className="text-foreground">empoderar a creadores de contenido</span> en todo el mundo.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground flex-wrap">
              <Calendar className="w-3 h-4 sm:w-4 sm:h-4 text-purple-400" />
              <span>Fundada el 6/03/2026</span>
              <Globe className="w-3 h-4 sm:w-4 sm:h-4 text-cyan-400 ml-2" />
              <span>Global</span>
            </div>
          </div>

          {/* Creadores */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Fundadores
              </h3>
            </div>

            {/* OSKITAR */}
            <div className="bg-secondary/50 rounded-2xl p-4 sm:p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
                  <span className="text-lg sm:text-2xl font-bold text-white">O</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 flex-wrap">
                    OSKITAR
                    <span className="text-[10px] sm:text-xs bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-2 py-0.5 rounded-full">Co-Founder</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-purple-400 mt-1">Fullstack Developer & Visionario Tech</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    <span className="text-[10px] sm:text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Code className="w-3 h-3" /> Fullstack
                    </span>
                    <span className="text-[10px] sm:text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Rocket className="w-3 h-3" /> Innovador
                    </span>
                    <span className="text-[10px] sm:text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Award className="w-3 h-3" /> Joven Talento
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                    Desarrollador fullstack apasionado por crear experiencias digitales excepcionales. 
                    Su visión tecnológica y creatividad impulsan la arquitectura y funcionalidad de ØΞ AI.
                  </p>
                </div>
              </div>
            </div>

            {/* EDU G. */}
            <div className="bg-secondary/50 rounded-2xl p-4 sm:p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
                  <span className="text-lg sm:text-2xl font-bold text-white">E</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 flex-wrap">
                    EDU G.
                    <span className="text-[10px] sm:text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-0.5 rounded-full">Co-Founder</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-cyan-400 mt-1">Programador Freelancer & Estratega</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                    <span className="text-[10px] sm:text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Code className="w-3 h-3" /> Freelancer
                    </span>
                    <span className="text-[10px] sm:text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Idea Original
                    </span>
                    <span className="text-[10px] sm:text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Users className="w-3 h-3" /> Convenio
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 leading-relaxed">
                    Programador freelancer con experiencia diversa. Tuvo la idea original el 6/03/2026 
                    y desde entonces ha sido pieza clave en el desarrollo estratégico del proyecto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Misión */}
          <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl p-4 sm:p-5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Nuestra Misión
              </h3>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Democratizar la creación de contenido mediante inteligencia artificial avanzada. 
              Ayudamos a creadores, influencers y empresas a generar ideas virales, scripts profesionales, 
              captions atractivas y miniaturas impactantes con solo un prompt.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-secondary/30 rounded-xl p-3 sm:p-4 border border-purple-500/10 text-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">IA Avanzada</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 sm:p-4 border border-cyan-500/10 text-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Generación Rápida</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 sm:p-4 border border-pink-500/10 text-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Hecho con Amor</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 sm:p-4 border border-blue-500/10 text-center">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs text-muted-foreground">Alcance Global</p>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="bg-secondary/30 rounded-xl p-3 sm:p-4 border border-purple-500/10">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium">Documentación</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/documentacion" onClick={() => onOpenChange(false)}>
                <Button variant="outline" size="sm" className="text-[10px] sm:text-xs border-purple-500/30 hover:bg-purple-500/10 h-8">
                  <FileText className="w-3 h-3 mr-1" />
                  Términos y Privacidad
                </Button>
              </Link>
              <Link href="/documentacion/api" onClick={() => onOpenChange(false)}>
                <Button variant="outline" size="sm" className="text-[10px] sm:text-xs border-cyan-500/30 hover:bg-cyan-500/10 h-8">
                  <Code className="w-3 h-3 mr-1" />
                  API Reference
                </Button>
              </Link>
            </div>
          </div>

          {/* Convenio */}
          <div className="text-center pt-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              <span className="text-purple-400">Convenio estratégico entre</span>
              <span className="text-foreground font-semibold"> OSKITAR</span>
              <span className="text-cyan-400"> & </span>
              <span className="text-foreground font-semibold">EDU G.</span>
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-1 flex items-center justify-center gap-1">
              <span>© 2026 ØΞ AI. Todos los derechos reservados.</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
