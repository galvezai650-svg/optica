import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Vision API - analyzes images using VLM for better understanding

export async function POST(request: NextRequest) {
  try {
    const { image, prompt, conversationHistory = [] } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    // Build the message content
    const content: any[] = [
      {
        type: 'text',
        text: prompt || 'Analiza esta imagen en detalle. Describe lo que ves, los colores, el estilo, y cualquier detalle relevante para un creador de contenido.'
      },
      {
        type: 'image_url',
        image_url: {
          url: image // Can be URL or base64 data URI
        }
      }
    ];

    // Build messages array
    const messages: any[] = [];
    
    // Add conversation history if provided
    if (conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }
    
    // Add current message with image
    messages.push({
      role: 'user',
      content: content
    });

    const response = await zai.chat.completions.createVision({
      messages: messages,
      thinking: { type: 'disabled' }
    });

    const analysis = response.choices[0]?.message?.content;

    return NextResponse.json({ 
      success: true,
      analysis: analysis 
    });
  } catch (error) {
    console.error('Vision analysis error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to analyze image' 
    }, { status: 500 });
  }
}
