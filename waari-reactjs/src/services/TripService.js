import { get } from "./apiServices";
import { transformGroupTours } from "./TripTransformer";

/**
 * Fetch group tours data with optional filters
 */
export const getGroupTours = async (filters = {}) => {
  try {
    const {
      tourName = "",
      tourType = "",
      page = 1,
      perPage = 10,
      travelStartDate = "",
      travelEndDate = "",
    } = filters;

    console.log("🎫 Fetching group tours with filters:", filters);
    const response = await get(
      `/view-group-tour?perPage=${perPage}&page=${page}&tourName=${tourName}&tourType=${tourType}&travelStartDate=${travelStartDate}&travelEndDate=${travelEndDate}`
    );
    console.log("✅ Group tours response:", response.data);

    // Transform the data for consistent structure
    const transformedData = {
      ...response.data,
      data: transformGroupTours(response.data?.data || []),
    };

    return transformedData;
  } catch (error) {
    console.error(
      "❌ Error fetching group tours:",
      error.response?.data || error.message
    );
    return { data: [] };
  }
};

/**
 * Fetch tailor-made tours data with optional filters
 */
export const getTailorMadeTours = async (filters = {}) => {
  try {
    const {
      tourName = "",
      page = 1,
      perPage = 10,
      travelStartDate = "",
      travelEndDate = "",
    } = filters;

    console.log("🎫 Fetching tailor-made tours with filters:", filters);
    const response = await get(
      `/view-custom-tour?perPage=${perPage}&page=${page}&groupName=${tourName}&startDate=${travelStartDate}&endDate=${travelEndDate}`
    );
    console.log("✅ Tailor-made tours response:", response.data);

    // Transform the data for consistent structure
    const { transformTailorMadeTours } = await import("./TripTransformer");
    const transformedData = {
      ...response.data,
      data: transformTailorMadeTours(response.data?.data || []),
    };

    return transformedData;
  } catch (error) {
    console.error(
      "❌ Error fetching tailor-made tours:",
      error.response?.data || error.message
    );
    return { data: [] };
  }
};

/**
 * Fetch available tour types
 */
export const getTourTypes = async () => {
  try {
    const response = await get(`/tour-type-list`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tour types:", error);
    throw error;
  }
};

/**
 * Fetch available cities
 */
export const getCities = async () => {
  try {
    const response = await get(`/city-list`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

/**
 * Parse user query and search for trips
 */
export const searchTrips = async (query) => {
  try {
    // Convert query to lowercase for matching
    const lowerQuery = query.toLowerCase();
    console.log("🔎 Searching trips for query:", query);

    // Fetch both group and tailor-made tours
    const [groupToursRes, tailorMadeRes] = await Promise.all([
      getGroupTours({ perPage: 100 }),
      getTailorMadeTours({ perPage: 100 }),
    ]);

    // Extract data arrays from responses
    const groupTours = groupToursRes?.data || [];
    const tailorMadeTours = tailorMadeRes?.data || [];

    console.log("📊 Raw group tours count:", groupTours.length);
    console.log("📊 Raw tailor-made tours count:", tailorMadeTours.length);

    // Check for generic/show-all queries
    const showAllKeywords = [
      "all",
      "every",
      "show",
      "list",
      "how many",
      "count",
      "available",
    ];
    const isShowAllQuery = showAllKeywords.some((keyword) =>
      lowerQuery.includes(keyword)
    );

    let matchedGroupTours = groupTours;
    let matchedTailorMade = tailorMadeTours;

    // Only filter if it's NOT a show-all query
    if (!isShowAllQuery) {
      // Filter tours based on keywords in the query
      matchedGroupTours = groupTours.filter(
        (tour) =>
          lowerQuery.includes(tour.tourName?.toLowerCase() || "") ||
          lowerQuery.includes(tour.tourCode?.toLowerCase() || "") ||
          lowerQuery.includes(tour.tourTypeName?.toLowerCase() || "")
      );

      matchedTailorMade = tailorMadeTours.filter(
        (tour) =>
          lowerQuery.includes(tour.groupName?.toLowerCase() || "") ||
          lowerQuery.includes(tour.tourType?.toLowerCase() || "")
      );
    }

    console.log("✅ Matched group tours:", matchedGroupTours.length);
    console.log("✅ Matched tailor-made tours:", matchedTailorMade.length);

    return {
      groupTours: matchedGroupTours,
      tailorMadeTours: matchedTailorMade,
      total: matchedGroupTours.length + matchedTailorMade.length,
    };
  } catch (error) {
    console.error("❌ Error searching trips:", error);
    return {
      groupTours: [],
      tailorMadeTours: [],
      total: 0,
    };
  }
};

/**
 * Generate suggested follow-up questions based on search results and context
 */
export const generateSuggestedQuestions = (
  searchResults,
  lastUserQuery = ""
) => {
  const { groupTours, tailorMadeTours, total } = searchResults;
  const suggestions = [];

  // If trips found, suggest specific actions
  if (total > 0) {
    // Suggest viewing details of first tour
    if (groupTours.length > 0) {
      suggestions.push(
        `Tell me more about ${groupTours[0].tourName}`,
        "What's the itinerary for this tour?",
        `Show me availability for ${groupTours[0].tourName}`
      );
    }

    if (tailorMadeTours.length > 0) {
      suggestions.push(
        `Details about ${tailorMadeTours[0].groupName}`,
        "What's included in this package?"
      );
    }

    // Generic follow-up suggestions
    suggestions.push(
      "Compare different tours",
      "Show tours by price",
      "Tours with dates near me"
    );
  } else {
    // If no trips found, suggest alternatives
    suggestions.push(
      "Show me all available tours",
      "Tours under ₹50,000",
      "Popular destinations",
      "Weekend getaways"
    );
  }

  // Remove duplicates and limit to 4
  return [...new Set(suggestions)].slice(0, 4);
};

/**
 * Generate AI response based on trip data
 */
export const generateTripResponse = (searchResults, userQuery = "") => {
  const { groupTours, tailorMadeTours, total } = searchResults;

  if (total === 0) {
    return {
      text: "I couldn't find any trips matching your search. Try searching for a different destination or date range! 🌍",
      success: false,
      suggestions: generateSuggestedQuestions(searchResults, userQuery),
    };
  }

  let response = `I found ${total} trip(s) for you! 🎉\n\n`;

  // Format group tours
  if (groupTours.length > 0) {
    response += `**Group Tours (${groupTours.length}):**\n`;
    groupTours.slice(0, 3).forEach((tour, index) => {
      response += `${index + 1}. **${tour.tourName}** (Code: ${
        tour.tourCode
      })\n`;
      response += `   • Type: ${tour.tourTypeName}\n`;
      response += `   • Duration: ${tour.duration} days\n`;
      response += `   • Seats: ${tour.seatsBook}/${tour.totalSeats} booked\n`;
      response += `   • Dates: ${tour.startDate} - ${tour.endDate}\n\n`;
    });
    if (groupTours.length > 3) {
      response += `... and ${groupTours.length - 3} more group tours\n\n`;
    }
  }

  // Format tailor-made tours
  if (tailorMadeTours.length > 0) {
    response += `**Tailor-Made Tours (${tailorMadeTours.length}):**\n`;
    tailorMadeTours.slice(0, 3).forEach((tour, index) => {
      response += `${index + 1}. **${tour.groupName}** (ID: ${
        tour.uniqueEnqueryId
      })\n`;
      response += `   • Type: ${tour.tourType || "Custom"}\n`;
      response += `   • Duration: ${tour.duration} days\n`;
      response += `   • Dates: ${tour.startDate} - ${tour.endDate}\n\n`;
    });
    if (tailorMadeTours.length > 3) {
      response += `... and ${
        tailorMadeTours.length - 3
      } more tailor-made tours\n\n`;
    }
  }

  response += `Would you like more details about any of these trips? 😊`;

  return {
    text: response,
    success: true,
    data: { groupTours, tailorMadeTours },
    suggestions: generateSuggestedQuestions(searchResults, userQuery),
  };
};
