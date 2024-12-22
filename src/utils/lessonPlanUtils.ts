import { LessonPlan, LessonPlanResponse } from "@/types/lessonPlan";

export const convertDBResponseToLessonPlan = (data: LessonPlanResponse): LessonPlan => {
  let content;
  
  try {
    // If content is already an object, use it directly
    if (typeof data.content === 'object' && data.content !== null) {
      content = data.content;
    } 
    // If content is a string, try to parse it
    else if (typeof data.content === 'string') {
      content = JSON.parse(data.content);
    }
    // Fallback content structure
    else {
      content = {
        prompt: '',
        response: ''
      };
    }
  } catch (error) {
    console.error('Error parsing lesson plan content:', error);
    // Provide a fallback if parsing fails
    content = {
      prompt: String(data.content),
      response: ''
    };
  }

  return {
    id: data.id,
    title: data.title,
    content: content,
    created_at: data.created_at,
    plan_type: data.plan_type as 'daily' | 'weekly'
  };
};