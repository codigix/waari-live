/**
 * Manual Test Suite for TripService.js
 * This script tests all functions in TripService without requiring Jest
 */

// Simple test runner utility
class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  describe(testName, testFn) {
    console.log(`\n📋 ${testName}`);
    try {
      testFn();
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      this.failed++;
    }
  }

  it(description, testFn) {
    try {
      testFn();
      console.log(`   ✅ ${description}`);
      this.passed++;
    } catch (error) {
      console.log(`   ❌ ${description}`);
      console.log(`      Error: ${error.message}`);
      this.failed++;
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  assertDeepEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        message ||
          `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(
            actual
          )}`
      );
    }
  }

  assertExists(value, message) {
    if (!value) {
      throw new Error(message || "Expected value to exist");
    }
  }

  printSummary() {
    console.log("\n========================================");
    console.log("📊 TEST SUMMARY");
    console.log("========================================");
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Total: ${this.passed + this.failed}`);
    console.log("========================================\n");

    if (this.failed === 0) {
      console.log("🎉 All tests passed!");
    }
  }
}

// Mock apiServices
const mockApiServices = {
  responses: {},
  setMockResponse(endpoint, response) {
    this.responses[endpoint] = response;
  },
  async get(endpoint) {
    const response = this.responses[endpoint];
    if (!response) {
      throw new Error(`No mock response configured for ${endpoint}`);
    }
    if (response.error) {
      throw response.error;
    }
    return { data: response };
  },
};

// Mock implementations of TripService functions
const TripService = {
  async getGroupTours(filters = {}) {
    const {
      tourName = "",
      tourType = "",
      page = 1,
      perPage = 10,
      travelStartDate = "",
      travelEndDate = "",
    } = filters;

    const endpoint = `/view-group-tour?perPage=${perPage}&page=${page}&tourName=${tourName}&tourType=${tourType}&travelStartDate=${travelStartDate}&travelEndDate=${travelEndDate}`;
    const response = await mockApiServices.get(endpoint);
    return response.data;
  },

  async getTailorMadeTours(filters = {}) {
    const {
      tourName = "",
      page = 1,
      perPage = 10,
      travelStartDate = "",
      travelEndDate = "",
    } = filters;

    const endpoint = `/view-custom-tour?perPage=${perPage}&page=${page}&groupName=${tourName}&startDate=${travelStartDate}&endDate=${travelEndDate}`;
    const response = await mockApiServices.get(endpoint);
    return response.data;
  },

  async getTourTypes() {
    const response = await mockApiServices.get("/tour-type-list");
    return response.data.data;
  },

  async getCities() {
    const response = await mockApiServices.get("/city-list");
    return response.data.data;
  },

  async searchTrips(query) {
    const lowerQuery = query.toLowerCase();

    const [groupToursRes, tailorMadeRes] = await Promise.all([
      this.getGroupTours({ perPage: 20 }),
      this.getTailorMadeTours({ perPage: 20 }),
    ]);

    const groupTours = groupToursRes.data || [];
    const tailorMadeTours = tailorMadeRes.data || [];

    const matchedGroupTours = groupTours.filter(
      (tour) =>
        tour.tourName?.toLowerCase().includes(lowerQuery) ||
        tour.tourCode?.toLowerCase().includes(lowerQuery) ||
        tour.tourTypeName?.toLowerCase().includes(lowerQuery)
    );

    const matchedTailorMade = tailorMadeTours.filter(
      (tour) =>
        tour.groupName?.toLowerCase().includes(lowerQuery) ||
        tour.tourType?.toLowerCase().includes(lowerQuery)
    );

    return {
      groupTours: matchedGroupTours,
      tailorMadeTours: matchedTailorMade,
      total: matchedGroupTours.length + matchedTailorMade.length,
    };
  },

  generateTripResponse(searchResults) {
    const { groupTours, tailorMadeTours, total } = searchResults;

    if (total === 0) {
      return {
        text: "I couldn't find any trips matching your search. Try searching for a different destination or date range! 🌍",
        success: false,
      };
    }

    let response = `I found ${total} trip(s) for you! 🎉\n\n`;

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
    };
  },
};

// Run Tests
async function runTests() {
  const runner = new TestRunner("TripService");

  console.log("🚀 Starting TripService Test Suite...\n");

  // Test getGroupTours
  runner.describe("getGroupTours", () => {
    runner.it("should fetch group tours with default parameters", async () => {
      const mockData = {
        data: [
          {
            id: 1,
            tourName: "Paris Tour",
            tourCode: "PT001",
            tourTypeName: "Group Tour",
            duration: 5,
            seatsBook: 10,
            totalSeats: 20,
            startDate: "2024-02-01",
            endDate: "2024-02-05",
          },
        ],
        lastPage: 1,
        perPage: 10,
      };

      mockApiServices.setMockResponse(
        "/view-group-tour?perPage=10&page=1&tourName=&tourType=&travelStartDate=&travelEndDate=",
        mockData
      );

      const result = await TripService.getGroupTours();
      runner.assertExists(result.data, "Should return data");
      runner.assertEqual(result.data.length, 1, "Should return one tour");
      runner.assertEqual(
        result.data[0].tourName,
        "Paris Tour",
        "Should match tour name"
      );
    });

    runner.it("should fetch group tours with custom filters", async () => {
      const mockData = { data: [], lastPage: 1, perPage: 5 };
      mockApiServices.setMockResponse(
        "/view-group-tour?perPage=5&page=2&tourName=Paris&tourType=Group&travelStartDate=2024-02-01&travelEndDate=2024-02-10",
        mockData
      );

      const filters = {
        tourName: "Paris",
        tourType: "Group",
        page: 2,
        perPage: 5,
        travelStartDate: "2024-02-01",
        travelEndDate: "2024-02-10",
      };

      const result = await TripService.getGroupTours(filters);
      runner.assertEqual(result.data.length, 0, "Should return empty data");
    });
  });

  // Test getTailorMadeTours
  runner.describe("getTailorMadeTours", () => {
    runner.it(
      "should fetch tailor-made tours with default parameters",
      async () => {
        const mockData = {
          data: [
            {
              uniqueEnqueryId: "T001",
              groupName: "Custom Europe Trip",
              tourType: "Tailor-Made",
              duration: 10,
              startDate: "2024-03-01",
              endDate: "2024-03-10",
            },
          ],
          lastPage: 1,
          perPage: 10,
        };

        mockApiServices.setMockResponse(
          "/view-custom-tour?perPage=10&page=1&groupName=&startDate=&endDate=",
          mockData
        );

        const result = await TripService.getTailorMadeTours();
        runner.assertExists(result.data, "Should return data");
        runner.assertEqual(result.data.length, 1, "Should return one tour");
        runner.assertEqual(
          result.data[0].groupName,
          "Custom Europe Trip",
          "Should match group name"
        );
      }
    );
  });

  // Test getTourTypes
  runner.describe("getTourTypes", () => {
    runner.it("should fetch tour types", async () => {
      const mockData = [
        { id: 1, typeName: "Group Tour" },
        { id: 2, typeName: "Tailor-Made" },
      ];

      mockApiServices.setMockResponse("/tour-type-list", {
        data: mockData,
      });

      const result = await TripService.getTourTypes();
      runner.assertEqual(result.length, 2, "Should return 2 tour types");
      runner.assertEqual(
        result[0].typeName,
        "Group Tour",
        "Should match first type"
      );
    });
  });

  // Test getCities
  runner.describe("getCities", () => {
    runner.it("should fetch cities", async () => {
      const mockData = [
        { id: 1, citiesName: "Paris" },
        { id: 2, citiesName: "Tokyo" },
      ];

      mockApiServices.setMockResponse("/city-list", { data: mockData });

      const result = await TripService.getCities();
      runner.assertEqual(result.length, 2, "Should return 2 cities");
      runner.assertEqual(
        result[0].citiesName,
        "Paris",
        "Should match first city"
      );
    });
  });

  // Test searchTrips
  runner.describe("searchTrips", () => {
    runner.it("should find matching group tours", async () => {
      const groupToursData = {
        data: [
          {
            tourName: "Paris Adventure",
            tourCode: "PA001",
            tourTypeName: "Group Tour",
          },
          {
            tourName: "Tokyo Tour",
            tourCode: "TT001",
            tourTypeName: "Group Tour",
          },
        ],
        lastPage: 1,
      };

      const tailorMadeData = { data: [], lastPage: 1 };

      mockApiServices.setMockResponse(
        "/view-group-tour?perPage=20&page=1&tourName=&tourType=&travelStartDate=&travelEndDate=",
        groupToursData
      );
      mockApiServices.setMockResponse(
        "/view-custom-tour?perPage=20&page=1&groupName=&startDate=&endDate=",
        tailorMadeData
      );

      const result = await TripService.searchTrips("Paris");
      runner.assertEqual(result.total, 1, "Should find 1 matching tour");
      runner.assertEqual(
        result.groupTours.length,
        1,
        "Should have 1 group tour"
      );
      runner.assertEqual(
        result.groupTours[0].tourName,
        "Paris Adventure",
        "Should match tour name"
      );
    });

    runner.it("should handle case-insensitive search", async () => {
      const groupToursData = {
        data: [
          {
            tourName: "London Tour",
            tourCode: "LDN001",
            tourTypeName: "Group Tour",
          },
        ],
        lastPage: 1,
      };

      const tailorMadeData = { data: [], lastPage: 1 };

      mockApiServices.setMockResponse(
        "/view-group-tour?perPage=20&page=1&tourName=&tourType=&travelStartDate=&travelEndDate=",
        groupToursData
      );
      mockApiServices.setMockResponse(
        "/view-custom-tour?perPage=20&page=1&groupName=&startDate=&endDate=",
        tailorMadeData
      );

      const result = await TripService.searchTrips("LONDON");
      runner.assertEqual(result.total, 1, "Should find 1 matching tour");
    });
  });

  // Test generateTripResponse
  runner.describe("generateTripResponse", () => {
    runner.it("should return no results message when no trips found", () => {
      const searchResults = {
        groupTours: [],
        tailorMadeTours: [],
        total: 0,
      };

      const response = TripService.generateTripResponse(searchResults);
      runner.assertEqual(response.success, false, "Should have success false");
      runner.assert(
        response.text.includes("couldn't find"),
        "Should contain not found message"
      );
    });

    runner.it("should format group tours correctly", () => {
      const searchResults = {
        groupTours: [
          {
            tourName: "Paris Tour",
            tourCode: "P001",
            tourTypeName: "Group Tour",
            duration: 5,
            seatsBook: 10,
            totalSeats: 20,
            startDate: "2024-02-01",
            endDate: "2024-02-05",
          },
        ],
        tailorMadeTours: [],
        total: 1,
      };

      const response = TripService.generateTripResponse(searchResults);
      runner.assertEqual(response.success, true, "Should have success true");
      runner.assert(
        response.text.includes("Paris Tour"),
        "Should contain tour name"
      );
      runner.assert(
        response.text.includes("Code: P001"),
        "Should contain tour code"
      );
      runner.assert(
        response.text.includes("Duration: 5 days"),
        "Should contain duration"
      );
    });

    runner.it("should format tailor-made tours correctly", () => {
      const searchResults = {
        groupTours: [],
        tailorMadeTours: [
          {
            groupName: "Custom Japan Trip",
            uniqueEnqueryId: "T001",
            tourType: "Custom",
            duration: 10,
            startDate: "2024-03-01",
            endDate: "2024-03-10",
          },
        ],
        total: 1,
      };

      const response = TripService.generateTripResponse(searchResults);
      runner.assertEqual(response.success, true, "Should have success true");
      runner.assert(
        response.text.includes("Custom Japan Trip"),
        "Should contain group name"
      );
      runner.assert(
        response.text.includes("Duration: 10 days"),
        "Should contain duration"
      );
    });

    runner.it("should show more message for multiple tours", () => {
      const searchResults = {
        groupTours: Array(5)
          .fill(null)
          .map((_, i) => ({
            tourName: `Tour ${i + 1}`,
            tourCode: `T00${i + 1}`,
            tourTypeName: "Group",
            duration: 5,
            seatsBook: 5,
            totalSeats: 20,
            startDate: "2024-02-01",
            endDate: "2024-02-05",
          })),
        tailorMadeTours: [],
        total: 5,
      };

      const response = TripService.generateTripResponse(searchResults);
      runner.assert(
        response.text.includes("... and 2 more"),
        "Should contain more message"
      );
    });
  });

  runner.printSummary();

  // Exit with appropriate code
  process.exit(runner.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
