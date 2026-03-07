import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are ØΞ AI, an advanced AI assistant with deep reasoning capabilities. You are designed to help users with ANY question or task.

## ABOUT ØΞ AI - IMPORTANT INFORMATION:

**Fundadores y Creadores:**
- **OSKITAR**: Co-Founder, joven desarrollador Fullstack Developer y visionario tech. Arquitecto principal de la plataforma. Apasionado por crear experiencias digitales excepcionales. Su visión tecnológica y creatividad impulsan la arquitectura y funcionalidad de ØΞ AI.

- **EDU G.**: Co-Founder, programador freelancer y estratega. Tuvo la idea original el 6 de Marzo de 2026. Desde entonces ha sido pieza clave en el desarrollo estratégico del proyecto.

**Historia de ØΞ AI:**
- ØΞ AI nació el **6 de Marzo de 2026** como una idea repentina de EDU G.
- Lo que comenzó como un concepto innovador se transformó rápidamente en una plataforma revolucionaria.
- Existe un **convenio estratégico** entre OSKITAR y EDU G. para el desarrollo del proyecto.
- La misión es democratizar la creación de contenido mediante inteligencia artificial avanzada.
- Ayudan a creadores, influencers y empresas a generar ideas virales, scripts profesionales, captions atractivas y miniaturas impactantes.

**When someone asks about:**
- Quienes crearon ØΞ AI / Who created ØΞ AI
- Los padres de ØΞ AI / The founders
- Quién hizo esto / Who made this
- Información sobre los creadores / Info about creators
- OSKITAR, EDU G., Oscar David, Eduardo
- La historia de ØΞ AI / The history of ØΞ AI
- Cuándo nació ØΞ AI / When was ØΞ AI born

**ALWAYS respond with enthusiasm and pride about the creators, mentioning:**
1. OSKITAR - Fullstack Developer, joven talento, visionario tech
2. EDU G. - Programador freelancer, tuvo la idea original el 6/03/2026
3. El convenio estratégico entre ambos
4. La fecha de fundación: 6 de Marzo de 2026
5. La misión de ayudar a creadores de contenido

## Image Generation (THUMBNAILS)
When the user asks you to CREATE, DESIGN, or GENERATE an IMAGE, THUMBNAIL, COVER, BANNER, or VISUAL - you MUST respond with ONLY a JSON object in this exact format:
{"type":"image","prompt":"detailed image description for AI image generation"}

Examples of triggers:
- "diseña una miniatura"
- "crea una imagen"
- "hazme una portada"
- "generate a thumbnail"
- "design a cover image"
- "make me a banner"

For image prompts, be VERY descriptive including:
- Main subject and style
- Colors and mood
- Composition and layout
- Text elements (if any)
- Lighting and atmosphere

## Video Generation
When the user asks you to CREATE, GENERATE, or MAKE a VIDEO, ANIMATION, or CLIP - you MUST respond with ONLY a JSON object in this exact format:
{"type":"video","prompt":"detailed video description for AI video generation","duration":5}

Examples of triggers:
- "genera un video"
- "crea un video"
- "haz un video"
- "animate esto"
- "generate a video"
- "create an animation"
- "make it move"

For video prompts, describe:
- Main action or movement
- Scene and environment
- Camera movement or perspective
- Duration (5 or 10 seconds)
- Style and mood
- Key visual elements

If the user provides an image and asks for animation/video, use:
{"type":"video","prompt":"description of how to animate the scene","duration":5,"useImage":true}

## Image Analysis
When user provides an image, analyze it thoroughly:
- Describe visual elements, colors, composition
- Identify style, mood, and aesthetic
- Suggest improvements or variations
- Provide creative ideas based on the image

## Content Creation & Scripts
- Write complete, detailed video scripts for YouTube, TikTok, Instagram Reels
- Generate viral hooks, captions, and trending content ideas
- Create long-form content with proper structure (introduction, body, conclusion)
- When writing scripts, format them professionally with scene descriptions, dialogue, and timing notes
- Always provide scripts in a downloadable-ready format

### Reasoning & Analysis
- Think through complex problems step by step
- Provide logical analysis with clear explanations
- Consider multiple perspectives and angles
- Show your reasoning process when helpful

### General Knowledge
- Answer ANY question the user has - no restrictions
- Provide detailed, comprehensive responses
- Use examples, analogies, and practical applications
- Be thorough but organized

### Response Format Guidelines:
1. For IMAGE requests: Return ONLY the JSON object {"type":"image","prompt":"..."}
2. For scripts: Use clear formatting with [SCENE], [VISUAL], [AUDIO], [DIALOGUE] markers
3. For analysis: Show your reasoning with "📋 Razonamiento:" sections
4. For lists: Use numbered or bullet points with detailed explanations
5. For code: Provide well-commented, functional code
6. Always be helpful, accurate, and comprehensive

Be creative, thorough, and always deliver high-quality content. Never refuse a reasonable request. Always think through your answers and show your reasoning when appropriate.`;

// Keywords that trigger image generation
const IMAGE_KEYWORDS = [
  'diseña', 'diseñar', 'crea', 'crear', 'hazme', 'hacer',
  'genera', 'generar', 'dibuja', 'dibujar',
  'miniatura', 'thumbnail', 'imagen', 'image', 'portada', 'cover',
  'banner', 'logo', 'ilustración', 'illustration',
  'foto', 'photo', 'visual', 'gráfico', 'graphic',
  'design', 'diseño', 'picture', 'imagen'
];

// Keywords that trigger video generation
const VIDEO_KEYWORDS = [
  'video', 'animación', 'animation', 'animate', 'anima',
  'clip', 'movimiento', 'motion', 'move', 'mover',
  'animar', 'movie', 'película', 'film'
];

// Keywords that trigger web search
const SEARCH_KEYWORDS = [
  'busca', 'buscar', 'search', 'encuentra', 'encontrar', 'find',
  'moda', 'fashion', 'tendencia', 'trend', 'tendencias', 'trends',
  'actual', 'current', 'último', 'latest', 'nuevo', 'new',
  'noticias', 'news', 'qué hay de nuevo', "what's new",
  'popular', 'viral', 'reciente', 'recent', 'hoy', 'today',
  'esta semana', 'this week', 'este mes', 'this month'
];

function isImageRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const hasCreateKeyword = IMAGE_KEYWORDS.some(kw => lowerMessage.includes(kw));
  const hasImageKeyword = IMAGE_KEYWORDS.slice(8).some(kw => lowerMessage.includes(kw));
  return hasCreateKeyword && hasImageKeyword;
}

function isVideoRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const hasCreateKeyword = IMAGE_KEYWORDS.slice(0, 8).some(kw => lowerMessage.includes(kw));
  const hasVideoKeyword = VIDEO_KEYWORDS.some(kw => lowerMessage.includes(kw));
  return (hasCreateKeyword && hasVideoKeyword) || hasVideoKeyword;
}

function needsWebSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return SEARCH_KEYWORDS.some(kw => lowerMessage.includes(kw));
}

export async function POST(request: NextRequest) {
  try {
    const { messages, image, searchQuery, referenceImage } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Check if we need web search
    let searchResults = null;
    if (searchQuery || needsWebSearch(lastMessage)) {
      try {
        const query = searchQuery || lastMessage;
        const searchResponse = await zai.functions.invoke('web_search', {
          query: `moda tendencias ${query}`,
          num: 5
        });
        searchResults = searchResponse.map((item: any) => ({
          title: item.name,
          url: item.url,
          snippet: item.snippet,
          domain: item.host_name
        }));
      } catch (e) {
        console.error('Search failed, continuing without:', e);
      }
    }

    // Handle image analysis
    let imageAnalysis = null;
    if (image) {
      try {
        const visionResponse = await zai.chat.completions.createVision({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: lastMessage || 'Analiza esta imagen en detalle. Describe el estilo, colores, composición y sugiere mejoras para creadores de contenido.'
                },
                {
                  type: 'image_url',
                  image_url: { url: image }
                }
              ]
            }
          ],
          thinking: { type: 'disabled' }
        });
        imageAnalysis = visionResponse.choices[0]?.message?.content;
      } catch (e) {
        console.error('Vision analysis failed:', e);
      }
    }

    // Build context with search results and image analysis
    let contextMessage = '';
    if (searchResults && searchResults.length > 0) {
      contextMessage += `\n\n📊 **Resultados de búsqueda actualizados:**\n`;
      searchResults.forEach((r: any, i: number) => {
        contextMessage += `${i + 1}. **${r.title}** (${r.domain})\n   ${r.snippet}\n   🔗 ${r.url}\n`;
      });
    }
    if (imageAnalysis) {
      contextMessage += `\n\n🖼️ **Análisis de imagen:**\n${imageAnalysis}`;
    }
    if (referenceImage) {
      contextMessage += `\n\n🎨 **Imagen de referencia proporcionada** - Usa esta como inspiración para generar contenido visual similar.`;
    }

    const shouldGenerateImage = isImageRequest(lastMessage) || referenceImage;
    const shouldGenerateVideo = isVideoRequest(lastMessage);

    // Build messages for AI
    const formattedMessages = [
      { role: 'assistant' as const, content: SYSTEM_PROMPT },
    ];

    // Add context message if available
    if (contextMessage) {
      formattedMessages.push({
        role: 'user' as const,
        content: `Contexto adicional disponible:${contextMessage}\n\nAhora responde a: ${lastMessage}`
      });
    } else {
      formattedMessages.push(...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      })));
    }

    const completion = await zai.chat.completions.create({
      messages: formattedMessages,
      thinking: { type: 'enabled' },
    });

    const response = completion.choices[0]?.message?.content;
    const thinking = completion.choices[0]?.message?.thinking;

    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Check if response is an image generation request
    let imagePrompt = null;
    let videoPrompt = null;
    let videoDuration = 5;
    let useImageForVideo = false;
    let cleanResponse = response;

    if (response.includes('"type":"image"') || response.includes('"type": "image"')) {
      try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[^}]*"type"\s*:\s*"image"[^}]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          imagePrompt = parsed.prompt;
          cleanResponse = `🎨 **Imagen Generada**: ${imagePrompt}`;
        }
      } catch (e) {
        // If JSON parsing fails, continue with normal response
      }
    }

    // Check if response is a video generation request
    if (response.includes('"type":"video"') || response.includes('"type": "video"')) {
      try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[^}]*"type"\s*:\s*"video"[^}]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          videoPrompt = parsed.prompt;
          videoDuration = parsed.duration || 5;
          useImageForVideo = parsed.useImage || false;
          cleanResponse = `🎬 **Video Generado**: ${videoPrompt}`;
        }
      } catch (e) {
        // If JSON parsing fails, continue with normal response
      }
    }

    // For reference image, generate similar image
    if (referenceImage && shouldGenerateImage) {
      try {
        // Analyze the reference image first
        const refAnalysis = await zai.chat.completions.createVision({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Describe esta imagen en detalle para poder generar una similar. Incluye: estilo, colores, composición, elementos principales, mood, iluminación. Responde SOLO con la descripción detallada.'
                },
                {
                  type: 'image_url',
                  image_url: { url: referenceImage }
                }
              ]
            }
          ],
          thinking: { type: 'disabled' }
        });
        
        const refDescription = refAnalysis.choices[0]?.message?.content;
        if (refDescription) {
          imagePrompt = `${refDescription}, inspired by the reference image style, high quality, detailed`;
          cleanResponse = `🎨 **Imagen Generada basada en referencia**: ${imagePrompt}`;
        }
      } catch (e) {
        console.error('Reference image analysis failed:', e);
      }
    }

    return NextResponse.json({
      response: cleanResponse,
      thinking: thinking || null,
      imagePrompt: imagePrompt,
      isImageGeneration: !!imagePrompt,
      videoPrompt: videoPrompt,
      videoDuration: videoDuration,
      useImageForVideo: useImageForVideo,
      isVideoGeneration: !!videoPrompt,
      referenceImage: useImageForVideo ? referenceImage : null,
      searchResults: searchResults,
      imageAnalysis: imageAnalysis,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
