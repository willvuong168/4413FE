// Chatbot service for handling intelligent responses with rich context
export class ChatbotService {
  constructor() {
    this.context = {
      currentTopic: null,
      userPreferences: {},
      conversationHistory: [],
      lastInteraction: null,
      userState: {
        isLoggedIn: false,
        cartItems: [],
        compareItems: [],
        recentVehicles: [],
        userProfile: null,
      },
      vehicleData: {
        inventory: [],
        brands: [],
        priceRanges: {},
        popularVehicles: [],
      },
    };
  }

  // Enhanced response generation with rich context awareness
  generateResponse(userMessage, appContext = {}) {
    const lowerMessage = userMessage.toLowerCase();

    // Update context with current app state
    this.updateAppContext(appContext);

    // Add to conversation history
    this.context.conversationHistory.push({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });

    // Check for follow-up questions and conversation continuity
    const isFollowUp = this.isFollowUpQuestion(lowerMessage);

    // Analyze user intent and context
    const intent = this.analyzeIntent(lowerMessage);
    let response = this.generateContextualResponse(
      intent,
      lowerMessage,
      appContext
    );

    // Add conversation continuity for follow-up questions
    if (isFollowUp && this.context.currentTopic) {
      response = this.addConversationContinuity(response, intent, appContext);
    }

    // Add bot response to history
    this.context.conversationHistory.push({
      role: "bot",
      content: response,
      timestamp: new Date(),
    });

    // Update conversation context
    this.updateConversationContext(intent, lowerMessage);

    return response;
  }

  // Update context with current app state
  updateAppContext(appContext) {
    const { user, cartItems, compareItems, vehicles } = appContext;

    this.context.userState = {
      isLoggedIn: !!user,
      cartItems: cartItems || [],
      compareItems: compareItems || [],
      recentVehicles: this.context.userState.recentVehicles,
      userProfile: user,
    };

    if (vehicles && vehicles.length > 0) {
      this.context.vehicleData = {
        inventory: vehicles,
        brands: [...new Set(vehicles.map((v) => v.brand))],
        priceRanges: this.calculatePriceRanges(vehicles),
        popularVehicles: this.getPopularVehicles(vehicles),
      };
    }
  }

  // Enhanced intent analysis with scoring and context awareness
  analyzeIntent(message) {
    const intentScores = {};

    // Calculate scores for each intent
    intentScores.help_query = this.scoreHelpQuery(message);
    intentScores.vehicle_query = this.scoreVehicleQuery(message);
    intentScores.loan_query = this.scoreLoanQuery(message);
    intentScores.dealership_query = this.scoreDealershipQuery(message);
    intentScores.comparison_query = this.scoreComparisonQuery(message);
    intentScores.pricing_query = this.scorePricingQuery(message);
    intentScores.cart_query = this.scoreCartQuery(message);
    intentScores.personal_query = this.scorePersonalQuery(message);
    intentScores.recommendation_query = this.scoreRecommendationQuery(message);

    // Find the intent with the highest score
    const maxScore = Math.max(...Object.values(intentScores));

    // Only return an intent if it has a meaningful score (> 0.3)
    if (maxScore > 0.3) {
      return Object.keys(intentScores).find(
        (key) => intentScores[key] === maxScore
      );
    }

    return "general";
  }

  // Generate contextual response based on intent and user state
  generateContextualResponse(intent, message, appContext) {
    switch (intent) {
      case "help_query":
        return this.handleHelpQuery(message, appContext);
      case "vehicle_query":
        return this.handleVehicleQuery(message, appContext);
      case "loan_query":
        return this.handleLoanQuery(message, appContext);
      case "dealership_query":
        return this.handleDealershipQuery(message, appContext);
      case "comparison_query":
        return this.handleComparisonQuery(message, appContext);
      case "pricing_query":
        return this.handlePricingQuery(message, appContext);
      case "cart_query":
        return this.handleCartQuery(message, appContext);
      case "personal_query":
        return this.handlePersonalQuery(message, appContext);
      case "recommendation_query":
        return this.handleRecommendationQuery(message, appContext);
      default:
        return this.getDefaultResponse(message, appContext);
    }
  }

  // Enhanced help query handler with comprehensive guidance
  handleHelpQuery(message, appContext) {
    const { user, cartItems, compareItems } = appContext;
    const isLoggedIn = !!user;

    let helpResponse =
      "I'm here to help you navigate our car dealership! Here's what I can assist you with:\n\n";

    // Core features
    helpResponse +=
      "🚗 **Vehicle Information**: Ask about specific vehicles, brands, types (SUV, sedan, truck, electric), or get recommendations\n";
    helpResponse +=
      "💰 **Pricing & Financing**: Get information about pricing, loans, monthly payments, down payments, and credit options\n";
    helpResponse +=
      "🏢 **Dealership Services**: Learn about our hours, contact info, warranties, test drives, and services\n";
    helpResponse +=
      "📊 **Vehicle Comparison**: Compare vehicles side by side to find the best option for you\n";
    helpResponse +=
      "🛒 **Shopping Cart**: Manage your cart, view items, and proceed to checkout\n";

    // Quick actions
    helpResponse += "\n**Quick Actions Available**:\n";
    helpResponse += "• Browse our vehicle catalog\n";
    helpResponse += "• Use our loan calculator\n";
    helpResponse += "• Compare vehicles\n";
    helpResponse += "• View your cart\n";
    helpResponse += "• Contact us\n";

    // Personalized context
    if (isLoggedIn) {
      helpResponse += `\n**Your Account**: Welcome back, ${
        user.name || user.email
      }! I can help with your account, preferences, and purchase history.\n`;
    }

    if (cartItems.length > 0) {
      helpResponse += `\n**Your Cart**: You have ${cartItems.length} item${
        cartItems.length > 1 ? "s" : ""
      } in your cart. I can help you review or proceed to checkout.\n`;
    }

    if (compareItems.length > 0) {
      helpResponse += `\n**Your Comparison**: You have ${
        compareItems.length
      } vehicle${
        compareItems.length > 1 ? "s" : ""
      } in your comparison list.\n`;
    }

    // Example questions
    helpResponse += "\n**Example Questions You Can Ask**:\n";
    helpResponse += '• "Show me SUVs" or "What sedans do you have?"\n';
    helpResponse +=
      '• "How much are monthly payments?" or "What\'s the down payment?"\n';
    helpResponse +=
      '• "What are your hours?" or "How do I schedule a test drive?"\n';
    helpResponse += '• "Compare these vehicles" or "Which is better?"\n';
    helpResponse += '• "What\'s in my cart?" or "Help me find a family car"\n';

    helpResponse +=
      "\nJust type your question naturally, and I'll help you find what you're looking for!";

    return helpResponse;
  }

  // Enhanced vehicle query handling with precise inventory data
  handleVehicleQuery(message, appContext) {
    const { vehicles, user, cartItems } = appContext;

    // Enhanced SUV handling with specific models
    if (message.includes("suv") || message.includes("sport utility")) {
      const suvs = vehicles?.filter((v) => v.shape === "SUV") || [];
      const count = suvs.length;

      if (count === 0) {
        return "We currently don't have SUVs in stock, but new inventory arrives weekly. Would you like me to help you find similar crossover vehicles or notify you when SUVs become available?";
      }

      const priceRange = this.getPriceRange(suvs);
      const topSuvs = suvs
        .slice(0, 3)
        .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`);

      let response = `We have ${count} SUVs available! `;

      if (priceRange) {
        response += `Pricing: $${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}. `;
      }

      if (topSuvs.length > 0) {
        response += `Top options: ${topSuvs.join(", ")}. `;
      }

      // Check for budget constraints in the message
      const budgetMatch = message.match(/under (\d+)k?|\$(\d+)/i);
      if (budgetMatch) {
        const budget =
          parseInt(budgetMatch[1] || budgetMatch[2]) *
          (budgetMatch[1] ? 1000 : 1);
        const affordableSuvs = suvs.filter((v) => v.price <= budget);
        if (affordableSuvs.length > 0) {
          response += `${
            affordableSuvs.length
          } SUVs fit your budget under $${budget.toLocaleString()}. `;
        } else {
          response += `No SUVs available under $${budget.toLocaleString()}, but our most affordable SUV starts at $${Math.min(
            ...suvs.map((v) => v.price)
          ).toLocaleString()}. `;
        }
      }

      // Add personalized context
      if (this.context.userPreferences.preferredShape === "SUV") {
        response += "Perfect choice - you've looked at SUVs before! ";
      }

      const suvInCart = cartItems.some((item) => item.shape === "SUV");
      if (suvInCart) {
        response +=
          "I see you have an SUV in your cart. Want to compare options? ";
      }

      response +=
        "Would you like specific recommendations based on your needs?";
      return response;
    }

    // Enhanced sedan handling with specific data
    if (message.includes("sedan") || message.includes("car")) {
      const sedans = vehicles?.filter((v) => v.shape === "Sedan") || [];
      const count = sedans.length;

      if (count === 0) {
        return "We're currently out of sedans, but we expect new arrivals soon. Can I interest you in similar hatchbacks or compact cars?";
      }

      const priceRange = this.getPriceRange(sedans);
      const topSedans = sedans
        .slice(0, 3)
        .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`);

      let response = `${count} sedans in stock! `;

      if (priceRange) {
        response += `Price range: $${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}. `;
      }

      if (topSedans.length > 0) {
        response += `Featured models: ${topSedans.join(", ")}. `;
      }

      // Check for fuel efficiency mentions
      if (
        message.includes("efficient") ||
        message.includes("mpg") ||
        message.includes("gas")
      ) {
        response +=
          "Our sedans offer excellent fuel economy for daily commuting. ";
      }

      // Budget constraint handling
      const budgetMatch = message.match(/under (\d+)k?|\$(\d+)/i);
      if (budgetMatch) {
        const budget =
          parseInt(budgetMatch[1] || budgetMatch[2]) *
          (budgetMatch[1] ? 1000 : 1);
        const affordableSedans = sedans.filter((v) => v.price <= budget);
        response +=
          affordableSedans.length > 0
            ? `${
                affordableSedans.length
              } sedans under $${budget.toLocaleString()}. `
            : `Our most affordable sedan starts at $${Math.min(
                ...sedans.map((v) => v.price)
              ).toLocaleString()}. `;
      }

      if (this.context.userPreferences.preferredShape === "Sedan") {
        response += "Great - sedans are your preferred type! ";
      }

      response +=
        "What features matter most: fuel efficiency, luxury, or value?";
      return response;
    }

    // Enhanced truck handling with specific capabilities
    if (message.includes("truck") || message.includes("pickup")) {
      const trucks = vehicles?.filter((v) => v.shape === "Truck") || [];
      const count = trucks.length;

      if (count === 0) {
        return "No trucks currently in stock, but we can order one or help you find a suitable SUV with similar hauling capacity.";
      }

      const priceRange = this.getPriceRange(trucks);
      const topTrucks = trucks
        .slice(0, 3)
        .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`);

      let response = `${count} trucks available! `;

      if (priceRange) {
        response += `Starting from $${priceRange.min.toLocaleString()}. `;
      }

      if (topTrucks.length > 0) {
        response += `Options: ${topTrucks.join(", ")}. `;
      }

      // Check for specific truck needs
      if (
        message.includes("work") ||
        message.includes("haul") ||
        message.includes("tow")
      ) {
        response += "Perfect for work and heavy-duty tasks. ";
      } else if (message.includes("family") || message.includes("daily")) {
        response += "Great for both family use and utility. ";
      }

      if (this.context.userPreferences.preferredShape === "Truck") {
        response += "Trucks are a smart choice! ";
      }

      response += "Need help choosing between cab sizes or bed lengths?";
      return response;
    }

    // Enhanced electric vehicle handling
    if (
      message.includes("electric") ||
      message.includes("ev") ||
      message.includes("hybrid")
    ) {
      const evs =
        vehicles?.filter(
          (v) =>
            v.brand === "Tesla" ||
            v.description?.toLowerCase().includes("electric") ||
            v.description?.toLowerCase().includes("hybrid")
        ) || [];
      const hybrids =
        vehicles?.filter((v) =>
          v.description?.toLowerCase().includes("hybrid")
        ) || [];

      const totalEcoFriendly = evs.length + hybrids.length;

      if (totalEcoFriendly === 0) {
        return "We don't currently have electric or hybrid vehicles in stock, but we can order them! Tesla and other EV manufacturers have new models arriving monthly.";
      }

      let response = `${totalEcoFriendly} eco-friendly vehicles available! `;

      if (evs.length > 0) {
        const topEvs = evs
          .slice(0, 2)
          .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`);
        response += `Electric: ${topEvs.join(", ")}. `;
      }

      if (hybrids.length > 0) {
        response += `Plus ${hybrids.length} hybrid options. `;
      }

      // Highlight benefits
      response +=
        "Benefits: Lower fuel costs, environmental impact, often tax incentives. ";

      if (user) {
        response +=
          "As a registered customer, you may qualify for federal EV tax credits up to $7,500! ";
      }

      // Check for specific EV concerns
      if (message.includes("range") || message.includes("charge")) {
        response +=
          "Our EVs offer 250+ mile range with fast charging capability. ";
      }

      response += "Want details on charging options or specific models?";
      return response;
    }

    // Enhanced brand-specific queries
    const brands = this.context.vehicleData.brands;
    const mentionedBrand = brands.find((brand) =>
      message.includes(brand.toLowerCase())
    );

    if (mentionedBrand) {
      const brandVehicles =
        vehicles?.filter((v) => v.brand === mentionedBrand) || [];
      const count = brandVehicles.length;

      if (count === 0) {
        return `We don't currently have ${mentionedBrand} vehicles in stock, but we can help you find similar alternatives or check when new ${mentionedBrand} inventory arrives.`;
      }

      const priceRange = this.getPriceRange(brandVehicles);
      const models = brandVehicles
        .slice(0, 3)
        .map((v) => `${v.model} ($${v.price.toLocaleString()})`);

      let response = `${count} ${mentionedBrand} vehicles in stock! `;

      if (priceRange) {
        response += `From $${priceRange.min.toLocaleString()} to $${priceRange.max.toLocaleString()}. `;
      }

      if (models.length > 0) {
        response += `Models: ${models.join(", ")}. `;
      }

      // Check for specific model mentions
      const modelMatch = brandVehicles.find((v) =>
        message.toLowerCase().includes(v.model.toLowerCase())
      );
      if (modelMatch) {
        response += `The ${
          modelMatch.model
        } is available for $${modelMatch.price.toLocaleString()}! `;
      }

      // User context
      const inCart = cartItems.some((item) => item.brand === mentionedBrand);
      const inCompare = this.context.userState.compareItems.some(
        (item) => item.brand === mentionedBrand
      );

      if (inCart) {
        response += `You have a ${mentionedBrand} in your cart. Compare with others? `;
      } else if (inCompare) {
        response += `You're comparing ${mentionedBrand} vehicles. Good choice! `;
      }

      response += "Need specific model details or want to see alternatives?";
      return response;
    }

    // Handle compound queries (e.g., "SUVs under $30k", "fuel efficient cars")
    const compoundResponse = this.handleCompoundQuery(message, vehicles);
    if (compoundResponse) {
      return compoundResponse;
    }

    // Check for budget-related vehicle queries
    if (
      message.includes("budget") ||
      message.includes("affordable") ||
      message.includes("cheap")
    ) {
      const affordableVehicles =
        vehicles?.filter((v) => v.price < 30000).slice(0, 3) || [];
      if (affordableVehicles.length > 0) {
        const suggestions = affordableVehicles
          .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`)
          .join(", ");
        return `For budget-friendly options, I'd recommend: ${suggestions}. These are great value vehicles under $30,000. Would you like to learn more about any of these?`;
      }
    }

    // Check for luxury/high-end vehicle queries
    if (
      message.includes("luxury") ||
      message.includes("premium") ||
      message.includes("expensive")
    ) {
      const luxuryVehicles =
        vehicles?.filter((v) => v.price > 50000).slice(0, 3) || [];
      if (luxuryVehicles.length > 0) {
        const suggestions = luxuryVehicles
          .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`)
          .join(", ");
        return `For luxury options, I'd recommend: ${suggestions}. These premium vehicles offer exceptional features and performance. Would you like to learn more about any of these?`;
      }
    }

    return "We have a diverse inventory of vehicles. You can browse our catalog to see all available makes and models, or let me know what specific features you're looking for and I can help narrow down your options.";
  }

  // Enhanced loan query with precise calculations
  handleLoanQuery(message, appContext) {
    const { cartItems } = appContext;

    if (message.includes("monthly payment") || message.includes("payment")) {
      let response = "";

      if (cartItems.length > 0) {
        const totalPrice = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Calculate rough payment estimates
        const downPayment = totalPrice * 0.15; // 15% down
        const loanAmount = totalPrice - downPayment;
        const monthlyPayment60 = this.calculateMonthlyPayment(
          loanAmount,
          5.5,
          60
        );
        const monthlyPayment72 = this.calculateMonthlyPayment(
          loanAmount,
          5.5,
          72
        );

        response = `For your cart total of $${totalPrice.toLocaleString()}: `;
        response += `Estimated payments (with $${downPayment.toLocaleString()} down, 5.5% APR): `;
        response += `60 months = $${monthlyPayment60}/month, `;
        response += `72 months = $${monthlyPayment72}/month. `;
        response += "Rates starting from 3.9% APR with good credit!";
      } else {
        response =
          "I can calculate exact payments for any vehicle! Our rates start at 3.9% APR. ";
        response +=
          "Typical payment for a $25,000 car (15% down, 60 months): ~$385/month. ";
        response += "Add vehicles to your cart for personalized estimates!";
      }

      return response;
    }

    if (message.includes("down payment") || message.includes("down")) {
      if (cartItems.length > 0) {
        const totalPrice = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const recommended10 = Math.round(totalPrice * 0.1);
        const recommended20 = Math.round(totalPrice * 0.2);

        return `For your cart ($${totalPrice.toLocaleString()}): Minimum down payment could be as low as $${recommended10.toLocaleString()} (10%), recommended $${recommended20.toLocaleString()} (20%) for better rates. Lower down = higher monthly payments.`;
      }

      return "Down payments typically range from 10-20%. Higher down payment = lower monthly payments and better interest rates. We're flexible with down payment amounts!";
    }

    if (message.includes("credit") || message.includes("score")) {
      return "We work with all credit types! Excellent credit (720+): 3.9% APR. Good credit (650+): 5.9% APR. Fair credit (580+): 8.9% APR. Poor credit: We have special programs! Our finance team will find you the best rate.";
    }

    if (
      message.includes("rate") ||
      message.includes("interest") ||
      message.includes("apr")
    ) {
      return "Current rates: 3.9% APR (excellent credit), 5.9% APR (good credit), up to 12.9% APR (all credit types accepted). Rate depends on credit score, loan term, and down payment. Pre-approval available!";
    }

    return "We offer competitive financing: 3.9%-12.9% APR, 36-84 month terms, flexible down payments. We work with all credit types and offer pre-approval! Want a payment estimate?";
  }

  // Helper method for payment calculations
  calculateMonthlyPayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12;
    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment).toLocaleString();
  }

  // Enhanced dealership query with personalized information
  handleDealershipQuery(message) {
    if (message.includes("hours") || message.includes("open")) {
      return "We're open Monday-Friday 9AM-8PM, Saturday 9AM-6PM, and Sunday 12PM-5PM. We're here to help you find your perfect vehicle!";
    }

    if (
      message.includes("contact") ||
      message.includes("phone") ||
      message.includes("call")
    ) {
      return "You can reach us at (555) 123-4567 during business hours, or email us at info@dealership.com. We're happy to answer any questions!";
    }

    if (message.includes("warranty") || message.includes("service")) {
      return "All our vehicles come with comprehensive warranties. New vehicles include manufacturer warranty, and used vehicles come with our certified pre-owned warranty. We also have a full-service department for maintenance and repairs.";
    }

    if (message.includes("test drive") || message.includes("drive")) {
      return "Absolutely! We encourage test drives. You can schedule one by calling us or visiting our dealership. What vehicle are you interested in? We'll make sure it's ready for your test drive.";
    }

    return "I'm here to help with any questions about our dealership, vehicles, financing, or services. What would you like to know more about?";
  }

  // Enhanced comparison query with current compare list awareness
  handleComparisonQuery(message, appContext) {
    const { compareItems } = appContext;

    if (compareItems.length > 0) {
      const itemCount = compareItems.length;
      const vehicleNames = compareItems
        .map((v) => `${v.brand} ${v.model}`)
        .join(", ");

      return `You currently have ${itemCount} vehicle${
        itemCount > 1 ? "s" : ""
      } in your comparison list: ${vehicleNames}. You can view the detailed comparison on our compare page, or add more vehicles (up to 4 total) to compare side by side!`;
    }

    return "You can compare vehicles side by side using our comparison tool! Just add vehicles to your compare list from the catalog, then visit the compare page to see detailed differences in features, pricing, and specifications.";
  }

  // Enhanced pricing query with inventory awareness
  handlePricingQuery(message, appContext) {
    const { vehicles } = appContext;

    if (message.includes("budget") || message.includes("afford")) {
      if (vehicles && vehicles.length > 0) {
        const minPrice = Math.min(...vehicles.map((v) => v.price));
        const maxPrice = Math.max(...vehicles.map((v) => v.price));

        return `We have vehicles at various price points to fit different budgets, ranging from $${minPrice.toLocaleString()} to $${maxPrice.toLocaleString()}. Our finance team can help you find the right vehicle and payment plan. What's your target monthly payment or total budget?`;
      }

      return "We have vehicles at various price points to fit different budgets. Our finance team can help you find the right vehicle and payment plan. What's your target monthly payment or total budget?";
    }

    if (message.includes("expensive") || message.includes("cheap")) {
      return "We offer vehicles across all price ranges, from affordable options to luxury models. Our goal is to find the perfect vehicle that fits both your needs and budget. What features are most important to you?";
    }

    return "Our pricing is competitive and transparent. You can view detailed pricing in our catalog, and we're happy to discuss financing options to make your purchase more affordable. Is there a specific vehicle you're interested in?";
  }

  // New cart query handler
  handleCartQuery(message, appContext) {
    const { cartItems } = appContext;

    if (message.includes("cart") || message.includes("shopping")) {
      if (cartItems.length > 0) {
        const totalItems = cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const totalPrice = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const vehicleNames = cartItems
          .map((item) => `${item.brand} ${item.model}`)
          .join(", ");

        return `You have ${totalItems} item${
          totalItems > 1 ? "s" : ""
        } in your cart: ${vehicleNames}. Total value: $${totalPrice.toLocaleString()}. Would you like to proceed to checkout or continue shopping?`;
      }

      return "Your cart is currently empty. Browse our catalog to find the perfect vehicle and add it to your cart!";
    }

    return "I can help you with your shopping cart! You can view your cart, proceed to checkout, or continue shopping. What would you like to do?";
  }

  // New personal query handler
  handlePersonalQuery(message, appContext) {
    const { user } = appContext;
    const isLoggedIn = !!user;

    if (
      message.includes("my") ||
      message.includes("account") ||
      message.includes("profile")
    ) {
      if (isLoggedIn) {
        return `Welcome back, ${
          user.name || user.email
        }! I can help you with your account, recent vehicles, or any questions about your purchases. What would you like to know?`;
      }

      return "I'd be happy to help you with your account! Please log in first so I can provide personalized assistance with your vehicle preferences and purchase history.";
    }

    return "I'm here to provide personalized assistance! If you log in, I can help you with your account, preferences, and purchase history.";
  }

  // Enhanced recommendation query handler with smart suggestions
  handleRecommendationQuery(message, appContext) {
    const { vehicles, cartItems, compareItems } = appContext;

    if (
      message.includes("recommend") ||
      message.includes("suggestion") ||
      message.includes("best")
    ) {
      if (!vehicles || vehicles.length === 0) {
        return "I'd love to recommend vehicles, but our inventory data isn't available right now. Please check back soon or browse our catalog directly!";
      }

      // Extract budget from message
      const budgetMatch = message.match(
        /under (\d+)k?|\$(\d+)|(\d+) thousand/i
      );
      let budget = null;
      if (budgetMatch) {
        budget =
          parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3]) *
          (budgetMatch[1] ? 1000 : 1);
      }

      // Smart recommendation algorithm
      let recommendations = [];
      const preferredShape = this.context.userPreferences.preferredShape;

      // Filter by budget first if specified
      let candidateVehicles = budget
        ? vehicles.filter((v) => v.price <= budget)
        : vehicles;

      if (candidateVehicles.length === 0 && budget) {
        const cheapest = Math.min(...vehicles.map((v) => v.price));
        return `No vehicles available under $${budget.toLocaleString()}. Our most affordable option starts at $${cheapest.toLocaleString()}. Would you like to see vehicles in a higher price range?`;
      }

      // Prioritize based on user preferences and context
      if (preferredShape) {
        const preferred = candidateVehicles.filter(
          (v) => v.shape === preferredShape
        );
        if (preferred.length > 0) {
          recommendations.push(...preferred.slice(0, 2));
        }
      }

      // Add value picks (good price-to-features ratio)
      if (recommendations.length < 3) {
        const valuePicks = candidateVehicles
          .filter((v) => !recommendations.includes(v))
          .sort((a, b) => a.price - b.price)
          .slice(0, 3 - recommendations.length);
        recommendations.push(...valuePicks);
      }

      if (recommendations.length === 0) {
        return "Let me understand your needs better. What's most important: budget, vehicle type, fuel efficiency, or specific features?";
      }

      // Build response with specific details
      let response = `Here are my top ${recommendations.length} recommendations`;
      if (budget) response += ` under $${budget.toLocaleString()}`;
      response += `: `;

      const recDetails = recommendations.map((v) => {
        let detail = `${v.brand} ${v.model} ($${v.price.toLocaleString()})`;
        if (v.newVehicle) detail += " - New";
        return detail;
      });

      response += recDetails.join(", ") + ". ";

      // Add context-specific advice
      if (
        preferredShape &&
        recommendations.some((v) => v.shape === preferredShape)
      ) {
        response += `I included ${preferredShape.toLowerCase()}s since you've shown interest in them. `;
      }

      if (cartItems.length > 0) {
        response += "Want to compare these with items in your cart? ";
      } else if (compareItems.length > 0) {
        response += "Add any to your comparison list? ";
      } else {
        response += "Would you like detailed specs on any of these? ";
      }

      return response;
    }

    // Handle specific recommendation requests
    if (message.includes("family") || message.includes("kids")) {
      const familyVehicles =
        vehicles
          ?.filter((v) => v.shape === "SUV" || v.shape === "Minivan")
          .slice(0, 3) || [];
      if (familyVehicles.length > 0) {
        const suggestions = familyVehicles
          .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`)
          .join(", ");
        return `For family vehicles, I'd recommend: ${suggestions}. These offer great space, safety features, and comfort for family trips. Would you like to learn more about any of these?`;
      }
    }

    if (
      message.includes("commute") ||
      message.includes("work") ||
      message.includes("daily")
    ) {
      const commuterVehicles =
        vehicles
          ?.filter((v) => v.shape === "Sedan" || v.shape === "Hatchback")
          .slice(0, 3) || [];
      if (commuterVehicles.length > 0) {
        const suggestions = commuterVehicles
          .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`)
          .join(", ");
        return `For daily commuting, I'd recommend: ${suggestions}. These offer great fuel efficiency and comfort for daily driving. Would you like to learn more about any of these?`;
      }
    }

    return "I can help you find the perfect vehicle! What are you looking for in a car?";
  }

  // Enhanced default response with context awareness
  getDefaultResponse(message, appContext) {
    const { user, cartItems, compareItems } = appContext;
    const isLoggedIn = !!user;

    const greetings = [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ];
    const farewells = ["bye", "goodbye", "see you", "thanks", "thank you"];

    if (greetings.some((greeting) => message.includes(greeting))) {
      let greeting = "Hello! I'm your car dealership assistant. ";

      if (isLoggedIn) {
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

      greeting +=
        "I can help you with vehicle information, financing options, pricing, and general questions. What would you like to know?";
      return greeting;
    }

    if (farewells.some((farewell) => message.includes(farewell))) {
      return "You're welcome! Feel free to reach out if you have more questions. I'm here to help you find your perfect vehicle!";
    }

    return "I'm not sure I understand. I can help you with: vehicle information, financing options, pricing, comparing vehicles, dealership services, and general questions. Could you please rephrase your question?";
  }

  // Handle compound queries with multiple criteria
  handleCompoundQuery(message, vehicles) {
    if (!vehicles || vehicles.length === 0) return null;

    let filteredVehicles = [...vehicles];
    let criteria = [];

    // Extract budget constraints
    const budgetMatch = message.match(
      /under (\d+)k?|below (\d+)k?|\$(\d+)|(\d+) thousand/i
    );
    if (budgetMatch) {
      const budget =
        parseInt(
          budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4]
        ) * (budgetMatch[1] || budgetMatch[2] ? 1000 : 1);
      filteredVehicles = filteredVehicles.filter((v) => v.price <= budget);
      criteria.push(`under $${budget.toLocaleString()}`);
    }

    // Extract vehicle type
    const types = ["suv", "sedan", "truck", "hatchback", "coupe"];
    const mentionedType = types.find((type) => message.includes(type));
    if (mentionedType) {
      const typeMap = {
        suv: "SUV",
        sedan: "Sedan",
        truck: "Truck",
        hatchback: "Hatchback",
        coupe: "Coupe",
      };
      filteredVehicles = filteredVehicles.filter(
        (v) => v.shape === typeMap[mentionedType]
      );
      criteria.push(typeMap[mentionedType].toLowerCase());
    }

    // Extract brand preference
    const brands = this.context.vehicleData.brands;
    const mentionedBrand = brands.find((brand) =>
      message.includes(brand.toLowerCase())
    );
    if (mentionedBrand) {
      filteredVehicles = filteredVehicles.filter(
        (v) => v.brand === mentionedBrand
      );
      criteria.push(mentionedBrand);
    }

    // Extract fuel efficiency preference
    if (
      message.includes("efficient") ||
      message.includes("mpg") ||
      message.includes("gas mileage")
    ) {
      // Assume sedans and hybrids are more efficient
      filteredVehicles = filteredVehicles.filter(
        (v) =>
          v.shape === "Sedan" || v.description?.toLowerCase().includes("hybrid")
      );
      criteria.push("fuel efficient");
    }

    // Extract new/used preference
    if (message.includes("new")) {
      filteredVehicles = filteredVehicles.filter((v) => v.newVehicle);
      criteria.push("new");
    } else if (message.includes("used")) {
      filteredVehicles = filteredVehicles.filter((v) => !v.newVehicle);
      criteria.push("used");
    }

    // Only return response if we have meaningful criteria (at least 2)
    if (criteria.length < 2) return null;

    const count = filteredVehicles.length;
    if (count === 0) {
      return `No vehicles match your criteria (${criteria.join(
        ", "
      )}). Would you like to adjust your requirements or see similar options?`;
    }

    const topMatches = filteredVehicles
      .slice(0, 3)
      .map((v) => `${v.brand} ${v.model} ($${v.price.toLocaleString()})`);

    let response = `Found ${count} vehicle${
      count > 1 ? "s" : ""
    } matching "${criteria.join(", ")}"! `;

    if (topMatches.length > 0) {
      response += `Top matches: ${topMatches.join(", ")}. `;
    }

    if (count > 3) {
      response += `Plus ${count - 3} more options. `;
    }

    response += "Want detailed specs on any of these?";
    return response;
  }

  // Enhanced scoring methods for precise intent recognition
  scoreHelpQuery(message) {
    const primaryKeywords = [
      "help",
      "how to",
      "how do i",
      "what can you",
      "guide",
      "assist",
    ];
    const secondaryKeywords = [
      "show me",
      "explain",
      "tutorial",
      "instructions",
      "support",
    ];

    let score = 0;

    // High weight for primary help keywords
    primaryKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    // Medium weight for secondary keywords
    secondaryKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.4;
    });

    // Question words increase help intent
    if (message.includes("?")) score += 0.2;
    if (message.includes("what") || message.includes("how")) score += 0.3;

    return Math.min(score, 1.0); // Cap at 1.0
  }

  scoreVehicleQuery(message) {
    const vehicleTypes = [
      "car",
      "vehicle",
      "truck",
      "suv",
      "sedan",
      "hatchback",
      "coupe",
      "convertible",
      "minivan",
    ];
    const vehicleBrands = [
      "toyota",
      "honda",
      "ford",
      "chevrolet",
      "nissan",
      "bmw",
      "mercedes",
      "audi",
      "tesla",
      "hyundai",
    ];
    const vehicleFeatures = [
      "engine",
      "transmission",
      "mileage",
      "year",
      "model",
      "make",
    ];
    const vehicleDescriptors = [
      "new",
      "used",
      "certified",
      "electric",
      "hybrid",
      "gas",
      "diesel",
    ];

    let score = 0;

    // High weight for vehicle types
    vehicleTypes.forEach((type) => {
      if (message.includes(type)) score += 0.7;
    });

    // Medium-high weight for brands
    vehicleBrands.forEach((brand) => {
      if (message.includes(brand.toLowerCase())) score += 0.6;
    });

    // Medium weight for features and descriptors
    vehicleFeatures.forEach((feature) => {
      if (message.includes(feature)) score += 0.4;
    });

    vehicleDescriptors.forEach((descriptor) => {
      if (message.includes(descriptor)) score += 0.3;
    });

    return Math.min(score, 1.0);
  }

  scoreLoanQuery(message) {
    const financingKeywords = [
      "loan",
      "finance",
      "financing",
      "payment",
      "monthly",
      "interest",
      "apr",
    ];
    const creditKeywords = ["credit", "score", "down payment", "trade-in"];
    const paymentKeywords = ["monthly payment", "installment", "lease"];

    let score = 0;

    financingKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    creditKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.6;
    });

    paymentKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.7;
    });

    return Math.min(score, 1.0);
  }

  scoreDealershipQuery(message) {
    const contactKeywords = [
      "hours",
      "contact",
      "phone",
      "email",
      "address",
      "location",
    ];
    const serviceKeywords = [
      "warranty",
      "service",
      "maintenance",
      "repair",
      "test drive",
    ];

    let score = 0;

    contactKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    serviceKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.7;
    });

    return Math.min(score, 1.0);
  }

  scoreComparisonQuery(message) {
    const comparisonKeywords = [
      "compare",
      "comparison",
      "vs",
      "versus",
      "difference",
      "better",
      "which",
    ];
    const relativeKeywords = ["than", "against", "or", "between"];

    let score = 0;

    comparisonKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    relativeKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.4;
    });

    // Boost score if user has items in compare list
    if (this.context.userState.compareItems.length > 0) {
      score += 0.3;
    }

    return Math.min(score, 1.0);
  }

  scorePricingQuery(message) {
    const priceKeywords = [
      "price",
      "cost",
      "how much",
      "expensive",
      "cheap",
      "budget",
      "afford",
    ];
    const priceIndicators = ["$", "dollar", "thousand", "payment"];

    let score = 0;

    priceKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    priceIndicators.forEach((indicator) => {
      if (message.includes(indicator)) score += 0.5;
    });

    return Math.min(score, 1.0);
  }

  scoreCartQuery(message) {
    const cartKeywords = [
      "cart",
      "shopping",
      "checkout",
      "purchase",
      "buy",
      "selected",
    ];

    let score = 0;

    cartKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    // Boost if user has items in cart
    if (this.context.userState.cartItems.length > 0) {
      score += 0.4;
    }

    return Math.min(score, 1.0);
  }

  scorePersonalQuery(message) {
    const personalKeywords = [
      "my",
      "account",
      "profile",
      "history",
      "purchase",
    ];

    let score = 0;

    personalKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.7;
    });

    // Boost if user is logged in
    if (this.context.userState.isLoggedIn) {
      score += 0.3;
    }

    return Math.min(score, 1.0);
  }

  scoreRecommendationQuery(message) {
    const recommendKeywords = [
      "recommend",
      "suggestion",
      "best",
      "top",
      "popular",
      "should i",
    ];
    const needKeywords = ["need", "looking for", "want", "family", "commute"];

    let score = 0;

    recommendKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.8;
    });

    needKeywords.forEach((keyword) => {
      if (message.includes(keyword)) score += 0.5;
    });

    return Math.min(score, 1.0);
  }

  // Helper methods for context analysis
  isVehicleQuery(message) {
    const vehicleKeywords = [
      "car",
      "vehicle",
      "truck",
      "suv",
      "sedan",
      "model",
      "make",
      "brand",
    ];
    return vehicleKeywords.some((keyword) => message.includes(keyword));
  }

  isLoanQuery(message) {
    const loanKeywords = [
      "loan",
      "finance",
      "payment",
      "monthly",
      "interest",
      "credit",
      "down payment",
    ];
    return loanKeywords.some((keyword) => message.includes(keyword));
  }

  isDealershipQuery(message) {
    const dealershipKeywords = [
      "hours",
      "contact",
      "location",
      "address",
      "phone",
      "email",
      "warranty",
      "service",
    ];
    return dealershipKeywords.some((keyword) => message.includes(keyword));
  }

  isComparisonQuery(message) {
    const comparisonKeywords = [
      "compare",
      "difference",
      "vs",
      "versus",
      "better",
      "which",
    ];
    return comparisonKeywords.some((keyword) => message.includes(keyword));
  }

  isPricingQuery(message) {
    const pricingKeywords = [
      "price",
      "cost",
      "how much",
      "expensive",
      "cheap",
      "budget",
      "afford",
    ];
    return pricingKeywords.some((keyword) => message.includes(keyword));
  }

  isCartQuery(message) {
    const cartKeywords = ["cart", "shopping", "checkout", "purchase", "buy"];
    return cartKeywords.some((keyword) => message.includes(keyword));
  }

  isPersonalQuery(message) {
    const personalKeywords = [
      "my",
      "account",
      "profile",
      "history",
      "purchase",
    ];
    return personalKeywords.some((keyword) => message.includes(keyword));
  }

  isRecommendationQuery(message) {
    const recommendationKeywords = [
      "recommend",
      "suggestion",
      "best",
      "top",
      "popular",
    ];
    return recommendationKeywords.some((keyword) => message.includes(keyword));
  }

  isHelpQuery(message) {
    const helpKeywords = [
      "help",
      "how to",
      "how do i",
      "what can you",
      "what do you",
      "guide",
      "tutorial",
      "instructions",
      "support",
      "assist",
      "show me",
      "explain",
    ];
    return helpKeywords.some((keyword) => message.includes(keyword));
  }

  // Helper methods for data processing
  calculatePriceRanges(vehicles) {
    if (!vehicles || vehicles.length === 0) return {};

    const prices = vehicles.map((v) => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(
        prices.reduce((sum, price) => sum + price, 0) / prices.length
      ),
    };
  }

  getPriceRange(vehicles) {
    if (!vehicles || vehicles.length === 0) return null;

    const prices = vehicles.map((v) => v.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  getPopularVehicles(vehicles) {
    if (!vehicles || vehicles.length === 0) return [];

    // Sort by price (assuming lower price = more popular) and return top 5
    return vehicles.sort((a, b) => a.price - b.price).slice(0, 5);
  }

  updateConversationContext(intent, message) {
    this.context.currentTopic = intent;
    this.context.lastInteraction = new Date();

    // Update user preferences based on conversation
    if (intent === "vehicle_query") {
      if (message.includes("suv"))
        this.context.userPreferences.preferredShape = "SUV";
      if (message.includes("sedan"))
        this.context.userPreferences.preferredShape = "Sedan";
      if (message.includes("truck"))
        this.context.userPreferences.preferredShape = "Truck";
      if (message.includes("electric") || message.includes("ev"))
        this.context.userPreferences.preferredFuel = "Electric";
      if (message.includes("hybrid"))
        this.context.userPreferences.preferredFuel = "Hybrid";
    }

    // Update budget preferences
    if (intent === "pricing_query") {
      if (message.includes("budget") || message.includes("affordable")) {
        this.context.userPreferences.budgetRange = "affordable";
      } else if (message.includes("luxury") || message.includes("premium")) {
        this.context.userPreferences.budgetRange = "luxury";
      }
    }

    // Store recent topics for better context
    if (!this.context.userPreferences.recentTopics) {
      this.context.userPreferences.recentTopics = [];
    }

    this.context.userPreferences.recentTopics.unshift(intent);
    this.context.userPreferences.recentTopics =
      this.context.userPreferences.recentTopics.slice(0, 5); // Keep last 5 topics
  }

  // Get quick action suggestions based on context
  getQuickActions() {
    const actions = [
      { text: "Browse Vehicles", action: "catalog" },
      { text: "Calculate Loan", action: "loan" },
      { text: "Compare Cars", action: "compare" },
      { text: "Contact Us", action: "contact" },
    ];

    // Add context-aware actions
    if (this.context.userState.cartItems.length > 0) {
      actions.unshift({ text: "View Cart", action: "cart" });
    }

    if (this.context.userState.compareItems.length > 0) {
      actions.unshift({ text: "View Comparison", action: "compare" });
    }

    return actions;
  }

  // Update conversation context
  updateContext(newContext) {
    this.context = { ...this.context, ...newContext };
  }

  // Check if message is a follow-up question
  isFollowUpQuestion(message) {
    const followUpIndicators = [
      "what about",
      "how about",
      "and",
      "also",
      "too",
      "as well",
      "what else",
      "any other",
      "more",
      "different",
      "similar",
      "compare",
      "versus",
      "vs",
      "difference",
      "better",
      "worse",
    ];

    return followUpIndicators.some((indicator) => message.includes(indicator));
  }

  // Add conversation continuity for follow-up questions
  addConversationContinuity(response, intent, appContext) {
    const { cartItems, compareItems } = appContext;

    // Add context from previous conversation
    if (
      this.context.currentTopic === "vehicle_query" &&
      intent === "vehicle_query"
    ) {
      const recentTopics = this.context.userPreferences.recentTopics || [];
      const lastVehicleType = recentTopics.find(
        (topic) => topic === "vehicle_query"
      );

      if (lastVehicleType && this.context.userPreferences.preferredShape) {
        response += ` Since you're interested in ${this.context.userPreferences.preferredShape}s, `;

        // Suggest related actions
        if (cartItems.length > 0) {
          response +=
            "you might want to check out our comparison tool to see how your cart items stack up against other options. ";
        } else if (compareItems.length > 0) {
          response +=
            "you can add more vehicles to your comparison list to get a better view of your options. ";
        } else {
          response +=
            "you can add vehicles to your comparison list or cart to keep track of your favorites. ";
        }
      }
    }

    // Add financing context for loan-related follow-ups
    if (
      this.context.currentTopic === "loan_query" &&
      intent === "pricing_query"
    ) {
      response +=
        " You can use our loan calculator to see how different down payments and terms affect your monthly payments. ";
    }

    return response;
  }

  // Get conversation summary for context
  getConversationSummary() {
    const recentMessages = this.context.conversationHistory.slice(-6); // Last 6 messages
    return recentMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
  }

  // Get user preferences summary
  getUserPreferencesSummary() {
    const prefs = this.context.userPreferences;
    const summary = [];

    if (prefs.preferredShape)
      summary.push(`Preferred vehicle type: ${prefs.preferredShape}`);
    if (prefs.preferredFuel)
      summary.push(`Preferred fuel type: ${prefs.preferredFuel}`);
    if (prefs.budgetRange)
      summary.push(`Budget preference: ${prefs.budgetRange}`);
    if (prefs.recentTopics && prefs.recentTopics.length > 0) {
      summary.push(
        `Recent interests: ${prefs.recentTopics.slice(0, 3).join(", ")}`
      );
    }

    return summary.join(", ");
  }
}

export default new ChatbotService();
