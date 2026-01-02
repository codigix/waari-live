const feedbackEntries = [
  {
    id: 1,
    tourName: "Majestic Rajasthan",
    name: "Aditya Kulkarni",
    email: "aditya.kulkarni@example.com",
    contact: "+91-9820132456",
    startDate: "2025-01-12",
    endDate: "2025-01-19",
    feedback: "Brilliant itinerary and stay arrangements, loved the desert camp night.",
  },
  {
    id: 2,
    tourName: "Himalayan Serenity",
    name: "Sanya Rao",
    email: "sanya.rao@example.com",
    contact: "+91-9876543210",
    startDate: "2025-02-04",
    endDate: "2025-02-11",
    feedback: "Guides were very supportive, transport could be slightly better.",
  },
  {
    id: 3,
    tourName: "Backwaters Bliss",
    name: "Devang Patel",
    email: "devang.patel@example.com",
    contact: "+91-7712349988",
    startDate: "2025-03-08",
    endDate: "2025-03-14",
    feedback: "Kerala houseboat experience was memorable and peaceful.",
  },
  {
    id: 4,
    tourName: "Eastern Himalaya Discovery",
    name: "Ishita Bhatt",
    email: "ishita.bhatt@example.com",
    contact: "+91-9812345566",
    startDate: "2025-03-20",
    endDate: "2025-03-27",
    feedback: "Loved the food recommendations and curated local experiences.",
  },
  {
    id: 5,
    tourName: "Coastal Karnataka",
    name: "Rohan Vora",
    email: "rohan.vora@example.com",
    contact: "+91-9001234567",
    startDate: "2025-04-02",
    endDate: "2025-04-09",
    feedback: "Great pacing for family, kids enjoyed the beach-side activities.",
  },
  {
    id: 6,
    tourName: "Vintage Europe",
    name: "Neelam Sethi",
    email: "neelam.sethi@example.com",
    contact: "+91-9898989898",
    startDate: "2025-04-18",
    endDate: "2025-04-29",
    feedback: "Visa assistance and city guides made the trip seamless.",
  },
  {
    id: 7,
    tourName: "Mystic North East",
    name: "Arjun Paul",
    email: "arjun.paul@example.com",
    contact: "+91-9123456780",
    startDate: "2025-05-05",
    endDate: "2025-05-12",
    feedback: "Road travel was comfortable, would recommend adding cultural workshops.",
  },
  {
    id: 8,
    tourName: "Charismatic Central India",
    name: "Tanvi Naik",
    email: "tanvi.naik@example.com",
    contact: "+91-9345678901",
    startDate: "2025-05-17",
    endDate: "2025-05-24",
    feedback: "Safari experience was top notch, thanks for the surprise upgrade.",
  },
  {
    id: 9,
    tourName: "Island Hopper Maldives",
    name: "Pratiksha Jain",
    email: "pratiksha.jain@example.com",
    contact: "+91-9765432109",
    startDate: "2025-06-01",
    endDate: "2025-06-05",
    feedback: "Best anniversary trip we have taken, water villa was stunning.",
  },
  {
    id: 10,
    tourName: "Jordan Expedition",
    name: "Vikram Shetty",
    email: "vikram.shetty@example.com",
    contact: "+91-9650087451",
    startDate: "2025-06-10",
    endDate: "2025-06-18",
    feedback: "Petra tour guide was very knowledgeable, itinerary was well-balanced.",
  },
];

const paginate = (items, page, perPage) => {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const offset = (currentPage - 1) * perPage;
  return {
    data: items.slice(offset, offset + perPage),
    total,
    perPage,
    page: currentPage,
    lastPage,
  };
};

const listFeedbacks = ({ page, perPage }) => paginate(feedbackEntries, page, perPage);

module.exports = {
  listFeedbacks,
};
