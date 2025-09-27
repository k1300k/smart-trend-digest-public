import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useToast } from '@/hooks/use-toast';

export interface Settings {
  email: string;
  send_time: string;
}

export const useSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Settings | null;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Settings) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');
      
      const { data: existing, error: selectError } = await supabase
        .from('settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') throw selectError;

      if (existing) {
        const { error } = await (supabase
          .from('settings') as any)
          .update({
            email: newSettings.email,
            send_time: newSettings.send_time
          })
          .eq('id', (existing as any).id);

        if (error) throw error;
      } else {
        const { error } = await (supabase
          .from('settings') as any)
          .insert([{
            email: newSettings.email,
            send_time: newSettings.send_time,
            user_id: user.id
          }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "설정 저장됨",
        description: "이메일 설정이 성공적으로 저장되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "설정 저장 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error updating settings:', error);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
  };
};