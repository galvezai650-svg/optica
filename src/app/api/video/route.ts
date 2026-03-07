import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl, quality, duration, withAudio } = await request.json();

    if (!prompt && !imageUrl) {
      return NextResponse.json(
        { error: 'Se requiere un prompt o una imagen para generar el video' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Create video generation task
    const task = await zai.video.generations.create({
      prompt: prompt || undefined,
      image_url: imageUrl || undefined,
      quality: quality || 'speed', // 'speed' or 'quality'
      with_audio: withAudio || false,
      duration: duration || 5, // 5 or 10 seconds
      fps: 30,
    });

    console.log('Video task created:', task.id, task.task_status);

    return NextResponse.json({
      success: true,
      taskId: task.id,
      status: task.task_status,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Error al generar el video' },
      { status: 500 }
    );
  }
}

// Poll for video status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId es requerido' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();
    const result = await zai.async.result.query(taskId);

    console.log('Video task status:', taskId, result.task_status);

    if (result.task_status === 'SUCCESS') {
      // Try multiple possible video URL fields
      const videoUrl = result.video_result?.[0]?.url ||
                      result.video_url ||
                      result.url ||
                      result.video;

      return NextResponse.json({
        success: true,
        status: 'SUCCESS',
        videoUrl: videoUrl,
      });
    } else if (result.task_status === 'FAIL') {
      return NextResponse.json({
        success: false,
        status: 'FAIL',
        error: 'La generación del video falló',
      });
    } else {
      return NextResponse.json({
        success: true,
        status: 'PROCESSING',
      });
    }
  } catch (error) {
    console.error('Video status check error:', error);
    return NextResponse.json(
      { error: 'Error al verificar el estado del video' },
      { status: 500 }
    );
  }
}
