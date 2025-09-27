import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Send
} from "lucide-react";

interface ReportData {
  id: string;
  date: string;
  title: string;
  highValueItems: Array<{
    title: string;
    summary: string;
    source: string;
    url: string;
  }>;
  generalItems: Array<{
    title: string;
    summary: string;
    source: string;
    url: string;
  }>;
  stats: {
    totalArticles: number;
    highValueCount: number;
    keywords: string[];
  };
}

const ReportPreview = () => {
  const { toast } = useToast();
  
  const [selectedReport] = useState<ReportData>({
    id: "1",
    date: "2024-01-20",
    title: "AI 트렌드 리포트",
    highValueItems: [
      {
        title: "Tesla FSD V12.5 업데이트",
        summary: "도심 자율주행 정확도 40% 향상. 신경망 기반 경로 예측 알고리즘 도입.",
        source: "Tesla 공식 블로그",
        url: "https://tesla.com/blog"
      },
      {
        title: "Waymo 로봇택시 서비스 확대",
        summary: "샌프란시스코 전역 서비스 확대. 일일 운행 10만회 돌파.",
        source: "Waymo 발표",
        url: "https://waymo.com"
      }
    ],
    generalItems: [
      {
        title: "현대차 SDV 전환 가속화",
        summary: "2025년까지 전 차종 OTA 지원. 소프트웨어 중심 차량 개발.",
        source: "IT 뉴스",
        url: "#"
      },
      {
        title: "GM Cruise 운행 재개 준비",
        summary: "안전성 강화 후 단계적 서비스 재개 계획 발표.",
        source: "Tech News",
        url: "#"
      }
    ],
    stats: {
      totalArticles: 248,
      highValueCount: 12,
      keywords: ["자율주행", "로봇택시", "MaaS", "SDV"]
    }
  });

  const sendTestEmail = () => {
    toast({
      title: "테스트 이메일 발송됨",
      description: "설정된 이메일 주소로 리포트가 발송되었습니다.",
    });
  };

  const downloadReport = () => {
    toast({
      title: "리포트 다운로드 시작",
      description: "PDF 파일 다운로드가 시작되었습니다.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              {selectedReport.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedReport.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                오전 7:00 발송
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="secondary" className="gap-2" onClick={sendTestEmail}>
              <Send className="w-4 h-4" />
              테스트 발송
            </Button>
            <Button className="gap-2" onClick={downloadReport}>
              <Download className="w-4 h-4" />
              다운로드
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold gradient-text">{selectedReport.stats.totalArticles}</p>
            <p className="text-sm text-muted-foreground">전체 수집</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold gradient-text">{selectedReport.stats.highValueCount}</p>
            <p className="text-sm text-muted-foreground">고가치 이슈</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <p className="text-2xl font-bold gradient-text">{selectedReport.stats.keywords.length}</p>
            <p className="text-sm text-muted-foreground">활성 키워드</p>
          </div>
        </div>
      </Card>

      {/* Report Content Preview */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          리포트 미리보기
        </h3>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* High Value Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">고가치 이슈</h4>
                <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white border-0">
                  중요
                </Badge>
              </div>
              
              <div className="space-y-3">
                {selectedReport.highValueItems.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/30 border border-primary/20">
                    <h5 className="font-semibold mb-2">{item.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.source}</Badge>
                      <a 
                        href={item.url}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        원문 보기
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Trends Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <h4 className="text-lg font-semibold">일반 트렌드</h4>
              </div>
              
              <div className="space-y-3">
                {selectedReport.generalItems.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/30">
                    <h5 className="font-semibold mb-2">{item.title}</h5>
                    <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.source}</Badge>
                      <a 
                        href={item.url}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        원문 보기
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords Section */}
            <div>
              <h4 className="text-lg font-semibold mb-3">오늘의 키워드</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedReport.stats.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ReportPreview;