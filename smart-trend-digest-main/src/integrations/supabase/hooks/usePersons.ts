import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../client';
import { useToast } from '@/hooks/use-toast';

export interface Person {
  id: string;
  name: string;
  platform: string;
}

export const usePersons = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: persons = [], isLoading } = useQuery({
    queryKey: ['persons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Person[];
    },
  });

  const addPerson = useMutation({
    mutationFn: async (person: Omit<Person, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다');
      
      const { data, error } = await supabase
        .from('persons')
        .insert([{ ...person, user_id: user.id }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      toast({
        title: "인물 추가됨",
        description: "새 고가치 인물이 성공적으로 추가되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "인물 추가 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error adding person:', error);
    },
  });

  const deletePerson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      toast({
        title: "인물 삭제됨",
        description: "인물이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "오류 발생",
        description: "인물 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      console.error('Error deleting person:', error);
    },
  });

  return {
    persons,
    isLoading,
    addPerson: addPerson.mutate,
    deletePerson: deletePerson.mutate,
  };
};