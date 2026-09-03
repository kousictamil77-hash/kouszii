import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();
    const { stats, profile } = context;

    const lowerMessage = message.toLowerCase();
    
    let reply = "I'm your AI assistant! Try asking me about your calories burned, your streak, or how many workouts you've done.";

    if (lowerMessage.includes('calorie')) {
      reply = `You have burned a total of ${Math.round(stats?.total_calories_burned || 0)} kcal so far! Keep up the great work to reach your fitness goals.`;
    } else if (lowerMessage.includes('streak')) {
      reply = `You are currently on a ${stats?.current_streak || 0} day streak! 🔥 Consistent daily activity is key to improving your long-term health.`;
    } else if (lowerMessage.includes('workout') || lowerMessage.includes('total')) {
      reply = `You have completed ${stats?.total_workouts || 0} total workouts. That's a solid commitment to your SDG 3 goals!`;
    } else if (lowerMessage.includes('time') || lowerMessage.includes('minute')) {
      reply = `You've accumulated ${stats?.total_active_minutes || 0} total active minutes. The WHO recommends at least 150 minutes of moderate-intensity aerobic physical activity throughout the week.`;
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      reply = `Hello ${profile?.full_name || 'there'}! How can I help you analyze your fitness data today?`;
    } else if (lowerMessage.includes('goal')) {
      reply = `Your daily goal is set to ${profile?.daily_goal_minutes || 30} minutes. You've completed ${stats?.today_minutes || 0} minutes today.`;
    }

    // Simulate network delay to make it feel like AI
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
