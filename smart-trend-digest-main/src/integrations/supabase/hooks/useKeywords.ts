import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useToast } from '@/hooks/use-toast';

export interface Keyword {
  id: string;
  value: string;
  weight: number;
}

export const useKeywords = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keywords = [], isLoading } = useQuery({
    queryKey: ['keywords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('weight', { ascending: false });

      if (error) throw error;
      return data as Keyword[];
    },
  });

  const addKeyword = useMutation({
    mutationFn: async (keyword: Omit<Keyword, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');
      
      const { data, error } = await supabase
        .from('keywords')
        .insert([{ ...keyword, user_id: user.id }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
      toast({
        title: "키워드 추가됨",
        description: "새 키워드가 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "키워드 추가 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error adding keyword:', error);
    },
  });

  const deleteKeyword = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords'] });
      toast({
        title: "키워드 삭제됨",
        description: "키워드가 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "키워드 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error deleting keyword:', error);
    },
  });

  return {
    keywords,
    isLoading,
    addKeyword: addKeyword.mutate,
    deleteKeyword: deleteKeyword.mutate,
  };
};