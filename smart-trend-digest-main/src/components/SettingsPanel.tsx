import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Save,
  Search,
  Globe,
  User,
  Mail,
  Clock,
  Trash2
} from "lucide-react";
import { useKeywords } from "@/integrations/supabase/hooks/useKeywords";
import { useSources } from "@/integrations/supabase/hooks/useSources";
import { usePersons } from "@/integrations/supabase/hooks/usePersons";
import { useSettings } from "@/integrations/supabase/hooks/useSettings";

const SettingsPanel = () => {
  const { toast } = useToast();
  
  // Supabase hooks
  const { keywords, isLoading: keywordsLoading, addKeyword, deleteKeyword } = useKeywords();
  const { sources, isLoading: sourcesLoading, addSource, deleteSource } = useSources();
  const { persons, isLoading: personsLoading, addPerson, deletePerson } = usePersons();
  const { settings, isLoading: settingsLoading, updateSettings } = useSettings();
  
  // Local state for form inputs
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordWeight, setNewKeywordWeight] = useState(5);
  const [newSource, setNewSource] = useState<{ name: string; url: string; type: "blog" | "news" | "social" }>({ name: "", url: "", type: "blog" });
  const [newPerson, setNewPerson] = useState({ name: "", platform: "" });
  const [email, setEmail] = useState("");
  const [sendTime, setSendTime] = useState("07:00");

  // Initialize email settings from database
  useEffect(() => {
    if (settings) {
      setEmail(settings.email);
      setSendTime(settings.send_time);
    }
  }, [settings]);

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword({
        value: newKeyword,
        weight: newKeywordWeight
      });
      setNewKeyword("");
      setNewKeywordWeight(5);
    }
  };

  const handleAddSource = () => {
    if (newSource.name && newSource.url) {
      addSource({
        name: newSource.name,
        url: newSource.url,
        type: newSource.type
      });
      setNewSource({ name: "", url: "", type: "blog" });
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name && newPerson.platform) {
      addPerson({
        name: newPerson.name,
        platform: newPerson.platform
      });
      setNewPerson({ name: "", platform: "" });
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      email,
      send_time: sendTime
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="keywords" className="gap-2">
            <Search className="w-4 h-4" />
            키워드 설정
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-2">
            <Globe className="w-4 h-4" />
            고가치 소스
          </TabsTrigger>
          <TabsTrigger value="persons" className="gap-2">
            <User className="w-4 h-4" />
            고가치 인물
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="w-4 h-4" />
            이메일 설정
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">핵심 키워드 관리</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="새 키워드 입력"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                />
                <Input
                  type="number"
                  placeholder="가중치"
                  value={newKeywordWeight}
                  onChange={(e) => setNewKeywordWeight(Number(e.target.value))}
                  className="w-24"
                  min={1}
                  max={10}
                />
                <Button onClick={handleAddKeyword} className="gap-2">
                  <Plus className="w-4 h-4" />
                  추가
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[300px]">
              {keywordsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {keywords.map((keyword) => (
                    <div key={keyword.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{keyword.value}</Badge>
                        <span className="text-sm text-muted-foreground">가중치: {keyword.weight}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteKeyword(keyword.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">고가치 소스 관리</h3>
            
            <div className="space-y-2 mb-4">
              <Input
                placeholder="소스 이름"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
              />
              <Input
                placeholder="URL"
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
              />
              <select
                className="w-full p-2 rounded-md border border-input bg-background"
                value={newSource.type}
                onChange={(e) => setNewSource({ ...newSource, type: e.target.value as "blog" | "news" | "social" })}
              >
                <option value="blog">블로그</option>
                <option value="news">뉴스</option>
                <option value="social">소셜</option>
              </select>
              <Button onClick={handleAddSource} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                소스 추가
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              {sourcesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-muted-foreground">{source.url}</p>
                        <Badge variant="secondary" className="mt-1">{source.type}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSource(source.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="persons" className="space-y-4">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">고가치 인물 관리</h3>
            
            <div className="space-y-2 mb-4">
              <Input
                placeholder="인물 이름"
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              />
              <select
                className="w-full p-2 rounded-md border border-input bg-background"
                value={newPerson.platform}
                onChange={(e) => setNewPerson({ ...newPerson, platform: e.target.value })}
              >
                <option value="">플랫폼 선택</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Threads">Threads</option>
                <option value="TikTok">TikTok</option>
                <option value="Blog">Blog</option>
              </select>
              <Button onClick={handleAddPerson} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                인물 추가
              </Button>
            </div>

            <ScrollArea className="h-[300px]">
              {personsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {persons.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.platform}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePerson(person.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">이메일 발송 설정</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">수신 이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">발송 시간</Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={sendTime}
                    onChange={(e) => setSendTime(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  매일 {sendTime}에 리포트가 자동 발송됩니다.
                </p>
              </div>

              <Button onClick={handleSaveSettings} className="w-full gap-2">
                <Save className="w-4 h-4" />
                설정 저장
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPanel;