import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";

export const convertDBResponseToLessonPlan = (data: LessonPlanResponse): LessonPlan => {
  return {
    id: data.id,
    title: data.title,
    content: data.content as { prompt: string; response: string },
    created_at: data.created_at,
    plan_type: data.plan_type as 'daily' | 'weekly'
  };
};