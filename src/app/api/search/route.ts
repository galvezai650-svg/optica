import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Web Search API - searches the web for fashion, trends, and general information

export async function POST(request: NextRequest) {
  try {
    const { query, num = 10 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const results = await zai.functions.invoke('web_search', {
      query: query,
      num: Math.min(num, 20), // Limit to 20 results max
    });

    // Format results for better display
    const formattedResults = results.map((item: any, index: number) => ({
      position: index + 1,
      title: item.name,
      url: item.url,
      description: item.snippet,
      domain: item.host_name,
      date: item.date,
      favicon: item.favicon,
    }));

    return NextResponse.json({ 
      success: true,
      query: query,
      totalResults: formattedResults.length,
      results: formattedResults 
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to perform search' 
    }, { status: 500 });
  }
}
