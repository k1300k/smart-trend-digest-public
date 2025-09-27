import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  Sparkles,
  User,
  Globe,
  Hash,
  RefreshCw,
  Database,
  Trash2
} from "lucide-react";
import { useCollectedTrends } from "@/integrations/supabase/hooks/useCollectedTrends";
import { useKeywords } from "@/integrations/supabase/hooks/useKeywords";
import { useSources } from "@/integrations/supabase/hooks/useSources";
import { usePersons } from "@/integrations/supabase/hooks/usePersons";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrendItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceType: "high-value" | "normal";
  author?: string;
  timestamp: string;
  url: string;
  keywords: string[];
}

const Dashboard = () => {
  const [isCollecting, setIsCollecting] = useState(false);
  const { collectedTrends, isLoading: isLoadingCollected, deleteCollectedTrend } = useCollectedTrends();
  const { keywords } = useKeywords();
  const { sources } = useSources();
  const { persons } = usePersons();
  const { toast } = useToast();
  
  // Mock data for demonstration
  const [mockTrends] = useState<TrendItem[]>([
    {
      id: "1",
      title: "Tesla FSD V12.5 업데이트: 도심 자율주행 성능 대폭 개선",
      summary: "Tesla가 FSD V12.5 버전을 공개하며 도심 환경에서의 자율주행 정확도를 40% 향상시켰다고 발표. 신경망 기반 경로 예측 알고리즘이 핵심 개선사항으로 꼽힘.",
      source: "Tesla 공식 블로그",
      sourceType: "high-value",
      author: "Elon Musk",
      timestamp: "2시간 전",
      url: "https://tesla.com/blog",
      keywords: ["자율주행", "FSD", "Tesla"]
    },
    {
      id: "2",
      title: "Waymo, 샌프란시스코 로봇택시 서비스 지역 확대",
      summary: "Waymo가 샌프란시스코 전역으로 무인 택시 서비스를 확대. 일일 운행 횟수 10만회 돌파하며 상업화 가속화.",
      source: "Waymo 공식 발표",
      sourceType: "high-value",
      timestamp: "5시간 전",
      url: "https://waymo.com",
      keywords: ["로봇택시", "Waymo", "자율주행"]
    },
    {
      id: "3",
      title: "현대차, SDV 전환 가속화...2025년까지 전 차종 OTA 지원",
      summary: "현대자동차가 2025년까지 모든 신차에 OTA 업데이트 기능을 탑재하고 소프트웨어 정의 차량(SDV) 전환을 가속화한다고 발표.",
      source: "IT 뉴스",
      sourceType: "normal",
      timestamp: "8시간 전",
      url: "#",
      keywords: ["SDV", "OTA", "현대차"]
    }
  ]);

  // Generate person content based on registered persons
  const personContent = persons.map(person => {
    // Generate mock content for registered persons
    if (person.name === "@choi.openai" && person.platform === "Threads") {
      return {
        id: person.id,
        personName: person.name,
        platform: person.platform,
        content: "OpenAI의 최신 모델 업데이트가 곧 공개됩니다. 다중 모달 처리 능력이 크게 향상되었으며, 추론 속도도 2배 이상 빨라졌습니다. #AI #OpenAI",
        timestamp: "30분 전",
        url: `https://threads.net/${person.name.replace('@', '')}`,
        engagement: { likes: 23400, retweets: 5600, comments: 1200 }
      };
    }
    
    // Default content generation for other persons
    const contentTemplates = {
      "Threads": [
        { content: "최신 AI 기술 트렌드에 대한 인사이트를 공유합니다. 변화의 속도가 정말 빠르네요.", engagement: { likes: 8900, retweets: 2100, comments: 450 } },
        { content: "자율주행 기술의 발전이 예상보다 빠르게 진행되고 있습니다. 안전성이 최우선입니다.", engagement: { likes: 12500, retweets: 3200, comments: 890 } }
      ],
      "X (Twitter)": [
        { content: "Breaking: Major breakthrough in quantum computing announced today. This changes everything.", engagement: { likes: 45200, retweets: 8900, comments: 2100 } }
      ],
      "LinkedIn": [
        { content: "Excited to share our latest research findings on neural networks. The future is bright!", engagement: { likes: 15600, retweets: 4200, comments: 980 } }
      ]
    };
    
    const templates = contentTemplates[person.platform] || contentTemplates["Threads"];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      id: person.id,
      personName: person.name,
      platform: person.platform,
      content: template.content,
      timestamp: `${Math.floor(Math.random() * 12) + 1}시간 전`,
      url: person.platform === "Threads" ? `https://threads.net/${person.name.replace('@', '')}` :
           person.platform === "X (Twitter)" ? `https://x.com/${person.name.replace('@', '')}` :
           `https://linkedin.com/in/${person.name.replace('@', '')}`,
      engagement: template.engagement
    };
  });

  // Combine mock trends with collected trends
  const allTrends = [
    ...collectedTrends.map(ct => ({
      id: ct.id,
      title: ct.title,
      summary: ct.summary,
      source: ct.source,
      sourceType: ct.source_type,
      author: ct.author,
      timestamp: new Date(ct.collected_at).toLocaleString('ko-KR'),
      url: ct.url || '#',
      keywords: ct.keywords
    })),
    ...mockTrends
  ];

  const highValueTrends = allTrends.filter(t => t.sourceType === "high-value");
  const normalTrends = allTrends.filter(t => t.sourceType === "normal");

  const handleManualCollect = async () => {
    setIsCollecting(true);
    try {
      // Call Edge Function to collect trends from last 24 hours
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('인증이 필요합니다.');
      }

      const response = await supabase.functions.invoke('collect-trends', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "수집 완료",
        description: response.data.message || "최근 24시간 내 트렌드를 성공적으로 수집했습니다.",
      });

      // Refresh the collected trends
      window.location.reload();
    } catch (error) {
      console.error('Error collecting trends:', error);
      toast({
        title: "수집 실패",
        description: error instanceof Error ? error.message : "트렌드 수집 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsCollecting(false);
    }
  };

  const TrendCard = ({ trend }: { trend: TrendItem }) => (
    <Card className="glass p-6 hover:shadow-elevated transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {trend.sourceType === "high-value" && (
              <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                고가치
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Globe className="w-3 h-3" />
              {trend.source}
            </Badge>
            {trend.author && (
              <Badge variant="secondary" className="gap-1">
                <User className="w-3 h-3" />
                {trend.author}
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {trend.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {trend.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {trend.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  <Hash className="w-3 h-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {trend.timestamp}
              </span>
              <a 
                href={trend.url}
                className="flex items-center gap-1 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
                원문
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleManualCollect}
          disabled={isCollecting}
          className="gap-2"
        >
          {isCollecting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              수집 중...
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              수동 수집
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="all" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            전체 트렌드
          </TabsTrigger>
          <TabsTrigger value="high-value" className="gap-2">
            <Sparkles className="w-4 h-4" />
            고가치 이슈
          </TabsTrigger>
          <TabsTrigger value="normal" className="gap-2">
            <Globe className="w-4 h-4" />
            일반 트렌드
          </TabsTrigger>
          <TabsTrigger value="persons" className="gap-2">
            <User className="w-4 h-4" />
            고가치 인물
          </TabsTrigger>
          <TabsTrigger value="collected" className="gap-2">
            <Database className="w-4 h-4" />
            수집된 트렌드
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {allTrends.map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="high-value" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {highValueTrends.map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="normal" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {normalTrends.map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="persons" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {persons.length === 0 ? (
                <Card className="glass p-6 text-center">
                  <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">등록된 고가치 인물이 없습니다.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    설정에서 고가치 인물을 추가하세요.
                  </p>
                </Card>
              ) : personContent.length === 0 ? (
                <Card className="glass p-6 text-center">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                  <p className="text-muted-foreground">컨텐츠를 불러오는 중...</p>
                </Card>
              ) : (
                personContent.map((content) => (
                  <Card key={content.id} className="glass p-6 hover:shadow-elevated transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white border-0">
                            <User className="w-3 h-3 mr-1" />
                            {content.personName}
                          </Badge>
                          <Badge variant="secondary">
                            {content.platform}
                          </Badge>
                        </div>
                        
                        <p className="text-base mb-4 leading-relaxed">
                          {content.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              ❤️ {content.engagement.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              🔄 {content.engagement.retweets.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              💬 {content.engagement.comments.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {content.timestamp}
                            </span>
                            <a 
                              href={content.url}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              보기
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="collected" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {collectedTrends.length === 0 ? (
                <Card className="glass p-6 text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">아직 수집된 트렌드가 없습니다.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    수동 수집 버튼을 클릭하여 트렌드를 수집하세요.
                  </p>
                </Card>
              ) : (
                collectedTrends.map((trend) => (
                  <Card key={trend.id} className="glass p-6 hover:shadow-elevated transition-all duration-300 group">
...
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;