import { useState } from "react";
import { Plus, TrendingUp, Settings, Mail, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Dashboard from "@/components/Dashboard";
import SettingsPanel from "@/components/SettingsPanel";
import ReportPreview from "@/components/ReportPreview";
import Header from "@/components/Header";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings" | "reports">("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "dashboard" ? "default" : "secondary"}
            onClick={() => setActiveTab("dashboard")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            대시보드
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "secondary"}
            onClick={() => setActiveTab("settings")}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            설정 관리
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "secondary"}
            onClick={() => setActiveTab("reports")}
            className="gap-2"
          >
            <Mail className="w-4 h-4" />
            리포트
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">활성 키워드</p>
                <p className="text-2xl font-bold gradient-text">12</p>
              </div>
              <Target className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
          
          <Card className="glass p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">오늘 수집</p>
                <p className="text-2xl font-bold gradient-text">248</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
          
          <Card className="glass p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">다음 발송</p>
                <p className="text-2xl font-bold gradient-text">07:00</p>
              </div>
              <Clock className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
          
          <Card className="glass p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">구독자</p>
                <p className="text-2xl font-bold gradient-text">5</p>
              </div>
              <Mail className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="animate-fadeIn">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "settings" && <SettingsPanel />}
          {activeTab === "reports" && <ReportPreview />}
        </div>
      </div>
    </div>
  );
};

export default Index;