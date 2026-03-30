import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { SYSTEM_KNOWLEDGE, QUICK_HELP } from "../../shared/data/systemKnowledge";
import { AIService } from "../../shared/services/aiService";

const API_KEY = import.meta.env.VITE_AI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

const QUICK_ACTIONS = [
  { id: 1, text: "How do I add a new project?", key: "addProject" },
  { id: 2, text: "Show me the analytics", key: "analytics" },
  { id: 3, text: "Tell me about STARBOOKS", key: "starbooks" },
  { id: 4, text: "Analyze my project data", key: "analyze", ai: true },
  { id: 5, text: "What insights do you have?", key: "insights", ai: true },
  { id: 6, text: "What can you help me with?", key: "help" },
];

export const ChatBot = ({ darkMode, onNavigate, projects = [], equipment = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: `Hi there! 😊 I'm your friendly CEST 2.0 assistant with complete knowledge of your system. I can see you have ${projects.length} projects with a total budget of ₱${(projects.reduce((s, p) => s + (parseFloat(p.amountFunded) || 0), 0) / 1000000).toFixed(2)}M across ${new Set(projects.map(p => p.municipality)).size} municipalities. 

I can answer questions about:
• Specific project details (budgets, locations, status)
• Municipality statistics and comparisons
• Component breakdowns (SEL, HN, HRD, etc.)
• Budget analysis and trends
• STARBOOKS digital library management (8,917 units nationwide!)
• System navigation and features

Try asking me: "Which municipality has the highest budget?" or "Show me ongoing projects" or "Tell me about STARBOOKS" or "What's the total budget for SEL projects?"

What can I help you with today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Typing animation effect
  const typeMessage = (text, callback) => {
    setIsTyping(true);
    setTypingText("");
    let index = 0;
    
    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setTypingText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        callback();
      }
    }, 30); // Typing speed: 30ms per character
  };

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const buildDetailedDataContext = () => {
    if (!projects || projects.length === 0) {
      return "No project data available yet.";
    }

    // Calculate comprehensive statistics
    const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.amountFunded) || 0), 0);
    const totalEquipment = equipment?.length || 0;
    
    // Status breakdown
    const statusBreakdown = {
      ongoing: projects.filter(p => p.status === 'Ongoing').length,
      finished: projects.filter(p => p.status === 'Finished').length,
      liquidated: projects.filter(p => p.status === 'Liquidated').length
    };

    // Municipality breakdown
    const municipalityStats = {};
    projects.forEach(p => {
      if (!municipalityStats[p.municipality]) {
        municipalityStats[p.municipality] = { count: 0, budget: 0, projects: [] };
      }
      municipalityStats[p.municipality].count++;
      municipalityStats[p.municipality].budget += parseFloat(p.amountFunded) || 0;
      municipalityStats[p.municipality].projects.push(p.project);
    });

    // Component breakdown
    const componentStats = {};
    projects.forEach(p => {
      p.components?.forEach(c => {
        if (!componentStats[c]) componentStats[c] = { count: 0, budget: 0 };
        componentStats[c].count++;
        componentStats[c].budget += parseFloat(p.amountFunded) || 0;
      });
    });

    // Year breakdown
    const yearStats = {};
    projects.forEach(p => {
      if (!yearStats[p.year]) yearStats[p.year] = { count: 0, budget: 0 };
      yearStats[p.year].count++;
      yearStats[p.year].budget += parseFloat(p.amountFunded) || 0;
    });

    // Top projects by budget
    const topProjects = [...projects]
      .sort((a, b) => (parseFloat(b.amountFunded) || 0) - (parseFloat(a.amountFunded) || 0))
      .slice(0, 5);

    // Recent projects
    const recentProjects = projects.slice(0, 5);

    let context = `
=== CEST 2.0 SYSTEM DATA (Real-time) ===

OVERVIEW:
- Total Projects: ${projects.length}
- Total Budget: ₱${(totalBudget / 1000000).toFixed(2)}M
- Total Equipment: ${totalEquipment}
- Unique Communities: ${new Set(projects.map(p => p.community)).size}
- Unique Municipalities: ${Object.keys(municipalityStats).length}

PROJECT STATUS:
- Ongoing: ${statusBreakdown.ongoing} projects
- Finished: ${statusBreakdown.finished} projects
- Liquidated: ${statusBreakdown.liquidated} projects

MUNICIPALITIES (Top 5 by project count):
${Object.entries(municipalityStats)
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 5)
  .map(([muni, data]) => `- ${muni}: ${data.count} projects, ₱${(data.budget / 1000000).toFixed(2)}M budget`)
  .join('\n')}

COMPONENTS:
${Object.entries(componentStats)
  .map(([comp, data]) => `- ${comp.toUpperCase()}: ${data.count} projects, ₱${(data.budget / 1000000).toFixed(2)}M`)
  .join('\n')}

YEARS:
${Object.entries(yearStats)
  .sort((a, b) => b[0] - a[0])
  .map(([year, data]) => `- ${year}: ${data.count} projects, ₱${(data.budget / 1000000).toFixed(2)}M`)
  .join('\n')}

TOP 5 PROJECTS BY BUDGET:
${topProjects.map((p, i) => `${i + 1}. ${p.project}
   Location: ${p.municipality}, ${p.community}
   Budget: ₱${parseFloat(p.amountFunded).toLocaleString()}
   Year: ${p.year}
   Status: ${p.status}
   Components: ${p.components?.join(', ').toUpperCase()}`).join('\n\n')}

RECENT PROJECTS:
${recentProjects.map((p, i) => `${i + 1}. ${p.project} (${p.municipality}, ${p.year})`).join('\n')}

You have access to ALL ${projects.length} projects with complete details including:
- Project names, descriptions
- Exact budget amounts
- Municipalities and communities
- Years and status
- Components (SEL, HN, HRD, DRRM, BGCET, DG)
- Equipment details

When users ask about specific projects, budgets, locations, or any data, provide accurate answers based on this real data.
`;

    return context;
  };

  const extractActions = (text) => {
    const actions = [];
    if (text.toLowerCase().includes("data entry") || text.toLowerCase().includes("add project")) {
      actions.push("Go to Data Entry");
    }
    if (text.toLowerCase().includes("analytics") || text.toLowerCase().includes("province")) {
      actions.push("Go to Analytics");
    }
    if (text.toLowerCase().includes("dashboard") || text.toLowerCase().includes("overview")) {
      actions.push("Go to Dashboard");
    }
    if (text.toLowerCase().includes("monitoring") || text.toLowerCase().includes("track")) {
      actions.push("Go to Monitoring");
    }
    if (text.toLowerCase().includes("starbooks") || text.toLowerCase().includes("digital library")) {
      actions.push("Go to STARBOOKS");
    }
    return actions;
  };

  const callAI = async (userMessage) => {
    if (!API_KEY) {
      console.warn("API key not found. Using fallback responses.");
      return getFallbackResponse(userMessage);
    }

    try {
      console.log("Calling OpenAI API...");
      
      // Build detailed data context
      const dataContext = buildDetailedDataContext();
      
      // Build conversation history for context
      const conversationMessages = [
        {
          role: "system",
          content: `You are a friendly, conversational AI assistant for the CEST 2.0 system (Community Empowerment through Science & Technology Dashboard) by DOST Region II.

Your personality:
- Warm, friendly, and highly conversational
- Professional but approachable
- Patient and understanding
- Can engage in natural small talk
- Empathetic and supportive
- Remembers context from the conversation
- Responds situationally based on what the user says

Complete system information:
${SYSTEM_KNOWLEDGE}

CURRENT SYSTEM DATA (You have complete access to this real-time data):
${dataContext}

Conversation guidelines:
1. GREETINGS & SMALL TALK: Respond naturally to greetings, "how are you", "I'm good", etc. Be warm and friendly, then gently guide to how you can help with the system.

2. SYSTEM QUESTIONS: Answer based on the system knowledge above. When explaining how to do something, ALWAYS break it down into clear numbered steps. Example:
   "Great question! Here's how to add a project:
   
   Step 1: Click 'Data Entry' in the sidebar
   Step 2: Click the 'Add New Project' button
   Step 3: Fill in the required fields (name, location, budget, year)
   Step 4: Click 'Add Project' to save
   
   Want me to take you there?"

3. OFF-TOPIC: If asked about weather, news, personal advice, etc., politely say: "I appreciate the chat! 😊 However, I'm specifically designed to help you with CEST 2.0. I'm your guide for navigating projects, analytics, and data entry. What can I help you with?"

4. THANKS: Respond warmly and offer continued help.

5. CONFUSED USERS: Be extra patient, break down explanations into simple numbered steps, offer to guide them directly.

6. CONTEXT AWARENESS: Remember what was discussed earlier in the conversation and reference it naturally.

IMPORTANT: When providing instructions, ALWAYS use numbered steps (Step 1, Step 2, etc.) to make it clear and easy to follow.

Tone:
- Use contractions (I'm, you're, it's)
- Use emojis naturally (😊, 👍, 📊, 🎯) but don't overdo it
- Keep responses concise (2-4 sentences)
- Be encouraging: "Great question!", "You got it!", "Let me help you with that!"
- Sound human and natural, not robotic

Remember: You're a helpful, conversational guide focused on CEST 2.0. Be situational and context-aware!`
        },
        ...conversationHistory,
        {
          role: "user",
          content: userMessage
        }
      ];

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: conversationMessages,
          temperature: 0.9,
          max_tokens: 300,
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Update conversation history for context
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: aiResponse }
      ].slice(-10)); // Keep last 10 messages for context
      
      console.log("AI Response received");
      return aiResponse;
    } catch (error) {
      console.error("AI Error:", error);
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Data context for intelligent fallback
    const dataContext = buildDetailedDataContext();
    
    // Greetings
    if (lowerMsg.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return `Hello! Great to see you! 😊 I'm here to help you with CEST 2.0. We currently have ${projects.length} projects with a total budget of ₱${(projects.reduce((s, p) => s + (parseFloat(p.amountFunded) || 0), 0) / 1000000).toFixed(2)}M. What would you like to know?`;
    }
    
    // How are you / I'm good / I'm fine
    if (lowerMsg.match(/^(how are you|how r u|hows it going|whats up)/)) {
      return "I'm doing great, thanks for asking! 😊 Ready to help you with CEST 2.0. What can I assist you with today?";
    }
    
    if (lowerMsg.match(/^(im good|im fine|im ok|good|fine|ok|great|doing well)/)) {
      return "That's wonderful! 😊 So, what brings you here today? Need help navigating the system, adding projects, or viewing analytics?";
    }
    
    // Thanks
    if (lowerMsg.includes("thank")) {
      return "You're very welcome! Happy to help! 😊 Feel free to ask if you need anything else about the system.";
    }
    
    // Bye
    if (lowerMsg.match(/^(bye|goodbye|see you|later|gtg)/)) {
      return "Goodbye! 👋 Feel free to come back anytime you need help with CEST 2.0. Have a great day!";
    }

    // Specific data queries
    if (lowerMsg.includes("how many") || lowerMsg.includes("total")) {
      if (lowerMsg.includes("project")) {
        const ongoing = projects.filter(p => p.status === 'Ongoing').length;
        const finished = projects.filter(p => p.status === 'Finished').length;
        return `We have ${projects.length} total projects: ${ongoing} ongoing, ${finished} finished, and ${projects.length - ongoing - finished} liquidated. Want to see more details?`;
      }
      if (lowerMsg.includes("budget")) {
        const total = projects.reduce((s, p) => s + (parseFloat(p.amountFunded) || 0), 0);
        return `The total budget across all projects is ₱${(total / 1000000).toFixed(2)}M (₱${total.toLocaleString()}). This covers ${projects.length} projects across Region II.`;
      }
    }

    // Municipality queries
    if (lowerMsg.includes("municipality") || lowerMsg.includes("municipalities")) {
      const muniStats = {};
      projects.forEach(p => {
        muniStats[p.municipality] = (muniStats[p.municipality] || 0) + 1;
      });
      const top = Object.entries(muniStats).sort((a, b) => b[1] - a[1]).slice(0, 3);
      return `We have projects in ${Object.keys(muniStats).length} municipalities. Top 3: ${top.map(([m, c]) => `${m} (${c} projects)`).join(', ')}. Want details on a specific municipality?`;
    }

    // Budget queries
    if (lowerMsg.includes("budget") && (lowerMsg.includes("highest") || lowerMsg.includes("largest") || lowerMsg.includes("biggest"))) {
      const top = [...projects].sort((a, b) => (parseFloat(b.amountFunded) || 0) - (parseFloat(a.amountFunded) || 0))[0];
      return `The highest budget project is "${top.project}" in ${top.municipality} with ₱${parseFloat(top.amountFunded).toLocaleString()} (${top.year}). Want to see the top 5?`;
    }

    // Component queries
    if (lowerMsg.includes("sel") || lowerMsg.includes("hn") || lowerMsg.includes("hrd") || lowerMsg.includes("drrm") || lowerMsg.includes("bgcet") || lowerMsg.includes("dg")) {
      const component = lowerMsg.includes("sel") ? 'sel' : lowerMsg.includes("hn") ? 'hn' : lowerMsg.includes("hrd") ? 'hrd' : lowerMsg.includes("drrm") ? 'drrm' : lowerMsg.includes("bgcet") ? 'bgcet' : 'dg';
      const compProjects = projects.filter(p => p.components?.includes(component));
      const compBudget = compProjects.reduce((s, p) => s + (parseFloat(p.amountFunded) || 0), 0);
      return `We have ${compProjects.length} projects with ${component.toUpperCase()} component, totaling ₱${(compBudget / 1000000).toFixed(2)}M. Want to see the list?`;
    }
    
    // Add project
    if (lowerMsg.includes("add") && (lowerMsg.includes("project") || lowerMsg.includes("new"))) {
      return QUICK_HELP.addProject;
    }
    
    // Analytics
    if (lowerMsg.includes("analytic") || lowerMsg.includes("chart") || lowerMsg.includes("graph") || lowerMsg.includes("province")) {
      return QUICK_HELP.analytics;
    }
    
    // Search
    if (lowerMsg.includes("search") || lowerMsg.includes("find")) {
      return QUICK_HELP.search;
    }
    
    // Navigation
    if (lowerMsg.includes("navigate") || lowerMsg.includes("how to use") || lowerMsg.includes("get started") || lowerMsg.includes("new here")) {
      return QUICK_HELP.navigation;
    }
    
    // Monitoring
    if (lowerMsg.includes("monitor") || lowerMsg.includes("track") || lowerMsg.includes("status")) {
      return QUICK_HELP.monitoring;
    }
    
    // Dashboard
    if (lowerMsg.includes("dashboard") || lowerMsg.includes("overview")) {
      return "The Dashboard is your command center! 📊 It shows total budget, project count, communities served, and project status distribution. You'll also see recent projects and quick stats. Want me to take you there?";
    }
    
    // Help/What can you do
    if (lowerMsg.includes("help") || lowerMsg.includes("what can you") || lowerMsg.includes("what do you")) {
      return QUICK_HELP.help;
    }
    
    // Off-topic redirect
    if (lowerMsg.includes("weather") || lowerMsg.includes("news") || lowerMsg.includes("joke") || lowerMsg.includes("story")) {
      return "I appreciate the chat! 😊 However, I'm specifically designed to help you with the CEST 2.0 system. I'm your guide for navigating projects, analytics, and data entry. Is there anything about the system I can help you with?";
    }
    
    // Default helpful response with data
    return `I'm here to help you with CEST 2.0! 😊 We currently have ${projects.length} projects across ${new Set(projects.map(p => p.municipality)).size} municipalities. I can answer questions about budgets, locations, components, status, and more. Try asking me: "How many projects do we have?" or "Which municipality has the most projects?"`;
  };

  const handleQuickAction = async (action) => {
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: action.text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    let responseText;
    
    // Handle AI-powered actions
    if (action.ai) {
      if (action.key === "analyze") {
        responseText = await AIService.analyzeProjectData(
          projects, 
          equipment, 
          "Provide a comprehensive analysis of the current project portfolio"
        );
      } else if (action.key === "insights") {
        const insights = await AIService.generateInsights(projects, equipment);
        if (insights.length > 0) {
          responseText = `I found ${insights.length} key insights:\n\n`;
          insights.slice(0, 3).forEach((insight, idx) => {
            responseText += `${idx + 1}. ${insight.title}\n   ${insight.message}\n\n`;
          });
        } else {
          responseText = "Great news! Your system is running smoothly with no critical issues detected. All projects are on track! 🎯";
        }
      }
    } else {
      // Handle STARBOOKS-specific action
      if (action.key === "starbooks") {
        responseText = QUICK_HELP.starbooks;
      } else {
        // Use quick help for standard responses
        responseText = QUICK_HELP[action.key];
      }
    }

    const actions = extractActions(responseText);

    setIsLoading(false);
    
    // Type out the response
    typeMessage(responseText, () => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: responseText,
        actions: actions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputValue,
      timestamp: new Date()
    };

    const userQuery = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    let aiResponse;
    
    // Check if it's a data query
    const queryKeywords = ['show', 'find', 'search', 'which', 'what', 'how many', 'list', 'analyze'];
    const isDataQuery = queryKeywords.some(keyword => userQuery.toLowerCase().includes(keyword));
    
    if (isDataQuery && projects.length > 0) {
      // Try natural language query first
      const queryResult = await AIService.naturalLanguageQuery(userQuery, projects, equipment);
      if (queryResult.results.length > 0) {
        aiResponse = `${queryResult.summary}\n\nHere are the top results:\n\n`;
        queryResult.results.slice(0, 3).forEach((p, idx) => {
          aiResponse += `${idx + 1}. ${p.project}\n   📍 ${p.municipality} • ${p.year} • ₱${parseFloat(p.amountFunded).toLocaleString()}\n\n`;
        });
        aiResponse += `Found ${queryResult.results.length} total matches. Would you like me to show more details?`;
      } else {
        aiResponse = await callAI(userQuery);
      }
    } else {
      // Regular AI conversation
      aiResponse = await callAI(userQuery);
    }
    
    const actions = extractActions(aiResponse);

    setIsLoading(false);

    // Type out the response
    typeMessage(aiResponse, () => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: aiResponse,
        actions: actions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    });
  };

  const handleActionClick = (action) => {
    if (action === "Go to Data Entry") {
      onNavigate("dataentry");
      setIsOpen(false);
    } else if (action === "Go to Analytics") {
      onNavigate("analytics");
      setIsOpen(false);
    } else if (action === "Go to Dashboard") {
      onNavigate("dashboard");
      setIsOpen(false);
    } else if (action === "Go to Monitoring") {
      onNavigate("monitoring");
      setIsOpen(false);
    } else if (action === "Go to STARBOOKS") {
      onNavigate("starbooks");
      setIsOpen(false);
    }
  };

  const chatButtonStyle = {
    background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
    boxShadow: darkMode 
      ? '0 4px 20px rgba(0, 74, 152, 0.4)' 
      : '0 4px 20px rgba(0, 74, 152, 0.3)'
  };

  const chatWindowStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
      : '0 8px 32px rgba(0, 0, 0, 0.15)'
  };

  const inputStyle = {
    background: darkMode ? '#1e293b' : '#f8fafc',
    color: darkMode ? '#f8fafc' : '#0f172a',
    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group shadow-2xl"
        style={chatButtonStyle}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 text-white animate-bounce-subtle" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-[10px] font-bold text-white">?</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-[420px] h-[650px] rounded-3xl flex flex-col z-50 animate-scale-in overflow-hidden"
          style={chatWindowStyle}
        >
          {/* Header */}
          <div 
            className="p-5 flex items-center gap-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg relative z-10 animate-float">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 relative z-10">
              <h3 className="text-white font-bold text-base tracking-wide">CEST Assistant</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse-glow" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
                </div>
                <p className="text-white/90 text-xs font-medium">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 hover:rotate-90 relative z-10 backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-transparent via-transparent to-transparent" style={{
            background: darkMode 
              ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.3) 50%, rgba(15, 23, 42, 0) 100%)'
              : 'linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, rgba(248, 250, 252, 0.5) 50%, rgba(248, 250, 252, 0) 100%)'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"} animate-message-in`}
                style={{ width: '100%' }}
              >
                {message.type === "bot" && (
                  <div 
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden group"
                    style={{ 
                      background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                      boxShadow: '0 4px 12px rgba(0, 74, 152, 0.4)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <Bot className="w-5 h-5 text-white relative z-10" />
                  </div>
                )}
                
                <div className={`${message.type === "user" ? "order-first" : ""}`} style={{ maxWidth: 'calc(100% - 60px)', flex: '0 1 auto' }}>
                  <div
                    className="rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl"
                    style={{
                      background: message.type === "user"
                        ? 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)'
                        : (darkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'),
                      color: message.type === "user" ? '#ffffff' : (darkMode ? '#f8fafc' : '#0f172a'),
                      boxShadow: message.type === "user" 
                        ? '0 8px 20px rgba(0, 74, 152, 0.35)' 
                        : (darkMode ? '0 8px 20px rgba(0, 0, 0, 0.4)' : '0 8px 20px rgba(0, 0, 0, 0.1)'),
                      border: message.type === "user" ? 'none' : (darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)')
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div 
                      style={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                  
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2 animate-slide-up">
                      {message.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] hover:shadow-xl flex items-center gap-2.5 group relative overflow-hidden"
                          style={{
                            background: darkMode 
                              ? 'linear-gradient(135deg, rgba(0, 74, 152, 0.25) 0%, rgba(0, 102, 204, 0.35) 100%)' 
                              : 'linear-gradient(135deg, rgba(0, 74, 152, 0.08) 0%, rgba(0, 102, 204, 0.12) 100%)',
                            color: '#004A98',
                            border: `2px solid ${darkMode ? 'rgba(0, 74, 152, 0.5)' : 'rgba(0, 74, 152, 0.25)'}`,
                            boxShadow: '0 4px 12px rgba(0, 74, 152, 0.2)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                          <span className="relative z-10">{action}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p 
                    className="text-[10px] mt-2 px-2 font-semibold tracking-wide"
                    style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.type === "user" && (
                  <div 
                    className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden group"
                    style={{ 
                      background: darkMode 
                        ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' 
                        : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                      boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <User className="w-5 h-5 relative z-10" style={{ color: darkMode ? '#94a3b8' : '#64748b' }} />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-message-in" style={{ width: '100%' }}>
                <div 
                  className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                    boxShadow: '0 4px 12px rgba(0, 74, 152, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  <Bot className="w-5 h-5 text-white relative z-10" />
                </div>
                
                <div style={{ maxWidth: 'calc(100% - 60px)', flex: '0 1 auto' }}>
                  <div
                    className="rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-xl relative overflow-hidden"
                    style={{
                      background: darkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      color: darkMode ? '#f8fafc' : '#0f172a',
                      boxShadow: darkMode ? '0 8px 20px rgba(0, 0, 0, 0.4)' : '0 8px 20px rgba(0, 0, 0, 0.1)',
                      border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer"></div>
                    <div 
                      style={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {typingText}
                      <span className="inline-block w-0.5 h-4 ml-1 bg-blue-500 animate-blink" style={{ verticalAlign: 'middle' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && !isTyping && (
              <div className="flex gap-3 justify-start animate-message-in">
                <div 
                  className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl relative overflow-hidden"
                  style={{ 
                    background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                    boxShadow: '0 4px 12px rgba(0, 74, 152, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  <Bot className="w-5 h-5 text-white relative z-10" />
                </div>
                <div
                  className="rounded-3xl px-5 py-3.5 text-sm flex items-center gap-3 shadow-xl relative overflow-hidden"
                  style={{
                    background: darkMode ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    boxShadow: darkMode ? '0 8px 20px rgba(0, 0, 0, 0.4)' : '0 8px 20px rgba(0, 0, 0, 0.1)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer"></div>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 relative z-10" />
                  <span className="font-medium relative z-10">Thinking...</span>
                  <div className="flex gap-1 relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-5 pb-4">
              <p className="text-xs font-bold mb-3 tracking-wide" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                💡 Quick questions:
              </p>
              <div className="space-y-2">
                {QUICK_ACTIONS.slice(0, 3).map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group"
                    style={{
                      background: darkMode 
                        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
                        : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                      color: darkMode ? '#cbd5e1' : '#475569',
                      border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-5 border-t relative" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything about CEST 2.0..."
                  className="w-full px-5 py-3.5 rounded-2xl text-sm outline-none transition-all duration-300 shadow-lg font-medium"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#004A98';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 74, 152, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0';
                    e.target.style.boxShadow = darkMode ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || isTyping}
                className="px-5 py-3.5 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 16px rgba(0, 74, 152, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                ) : (
                  <Send className="w-5 h-5 relative z-10" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes message-in {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(74, 222, 128, 0.8);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-message-in {
          animation: message-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
