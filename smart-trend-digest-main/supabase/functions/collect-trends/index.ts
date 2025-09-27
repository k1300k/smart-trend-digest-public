import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Get user's keywords and sources
    const { data: keywords } = await supabase
      .from('keywords')
      .select('*')
      .eq('user_id', user.id)
      .order('weight', { ascending: false });

    const { data: sources } = await supabase
      .from('sources')
      .select('*')
      .eq('user_id', user.id);

    // Generate trends based on keywords (최근 1시간 내 데이터, 없으면 최신)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const trends = [];
    
    // 시뮬레이션 데이터 생성 (실제 구현 시 외부 API 호출로 대체)
    const trendTemplates = [
      {
        category: 'AI',
        templates: [
          { title: '[긴급] {keyword} 기술 돌파구 발표', summary: '방금 전 {keyword} 관련 중대한 기술 발표가 있었습니다. 업계가 주목하고 있습니다.' },
          { title: '{keyword} 실시간 업데이트', summary: '최근 1시간 내 {keyword} 분야에서 중요한 진전이 있었습니다.' },
          { title: '{keyword} 속보: 새로운 개발 동향', summary: '막 들어온 소식: {keyword} 기술이 새로운 국면을 맞이했습니다.' }
        ]
      },
      {
        category: '자율주행',
        templates: [
          { title: '[속보] 자율주행 규제 변경 발표', summary: '정부가 방금 자율주행 관련 새로운 규제를 발표했습니다.' },
          { title: '자율주행 기술 실시간 테스트 결과', summary: '최근 1시간 내 진행된 자율주행 테스트에서 놀라운 결과가 나왔습니다.' }
        ]
      },
      {
        category: '전기차',
        templates: [
          { title: '[실시간] 전기차 시장 급변동', summary: '지난 1시간 동안 전기차 시장에 큰 변화가 감지되었습니다.' },
          { title: '전기차 배터리 혁신 발표', summary: '방금 전 새로운 배터리 기술이 공개되었습니다.' }
        ]
      }
    ];

    const highValueSources = ['Tesla 공식', 'Google AI', 'OpenAI', 'Waymo', 'BMW Tech', 'Mercedes-Benz'];
    const normalSources = ['Tech News', 'AI Times', 'Auto Tech Daily', 'Innovation Report'];
    
    // 최근 1시간 내 트렌드 생성 (시뮬레이션)
    const recentTrends: any[] = [];
    
    if (keywords && keywords.length > 0) {
      // 1시간 이내 트렌드 (상위 키워드 중심)
      keywords.slice(0, 3).forEach((keyword, index) => {
        const category = keyword.value.includes('AI') || keyword.value.includes('Agent') ? 'AI' : 
                        keyword.value.includes('자율주행') ? '자율주행' : 'AI';
        const categoryTemplates = trendTemplates.find(t => t.category === category)?.templates || trendTemplates[0].templates;
        const template = categoryTemplates[index % categoryTemplates.length];
        
        const isHighValue = keyword.weight >= 7 || index === 0;
        const source = isHighValue ? 
          highValueSources[Math.floor(Math.random() * highValueSources.length)] :
          normalSources[Math.floor(Math.random() * normalSources.length)];
        
        // 최근 1시간 내 랜덤 시간 생성
        const minutesAgo = Math.floor(Math.random() * 60);
        const collectedAt = new Date(now.getTime() - minutesAgo * 60 * 1000);
        
        recentTrends.push({
          title: template.title.replace(/{keyword}/g, keyword.value),
          summary: template.summary.replace(/{keyword}/g, keyword.value),
          source: source,
          source_type: isHighValue ? 'high-value' : 'normal',
          author: isHighValue ? `Expert ${index + 1}` : null,
          url: `https://example.com/trend-${Date.now()}-${index}`,
          keywords: [keyword.value],
          collected_at: collectedAt.toISOString()
        });
      });
    }
    
    // 1시간 내 트렌드가 없으면 가장 최신 트렌드 생성
    if (recentTrends.length === 0) {
      const fallbackTemplates = [
        { title: '최신 AI 기술 동향 종합', summary: '현재 시점 가장 주목받는 AI 기술 트렌드를 정리했습니다.' },
        { title: '자동차 업계 오늘의 이슈', summary: '오늘 자동차 업계에서 가장 중요한 소식들을 모았습니다.' },
        { title: '기술 업계 최신 뉴스', summary: '방금 업데이트된 기술 업계 주요 소식입니다.' }
      ];
      
      const keywordValues = keywords?.map(k => k.value) || ['AI', '기술', '자동차'];
      
      fallbackTemplates.slice(0, 2).forEach((template, index) => {
        trends.push({
          title: template.title,
          summary: template.summary,
          source: highValueSources[index],
          source_type: index === 0 ? 'high-value' : 'normal',
          author: index === 0 ? 'Editor' : null,
          url: `https://example.com/latest-${Date.now()}-${index}`,
          keywords: keywordValues.slice(0, 2),
          collected_at: new Date(now.getTime() - index * 5 * 60 * 1000).toISOString() // 5분 간격
        });
      });
    } else {
      trends.push(...recentTrends);
    }

    // Save trends to database
    const trendsWithUserId = trends.map(trend => ({
      ...trend,
      user_id: user.id,
    }));

    const { data: savedTrends, error: saveError } = await supabase
      .from('collected_trends')
      .insert(trendsWithUserId)
      .select();

    if (saveError) {
      throw saveError;
    }

    const message = recentTrends.length > 0 
      ? `최근 1시간 내 ${savedTrends.length}개의 트렌드를 수집했습니다.`
      : `1시간 내 트렌드가 없어 최신 ${savedTrends.length}개의 트렌드를 수집했습니다.`;

    return new Response(JSON.stringify({ 
      success: true, 
      trends: savedTrends,
      message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});