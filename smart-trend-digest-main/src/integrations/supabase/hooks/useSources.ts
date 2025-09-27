import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useToast } from '@/hooks/use-toast';

export interface Source {
  id: string;
  name: string;
  url: string;
  type: 'blog' | 'news' | 'social';
}

export const useSources = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sources = [], isLoading } = useQuery({
    queryKey: ['sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Source[];
    },
  });

  const addSource = useMutation({
    mutationFn: async (source: Omit<Source, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');
      
      const { data, error } = await supabase
        .from('sources')
        .insert([{ ...source, user_id: user.id }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast({
        title: "소스 추가됨",
        description: "새 고가치 소스가 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "소스 추가 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error adding source:', error);
    },
  });

  const deleteSource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sources'] });
      toast({
        title: "소스 삭제됨",
        description: "소스가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "소스 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error deleting source:', error);
    },
  });

  return {
    sources,
    isLoading,
    addSource: addSource.mutate,
    deleteSource: deleteSource.mutate,
  };
};