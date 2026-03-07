'use client';

import { cn } from '@/lib/utils';
import { Download, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ImageDisplayProps {
  imageBase64: string;
  prompt: string;
}

export function ImageDisplay({ imageBase64, prompt }: ImageDisplayProps) {
  const [copied, setCopied] = useState(false);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = `oe-ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyImage = async () => {
    try {
      const response = await fetch(`data:image/png;base64,${imageBase64}`);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  const openInNewTab = () => {
    const tab = window.open();
    if (tab) {
      tab.document.write(`
        <html>
          <head>
            <title>ØΞ AI - Generated Image</title>
            <style>
              body { 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                background: #050508; 
              }
              img { 
                max-width: 100%; 
                max-height: 100vh; 
                object-fit: contain; 
              }
            </style>
          </head>
          <body>
            <img src="data:image/png;base64,${imageBase64}" alt="${prompt}" />
          </body>
        </html>
      `);
      tab.document.close();
    }
  };

  return (
    <div className="message-bubble flex gap-4 px-4 py-4 group">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
        <span className="text-white text-sm">🎨</span>
      </div>
      
      {/* Image Container */}
      <div className="flex-1 max-w-[85%]">
        {/* Prompt Label */}
        <div className="mb-2 px-1">
          <span className="text-xs text-muted-foreground">Imagen generada para: </span>
          <span className="text-xs bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent font-medium">
            "{prompt.slice(0, 100)}{prompt.length > 100 ? '...' : ''}"
          </span>
        </div>
        
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden border border-pink-500/20 shadow-xl shadow-pink-500/10 group/img">
          <img 
            src={`data:image/png;base64,${imageBase64}`}
            alt={prompt}
            className="w-full h-auto max-h-[400px] object-contain bg-secondary/50"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={downloadImage}
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Descargar
                </Button>
                <Button
                  onClick={openInNewTab}
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Ver
                </Button>
              </div>
              <Button
                onClick={copyImage}
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Watermark */}
        <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground/50">
          <span>Creado con</span>
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-medium">
            ØΞ AI
          </span>
        </div>
      </div>
    </div>
  );
}
