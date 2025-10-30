import * as TripService from "./TripService";
import * as apiServices from "./apiServices";

// Mock the apiServices
jest.mock("./apiServices");

describe("TripService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test: getGroupTours function
  describe("getGroupTours", () => {
    it("should fetch group tours with default parameters", async () => {
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

      apiServices.get.mockResolvedValueOnce({ data: mockData });

      const result = await TripService.getGroupTours();

      expect(apiServices.get).toHaveBeenCalledWith(
        "/view-group-tour?perPage=10&page=1&tourName=&tourType=&travelStartDate=&travelEndDate="
      );
      expect(result).toEqual(mockData);
    });

    it("should fetch group tours with custom filters", async () => {
      const mockData = { data: [], lastPage: 1, perPage: 5 };
      apiServices.get.mockResolvedValueOnce({ data: mockData });

      const filters = {
        tourName: "Paris",
        tourType: "Group",
        page: 2,
        perPage: 5,
        travelStartDate: "2024-02-01",
        travelEndDate: "2024-02-10",
      };

      const result = await TripService.getGroupTours(filters);

      expect(apiServices.get).toHaveBeenCalledWith(
        "/view-group-tour?perPage=5&page=2&tourName=Paris&tourType=Group&travelStartDate=2024-02-01&travelEndDate=2024-02-10"
      );
      expect(result).toEqual(mockData);
    });

    it("should handle errors when fetching group tours", async () => {
      const error = new Error("API Error");
      apiServices.get.mockRejectedValueOnce(error);

      await expect(TripService.getGroupTours()).rejects.toThrow("API Error");
    });
  });

  // Test: getTailorMadeTours function
  describe("getTailorMadeTours", () => {
    it("should fetch tailor-made tours with default parameters", async () => {
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

      apiServices.get.mockResolvedValueOnce({ data: mockData });

      const result = await TripService.getTailorMadeTours();

      expect(apiServices.get).toHaveBeenCalledWith(
        "/view-custom-tour?perPage=10&page=1&groupName=&startDate=&endDate="
      );
      expect(result).toEqual(mockData);
    });

    it("should fetch tailor-made tours with custom filters", async () => {
      const mockData = { data: [], lastPage: 1, perPage: 5 };
      apiServices.get.mockResolvedValueOnce({ data: mockData });

      const filters = {
        tourName: "Japan",
        page: 1,
        perPage: 5,
        travelStartDate: "2024-04-01",
        travelEndDate: "2024-04-15",
      };

      const result = await TripService.getTailorMadeTours(filters);

      expect(apiServices.get).toHaveBeenCalledWith(
        "/view-custom-tour?perPage=5&page=1&groupName=Japan&startDate=2024-04-01&endDate=2024-04-15"
      );
      expect(result).toEqual(mockData);
    });
  });

  // Test: getTourTypes function
  describe("getTourTypes", () => {
    it("should fetch tour types", async () => {
      const mockData = [
        { id: 1, typeName: "Group Tour" },
        { id: 2, typeName: "Tailor-Made" },
      ];

      apiServices.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await TripService.getTourTypes();

      expect(apiServices.get).toHaveBeenCalledWith("/tour-type-list");
      expect(result).toEqual(mockData);
    });

    it("should handle errors when fetching tour types", async () => {
      const error = new Error("Network Error");
      apiServices.get.mockRejectedValueOnce(error);

      await expect(TripService.getTourTypes()).rejects.toThrow("Network Error");
    });
  });

  // Test: getCities function
  describe("getCities", () => {
    it("should fetch cities", async () => {
      const mockData = [
        { id: 1, citiesName: "Paris" },
        { id: 2, citiesName: "Tokyo" },
      ];

      apiServices.get.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await TripService.getCities();

      expect(apiServices.get).toHaveBeenCalledWith("/city-list");
      expect(result).toEqual(mockData);
    });
  });

  // Test: searchTrips function
  describe("searchTrips", () => {
    it("should search and find matching group tours", async () => {
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

      apiServices.get
        .mockResolvedValueOnce({ data: groupToursData })
        .mockResolvedValueOnce({ data: tailorMadeData });

      const result = await TripService.searchTrips("Paris");

      expect(result.groupTours).toHaveLength(1);
      expect(result.groupTours[0].tourName).toBe("Paris Adventure");
      expect(result.total).toBe(1);
    });

    it("should return empty results when no trips match", async () => {
      const groupToursData = {
        data: [{ tourName: "Paris Tour", tourCode: "P001" }],
        lastPage: 1,
      };

      const tailorMadeData = { data: [], lastPage: 1 };

      apiServices.get
        .mockResolvedValueOnce({ data: groupToursData })
        .mockResolvedValueOnce({ data: tailorMadeData });

      const result = await TripService.searchTrips("Dubai");

      expect(result.total).toBe(0);
      expect(result.groupTours).toHaveLength(0);
    });

    it("should handle case-insensitive search", async () => {
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

      apiServices.get
        .mockResolvedValueOnce({ data: groupToursData })
        .mockResolvedValueOnce({ data: tailorMadeData });

      const result = await TripService.searchTrips("LONDON");

      expect(result.groupTours).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  // Test: generateTripResponse function
  describe("generateTripResponse", () => {
    it('should return "no results" message when no trips found', () => {
      const searchResults = {
        groupTours: [],
        tailorMadeTours: [],
        total: 0,
      };

      const response = TripService.generateTripResponse(searchResults);

      expect(response.success).toBe(false);
      expect(response.text).toContain("couldn't find any trips");
    });

    it("should format group tours correctly", () => {
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

      expect(response.success).toBe(true);
      expect(response.text).toContain("Paris Tour");
      expect(response.text).toContain("Code: P001");
      expect(response.text).toContain("Duration: 5 days");
      expect(response.text).toContain("Seats: 10/20 booked");
    });

    it("should format tailor-made tours correctly", () => {
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

      expect(response.success).toBe(true);
      expect(response.text).toContain("Custom Japan Trip");
      expect(response.text).toContain("ID: T001");
      expect(response.text).toContain("Duration: 10 days");
    });

    it('should handle multiple tours and show "more" message', () => {
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

      expect(response.text).toContain("... and 2 more group tours");
    });

    it("should return data along with formatted text", () => {
      const searchResults = {
        groupTours: [
          {
            tourName: "Test Tour",
            tourCode: "T001",
            tourTypeName: "Group",
            duration: 5,
            seatsBook: 5,
            totalSeats: 20,
            startDate: "2024-02-01",
            endDate: "2024-02-05",
          },
        ],
        tailorMadeTours: [],
        total: 1,
      };

      const response = TripService.generateTripResponse(searchResults);

      expect(response.data).toBeDefined();
      expect(response.data.groupTours).toHaveLength(1);
      expect(response.data.tailorMadeTours).toHaveLength(0);
    });
  });
});
