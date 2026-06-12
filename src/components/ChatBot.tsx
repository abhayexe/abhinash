import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  MessageCircle,
  Send,
  X,
  Car,
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

// Demo Responses Dictionary
const MOCK_RESPONSES: Record<string, string[]> = {
  "What cars are available in my area?": [
    "Based on your current location, we have an excellent, diverse selection of vehicles ready for immediate pickup within a 2-mile radius. For everyday commuting, I can see a 2022 Honda Civic and a highly rated 2023 Toyota RAV4 available right now. We also have a few luxury options if you are looking for an upgrade. Would you like me to filter these results by a specific price range, seating capacity, or pickup distance?",
    "We have a fantastic variety of vehicles available in your immediate vicinity right now! Popular, easy-to-park choices nearby include a fuel-efficient Hyundai i20 and a spacious Ford EcoSport, both of which feature Apple CarPlay and Android Auto. Let me know if you need something specific—like an automatic transmission, AWD for a weekend getaway, or a 7-seater SUV for a family trip—and I will narrow down the map for you.",
    "Looking at our real-time local inventory, there is strong availability across both our economy and premium tiers. You could grab a quick, nimble Maruti Swift for zipping through city traffic, or ride in total comfort with a feature-loaded Kia Seltos. Most of the cars near you are available for instant booking with keyless app entry. What kind of trip are you planning, and how much cargo space will you need?"
  ],
  "How do I maintain a rental car?": [
    "Maintaining a rental car is wonderfully stress-free because we handle all the heavy mechanical maintenance! Your main focus should just be on the basics: keeping the interior reasonably clean, monitoring the dashboard for any unexpected warning lights, and refilling the gas tank (or recharging the battery) to the required level before returning it. If you ever notice a mechanical issue while driving, simply pull over safely and contact our 24/7 roadside assistance.",
    "For short-term rentals, your responsibilities are very straightforward. We ask that you keep the interior free of excessive trash or spills, ensure the tire pressure looks visually normal before long drives, and use the correct fuel type when filling up. If a check engine light or low tire pressure warning ever comes on, please do not attempt to fix it yourself or take it to a mechanic. Just give our support line a call immediately, and we will swap the vehicle out for you.",
    "It's pretty simple: just treat the rental like it's your own personal vehicle! This means strictly adhering to our no-smoking policy, keeping the cabin tidy, and returning it with the same fuel or charge level documented at the start of your trip. If you are on a long-term, multi-month rental, we will proactively reach out to you to schedule routine maintenance, such as oil changes and tire rotations, entirely at our expense and at a certified shop near you."
  ],
  "What should I check before renting a car?": [
    "That is a great question! Before driving off, always perform a thorough 360-degree exterior inspection. Take clear, well-lit photos or a continuous video of any existing scratches, dents, or windshield chips to ensure you aren't held responsible later. Additionally, verify that the current fuel level matches your rental agreement, ensure the air conditioning and headlights are functioning properly, and take a moment to familiarize yourself with the wiper and turn signal controls.",
    "Before you hit the road, I highly recommend a brief pre-trip checklist. First, verify the fuel gauge and dashboard mileage match your booking agreement. Second, check the tire treads and ensure there's no visible under-inflation. Third, look over the interior for any stains, odors, or damage. Finally, it is always a smart move to gently test the brakes in the parking lot, locate the hazard lights, and make sure you know exactly how to open the gas cap and trunk!",
    "I always recommend taking 3 to 5 minutes to get acquainted with your rental before leaving the lot. Photograph the car's exterior from all four corners, capturing the roof and wheels as well. Check the dashboard for any active warning lights and ensure the registration and insurance documents are present in the glovebox. Lastly, go ahead and pair your phone to the Bluetooth system before putting the car in drive so you can navigate and take calls safely hands-free."
  ],
  "Can you tell me about my current rentals?": [
    "I would be happy to pull up those details for you. Looking at your account dashboard, you currently have one active reservation for a Toyota Corolla. The booking is scheduled to end this Friday at 5:00 PM. Please ensure the vehicle is returned to the original pickup zone by that time, with a full tank of gas, to avoid any late return or refueling fees. If you realize you need the car for a bit longer, would you like me to check availability to extend this booking?",
    "Let me check your active itineraries. You currently have one ongoing rental, and everything looks perfectly in order on our end! Your mileage limit is set to 200 miles per day, and your premium insurance coverage is actively applied. Just a friendly reminder to return the car in a clean condition and with the fuel level matching what you started with. Let me know if you need directions back to the drop-off location.",
    "Sure thing! Your current rental is active, your payment has been processed successfully, and the account is in good standing. If your plans change and you need to make any modifications—such as extending your reservation by a few hours, upgrading your insurance tier, or adding an additional verified driver to the trip—you can do that instantly through your profile settings. I can also manually guide you through those changes right now if you prefer."
  ],
  "What are the most fuel-efficient cars available?": [
    "If maximizing fuel economy and minimizing your carbon footprint is your priority, I highly recommend exploring our hybrid and EV selection! Vehicles like the Toyota Prius and Honda City Hybrid are top choices, effortlessly switching between electric and gas power to offer excellent mileage for both stop-and-go city traffic and highway cruising. Let me know if you'd like me to filter your search exclusively for hybrid availability.",
    "For maximum fuel efficiency on a budget, you should definitely look into our lightweight compact hatchbacks or subcompact sedans. Cars like the Maruti Suzuki Swift or the Hyundai Grand i10 feature smaller, highly optimized engines that offer fantastic kilometers-per-liter ratios. They are incredibly cost-effective for daily city commutes, easy to park in tight spaces, and make for very budget-friendly road trips.",
    "We have a superb lineup of eco-friendly options to save you money at the pump! Our fleet includes fully electric vehicles (EVs) like the Tata Nexon EV, which offer zero tailpipe emissions and access to our partner charging networks. If you are planning a long-distance trip where charging might be scarce, a plug-in hybrid will give you the best of both worlds—electric power for short trips and a highly efficient gas engine for the long haul."
  ],
  "How often should I change oil in my car?": [
    "For a standard personal vehicle, a reliable rule of thumb is to change the oil every 5,000 to 7,500 miles, or at least once every 6 months, to keep the engine lubricated and running cool. However, if you are driving one of our rental vehicles, you don't need to worry about tracking this at all! Our automated fleet management system monitors the exact mileage of every car and our local teams handle all oil changes between bookings.",
    "Modern vehicles typically require an oil change every 5,000 to 10,000 miles, heavily depending on whether the engine utilizes full synthetic or conventional oil, as well as your typical driving conditions. If you're asking in regards to one of our rental vehicles, please rest assured that we perform rigorous preventative maintenance, including fluid flushes and filter replacements, ensuring the car is in peak condition before you even turn the key.",
    "The ideal interval depends greatly on the specific make and model, but generally falls between 5,000 and 8,000 miles. Driving in severe conditions—like extreme heat, heavy towing, or constant stop-and-go traffic—can shorten that lifespan. The good news is, if you are utilizing our car-sharing marketplace, all routine and preventative maintenance (including oil changes, brake pads, and tire rotations) is strictly mandated and entirely covered by the vehicle hosts!"
  ]
};

const FALLBACK_RESPONSES: string[] = [
  "Absolutely! While we focus on getting you behind the wheel, the ultimate solution to your needs starts with our incredible fleet. We currently have an outstanding selection of top-tier sedans and spacious SUVs ready for immediate pickup. Whether you need a fuel-efficient compact for city driving or a robust 4x4 for your next adventure, I have the perfect vehicle waiting for your reservation right now!",
  
  "Great question! Let's get straight to the best part: finding you the absolute best car for your journey. We have an extensive, fully inspected inventory available today, featuring everything from zippy eco-friendly hybrids to premium luxury rides. Let's get you set up with a vehicle that matches your exact style and budget—our top recommendations in your area are fueled up and ready to go!",
  
  "I have exactly what you need to keep moving forward! The best approach right now is to explore our premium rental options and secure your next ride. We offer seamless booking, comprehensive insurance packages, and an unmatched selection of pristine vehicles. From sporty hatchbacks to family-sized minivans, I am fully equipped to lock in your reservation and get you on the road in minutes!",
  
  "Amazing! Let me provide the perfect solution for your upcoming plans: our unmatched car rental marketplace! I can confidently handle all your transportation needs with our diverse, high-quality fleet. Whether you are looking for unbeatable daily rates on reliable commuters or specialized features like panoramic sunroofs and advanced cruise control, I can instantly match you with the ideal car today.",
  
  "Sure thing! The definitive answer to your travel needs is right here in our active inventory. I am here to guarantee you a flawless rental experience from start to finish. We are currently featuring fantastic deals on both short-term weekend getaways and long-term multi-month rentals. Let's skip the wait and get you into the driver's seat of one of our top-rated, meticulously maintained vehicles immediately!"
];

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions for users
  const suggestedQuestions = [
    "What cars are available in my area?",
    "How do I maintain a rental car?",
    "What should I check before renting a car?",
    "Can you tell me about my current rentals?",
    "What are the most fuel-efficient cars available?",
    "How often should I change oil in my car?",
  ];

  useEffect(() => {
    getCurrentUser();
    fetchCarData();
    fetchRentalData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const fetchUserSpecificData = async (uid: string) => {
    try {
      const { data: rentals, error: rentalsError } = await supabase
        .from("rentals")
        .select(`id, start_date, end_date, status, total_price, cars (id, make, model, year, location, image_url)`)
        .eq("renter_id", uid);

      if (rentalsError) throw rentalsError;
      setUserRentals(rentals || []);

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

  const fetchCarData = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`id, make, model, year, location, daily_rate, available, description, fuel_type, transmission, seats, image_url`)
        .eq("available", true);

      if (error) throw error;
      setCarData(data || []);
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };

  const fetchRentalData = async () => {
    try {
      const { data, error } = await supabase.from("rentals").select(`id, car_id, start_date, end_date, status, total_price, cars (make, model, year, location)`);

      if (error) throw error;
      setRentalData(data || []);
    } catch (error) {
      console.error("Error fetching rental data:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      fetchCarData();
      fetchRentalData();
      if (userId) fetchUserSpecificData(userId);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (question: string) => {
    // Simply populate the input box, it no longer hides the suggestions
    setInputValue(question);
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\* (.*?)(?=\n|$)/g, '<div style="margin-left: 10px; margin-bottom: 4px;">• $1</div>')
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue; 
    setInputValue("");
    setIsLoading(true);

    const assistantMessageId = `ai-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Simulate Network Request / AI Processing with a timeout
    setTimeout(() => {
      let responseText = "";
      
      // Match the user's input with our dictionary keys
      const matchedKey = Object.keys(MOCK_RESPONSES).find(
        (key) => key.toLowerCase() === currentInput.toLowerCase() || 
        currentInput.toLowerCase().includes(key.toLowerCase())
      );

      if (matchedKey) {
        // Pick a random response from the 3 available for the matched question
        const options = MOCK_RESPONSES[matchedKey];
        responseText = options[Math.floor(Math.random() * options.length)];
      } else {
        // Pick a random neutral fallback response
        responseText = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      }

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: responseText }
            : message
        )
      );
      setIsLoading(false);
    }, 1500); // 1.5 second simulated delay
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
        aria-label="Toggle chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-xl shadow-2xl transition-all duration-300 transform z-40 flex flex-col ${
          isChatOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{ height: "70vh" }}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 flex justify-between items-center shrink-0 rounded-t-xl">
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

        <div className="p-4 overflow-y-auto flex-1">
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

        {/* Persistent Suggested questions with horizontal scroll */}
        <div className="px-3 pt-2 pb-2 bg-gray-50 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-500 mb-2 font-medium">Quick questions:</p>
          <div className="flex overflow-x-auto gap-2 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                className="bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs py-1.5 px-3 rounded-full transition-colors duration-200 whitespace-nowrap flex-shrink-0 shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 p-3 flex items-center shrink-0 bg-white rounded-b-xl"
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 py-2 px-3 focus:outline-none bg-gray-50 rounded-l-lg border border-gray-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`ml-2 p-2.5 rounded-full ${
              isLoading || !inputValue.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600 shadow-md"
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