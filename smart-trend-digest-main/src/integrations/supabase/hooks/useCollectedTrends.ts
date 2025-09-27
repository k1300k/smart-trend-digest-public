import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface CollectedTrend {
  id: string;
  title: string;
  summary: string;
  source: string;
  source_type: 'high-value' | 'normal';
  author?: string;
  url?: string;
  keywords: string[];
  collected_at: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export const useCollectedTrends = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: collectedTrends = [], isLoading } = useQuery({
    queryKey: ['collected-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collected_trends')
        .select('*')
        .order('collected_at', { ascending: false });

      if (error) throw error;
      return data as CollectedTrend[];
    },
  });

  const collectTrends = useMutation({
    mutationFn: async (trends: Omit<CollectedTrend, 'id' | 'created_at' | 'updated_at' | 'collected_at' | 'user_id'>[]) => {
      if (!user) throw new Error('User not authenticated');
      
      const trendsWithUserId = trends.map(trend => ({
        ...trend,
        user_id: user.id
      }));
      
      const { data, error } = await supabase
        .from('collected_trends')
        .insert(trendsWithUserId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collected-trends'] });
      toast({
        title: "수집 완료",
        description: "트렌드 정보가 성공적으로 수집되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "수집 실패",
        description: "트렌드 수집 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error collecting trends:', error);
    },
  });

  const deleteCollectedTrend = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collected_trends')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collected-trends'] });
      toast({
        title: "삭제 완료",
        description: "수집된 트렌드가 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "삭제 실패",
        description: "트렌드 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error deleting trend:', error);
    },
  });

  return {
    collectedTrends,
    isLoading,
    collectTrends: collectTrends.mutate,
    deleteCollectedTrend: deleteCollectedTrend.mutate,
  };
};