import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";

export const convertDBResponseToLessonPlan = (data: LessonPlanResponse): LessonPlan => {
  const content = typeof data.content === 'string' 
    ? JSON.parse(data.content) 
    : data.content as { prompt: string; response: string };

  return {
    id: data.id,
    title: data.title,
    content,
    created_at: data.created_at,
    plan_type: data.plan_type as 'daily' | 'weekly'
  };
};