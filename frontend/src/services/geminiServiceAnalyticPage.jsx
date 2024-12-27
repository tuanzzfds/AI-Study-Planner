import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from '../config/config';

const apiKey = config.geminiApiKey;

if (!apiKey) {
  console.error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeSchedule = async (tasks) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze this task schedule and provide feedback about:
    1. Potential burnout risks
    2. Schedule conflicts
    3. Priority optimization suggestions
    4. Work-life balance recommendations

    Tasks: ${JSON.stringify(tasks, null, 2)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing schedule:', error);
    throw error;
  }
};

export async function analyzeAnalytics(dailyData, taskStatusData, progressPercentage) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const analyticsContext = `
      Study Analytics Report:
      - Overall Progress: ${progressPercentage}% completion rate
      - Daily Study Time (minutes): ${dailyData.datasets[0].data.join(', ')}
      - Task Distribution:
        * Completed Tasks: ${taskStatusData.datasets[0].data[0]}
        * In Progress: ${taskStatusData.datasets[0].data[1]}
        * Overdue Tasks: ${taskStatusData.datasets[0].data[2]}
    `;

    const prompt = `As an educational analytics expert, analyze this study data and provide personalized feedback in the following format:

    1. Areas of Excellence:
       - Highlight strongest performance areas
       - Identify positive study patterns
       - Recognize achievements and milestones

    2. Growth Opportunities:
       - Subjects or tasks needing more attention
       - Specific areas for improvement
       - Suggested learning strategies

    3. Motivational Feedback:
       - Celebrate progress and achievements
       - Encourage consistency in successful habits
       - Provide positive reinforcement

    4. Action Steps:
       - 3 practical steps for improvement
       - Tips for maintaining momentum
       - Strategies for overcoming challenges

    Please analyze the following data:
    ${analyticsContext}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze analytics data');
  }
}
