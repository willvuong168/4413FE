import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { CompareContext } from "../context/CompareContext";
import chatbotService from "../services/chatbotService";
import "./Chatbot.css";

const Chatbot = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { compareItems } = useContext(CompareContext);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your car dealership assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch vehicles for context
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "https://4413groupa.me/api/vehicles?page=0&size=50"
        );
        const data = await response.json();
        setVehicles(data.content || []);
      } catch (error) {
        console.error("Failed to fetch vehicles for chatbot context:", error);
      }
    };

    fetchVehicles();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update chatbot context when user state changes
  useEffect(() => {
    if (isOpen) {
      const appContext = {
        user,
        cartItems,
        compareItems,
        vehicles,
      };

      // Update the chatbot service context
      chatbotService.updateAppContext(appContext);
    }
  }, [user, cartItems, compareItems, vehicles, isOpen]);

  const handleQuickAction = (action) => {
    setShowQuickActions(false);

    let response = "";
    switch (action) {
      case "catalog":
        response =
          "Great! I'll take you to our vehicle catalog where you can browse all available vehicles.";
        navigate("/catalog");
        break;
      case "loan":
        response =
          "Perfect! I'll take you to our loan calculator where you can estimate monthly payments.";
        navigate("/loan");
        break;
      case "compare":
        response =
          "Excellent! I'll take you to our comparison tool where you can compare vehicles side by side.";
        navigate("/compare");
        break;
      case "cart":
        response =
          "I'll take you to your shopping cart where you can review your selected vehicles.";
        navigate("/cart");
        break;
      case "checkout":
        response =
          "I'll take you to checkout where you can complete your purchase.";
        navigate("/checkout");
        break;
      case "account":
        response =
          "I'll help you with your account information. You can manage your profile, view purchase history, and update preferences.";
        break;
      case "contact":
        response =
          "You can reach us at (123) 123-4567 during business hours, or email us at groupa4413@yorku.ca. We're here to help!";
        break;
      default:
        response =
          "I'm not sure what you'd like to do. How else can I help you?";
    }

    const botMessage = {
      id: messages.length + 2,
      text: response,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowQuickActions(false);

    // Prepare rich context for the chatbot service
    const appContext = {
      user,
      cartItems,
      compareItems,
      vehicles,
    };

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: chatbotService.generateResponse(inputValue, appContext),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Get context-aware quick actions
  const getQuickActions = () => {
    const actions = chatbotService.getQuickActions();

    // Add personalized actions based on user state
    if (user) {
      actions.push({ text: "My Account", action: "account" });
    }

    if (cartItems.length > 0) {
      actions.push({ text: "Checkout", action: "checkout" });
    }

    if (compareItems.length > 0) {
      actions.push({ text: "View Comparison", action: "compare" });
    }

    return actions;
  };

  // Get personalized greeting based on context
  const getPersonalizedGreeting = () => {
    let greeting = "Hello! I'm your car dealership assistant. ";

    if (user) {
      greeting += `Welcome back, ${user.name || user.email}! `;
    }

    if (cartItems.length > 0) {
      greeting += `I see you have ${cartItems.length} item${
        cartItems.length > 1 ? "s" : ""
      } in your cart. `;
    }

    if (compareItems.length > 0) {
      greeting += `You also have ${compareItems.length} vehicle${
        compareItems.length > 1 ? "s" : ""
      } in your comparison list. `;
    }

    greeting += "How can I help you today?";
    return greeting;
  };

  // Initialize with personalized greeting
  useEffect(() => {
    if (
      messages.length === 1 &&
      (user || cartItems.length > 0 || compareItems.length > 0)
    ) {
      setMessages([
        {
          id: 1,
          text: getPersonalizedGreeting(),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [user, cartItems.length, compareItems.length]);

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-blue-700 rounded-full p-4 shadow-lg z-50 transition-all duration-300 chat-button ${
          !isOpen ? "chat-button-pulse" : ""
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 flex flex-col chatbot-window">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <h3 className="font-semibold">Dealership Assistant</h3>
                  {user && (
                    <span className="text-xs opacity-75 block">
                      Welcome, {user.name || user.email}
                    </span>
                  )}
                  {(cartItems.length > 0 || compareItems.length > 0) && (
                    <div className="flex space-x-2 mt-1">
                      {cartItems.length > 0 && (
                        <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                          Cart: {cartItems.length}
                        </span>
                      )}
                      {compareItems.length > 0 && (
                        <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                          Compare: {compareItems.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {showQuickActions && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  Quick actions:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getQuickActions().map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors quick-action-button"
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 chat-input"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-blue-700 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
