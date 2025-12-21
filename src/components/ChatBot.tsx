import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  MessageCircle,
  Send,
  X,
  Car,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Define types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  location: string;
}

interface RentalData {
  id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your AI car technician assistant. How can I help you today? You can ask me about car maintenance, troubleshooting, or details about cars in our marketplace.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [carData, setCarData] = useState<CarData[]>([]);
  const [rentalData, setRentalData] = useState<RentalData[]>([]);
  const [userRentals, setUserRentals] = useState<any[]>([]);
  const [userCars, setUserCars] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_KEY =
    import.meta.env.VITE_GEMINI_API_KEY ||
    "AIzaSyBn-CHbkORD3gFb8uA1m30VTNVnnLYlrNw";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  // Suggested questions for users
  const suggestedQuestions = [
    "What cars are available in my area?",
    "How do I maintain a rental car?",
    "What should I check before renting a car?",
    "Can you tell me about my current rentals?",
    "What are the most fuel-efficient cars available?",
    "How often should I change oil in my car?",
  ];

  // Fetch data from Supabase on component mount
  useEffect(() => {
    getCurrentUser();
    fetchCarData();
    fetchRentalData();
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current user ID
  const getCurrentUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        fetchUserSpecificData(data.user.id);
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  // Fetch user-specific data
  const fetchUserSpecificData = async (uid: string) => {
    try {
      // Fetch user's rentals
      const { data: rentals, error: rentalsError } = await supabase
        .from("rentals")
        .select(
          `
          id, 
          start_date, 
          end_date, 
          status, 
          total_price,
          cars (id, make, model, year, location, image_url)
        `
        )
        .eq("renter_id", uid);

      if (rentalsError) throw rentalsError;
      setUserRentals(rentals || []);

      // Fetch user's cars
      const { data: cars, error: carsError } = await supabase
        .from("cars")
        .select("*")
        .eq("owner_id", uid);

      if (carsError) throw carsError;
      setUserCars(cars || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch car data from Supabase with more detailed information
  const fetchCarData = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(
          `
          id, 
          make, 
          model, 
          year, 
          location, 
          daily_rate, 
          available, 
          description,
          fuel_type,
          transmission,
          seats,
          image_url
        `
        )
        .eq("available", true); // Only fetch available cars

      if (error) throw error;
      setCarData(data || []);
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };

  // Fetch rental data from Supabase with more details
  const fetchRentalData = async () => {
    try {
      const { data, error } = await supabase.from("rentals").select(`
          id, 
          car_id, 
          start_date, 
          end_date, 
          status,
          total_price,
          cars (make, model, year, location)
        `);

      if (error) throw error;
      setRentalData(data || []);
    } catch (error) {
      console.error("Error fetching rental data:", error);
    }
  };

  // Refresh data when chat opens
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Refresh data when opening chat
      fetchCarData();
      fetchRentalData();
      if (userId) {
        fetchUserSpecificData(userId);
      }
    }
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle clicking a suggested question
  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    setShowSuggestions(false);
  };

  // Convert markdown formatting to HTML
  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold** -> <strong>bold</strong>
      .replace(
        /\* (.*?)(?=\n|$)/g,
        '<div style="margin-left: 10px; margin-bottom: 4px;">• $1</div>'
      ) // * item -> bullet point
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italic* -> <em>italic</em>
      .replace(/\n/g, "<br>"); // newlines -> <br>
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Hide suggestions after user asks first question
    if (showSuggestions) {
      setShowSuggestions(false);
    }

    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Add the user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Create a temporary assistant message for streaming
    const assistantMessageId = `ai-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    // Add the empty assistant message to show typing
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Refresh data before generating response to ensure latest information
      await Promise.all([
        fetchCarData(),
        fetchRentalData(),
        userId ? fetchUserSpecificData(userId) : Promise.resolve(),
      ]);

      // Prepare enhanced context about available cars
      const carContext =
        carData.length > 0
          ? carData
              .map(
                (car) =>
                  `Car: ${car.make} ${car.model} (${car.year})
                - Location: ${car.location}
                - Daily Rate: ₹${car.daily_rate}
                - Fuel Type: ${car.fuel_type || "Not specified"}
                - Transmission: ${car.transmission || "Not specified"}
                - Seats: ${car.seats || "Not specified"}
                - Description: ${car.description || "No description available"}
                - Available: ${car.available ? "Yes" : "No"}
                - ID: ${car.id}`
              )
              .join("\n\n")
          : "No cars are currently available in the marketplace.";

      const rentalContext =
        rentalData.length > 0
          ? rentalData
              .map(
                (rental) =>
                  `Rental: ${rental.cars?.make} ${rental.cars?.model} (${rental.cars?.year})
                - Location: ${rental.cars?.location}
                - Rental Period: ${rental.start_date} to ${rental.end_date}
                - Status: ${rental.status}
                - Total Price: ₹${rental.total_price}
                - Rental ID: ${rental.id}`
              )
              .join("\n\n")
          : "No active rentals in the system.";

      // Add user-specific rental context
      const userRentalContext =
        userRentals.length > 0
          ? userRentals
              .map(
                (rental) =>
                  `Your Rental: ${rental.id}, Car: ${rental.cars?.make} ${rental.cars?.model} (${rental.cars?.year}), ` +
                  `From: ${rental.start_date}, To: ${rental.end_date}, Status: ${rental.status}, Total: ₹${rental.total_price}`
              )
              .join("\n")
          : "You don't have any active rentals at the moment.";

      // Add user-specific car context
      const userCarContext =
        userCars.length > 0
          ? userCars
              .map(
                (car) =>
                  `Your Car: ${car.make} ${car.model} (${car.year}), Daily rate: ₹${car.daily_rate}, ` +
                  `Location: ${car.location}, Available: ${
                    car.available ? "Yes" : "No"
                  }`
              )
              .join("\n")
          : "You haven't listed any cars for rent yet.";

      // Get response from Gemini API with streaming
      const response = await fetch(`${API_URL}?key=${API_KEY}&alt=sse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are an AI car technician assistant for a car rental marketplace. 
                  Answer the following question based on the context provided.
                  
                  Context about available cars in the marketplace:
                  ${carContext}
                  
                  Context about general rentals:
                  ${rentalContext}

                  Context about this user's rentals:
                  ${userRentalContext}

                  Context about this user's cars listed on the platform:
                  ${userCarContext}
                  
                  Question: ${inputValue}
                  
                  Please respond in a helpful, personalized manner. If the information isn't in the context, 
                  provide general car advice but mention that the specific information isn't available. 
                  When responding about the user's own rentals or cars, use a more personal tone.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please wait a moment and try again."
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // Parse SSE format - each line starts with "data: "
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.substring(6);

            // Skip "[DONE]" message
            if (jsonString.trim() === "[DONE]") continue;

            try {
              const data = JSON.parse(jsonString);
              const textChunk =
                data.candidates?.[0]?.content?.parts?.[0]?.text || "";

              if (textChunk) {
                accumulatedResponse += textChunk;

                // Update the message with the accumulated response
                setMessages((prevMessages) =>
                  prevMessages.map((message) =>
                    message.id === assistantMessageId
                      ? { ...message, content: accumulatedResponse }
                      : message
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing streaming JSON:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);

      // Update the message with an error
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: error.message.includes("Rate limit")
                  ? "I'm currently experiencing high demand. Please wait a moment and try asking your question again."
                  : "I'm sorry, I encountered an error while processing your request. Please try again later.",
              }
            : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-xl shadow-2xl transition-all duration-300 transform z-40 overflow-hidden ${
          isChatOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Chat header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 flex justify-between items-center">
          <div className="flex items-center text-white">
            <Car className="h-5 w-5 mr-2" />
            <h3 className="font-bold">Car Technician AI</h3>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:text-indigo-200 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs sm:max-w-md ${
                  message.role === "user"
                    ? "bg-indigo-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      message.role === "assistant"
                        ? formatMessage(message.content)
                        : message.content,
                  }}
                />
                <p
                  className={`text-xs mt-1 ${
                    message.role === "user"
                      ? "text-indigo-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {showSuggestions && messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-1 px-3 rounded-full transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-3 flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 py-2 px-3 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`ml-2 p-2 rounded-full ${
              isLoading || !inputValue.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
            disabled={isLoading || !inputValue.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </>
  );
}
