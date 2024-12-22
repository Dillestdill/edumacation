import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";

export const convertDBResponseToLessonPlan = (data: LessonPlanResponse): LessonPlan => {
  let parsedContent;
  
  // Handle content parsing with error checking
  if (typeof data.content === 'string') {
    try {
      parsedContent = JSON.parse(data.content);
    } catch (error) {
      console.error('Error parsing content:', error);
      // Provide a default structure if parsing fails
      parsedContent = {
        prompt: data.content,
        response: ''
      };
    }
  } else {
    // If content is already an object, use it directly
    parsedContent = data.content as { prompt: string; response: string };
  }

  return {
    id: data.id,
    title: data.title,
    content: parsedContent,
    created_at: data.created_at,
    plan_type: data.plan_type as 'daily' | 'weekly'
  };
};