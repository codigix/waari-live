const pool = require("../../database/pool");

const USER_DIRECTORY = [
  { userId: 101, userName: "Anita Shah", email: "anita.shah@waari.travel", contact: "9823001100", roleName: "Team Lead" },
  { userId: 102, userName: "Sagar Joshi", email: "sagar.joshi@waari.travel", contact: "9833002200", roleName: "Team Lead" },
  { userId: 103, userName: "Harshit Deshmukh", email: "harshit.deshmukh@waari.travel", contact: "9844003300", roleName: "Team Lead" },
  { userId: 104, userName: "Varsha Patil", email: "varsha.patil@waari.travel", contact: "9855004400", roleName: "Team Lead" },
  { userId: 105, userName: "Nikhil Bhat", email: "nikhil.bhat@waari.travel", contact: "9866005500", roleName: "Team Lead" },
  { userId: 201, userName: "Rahul Verma", email: "rahul.verma@waari.travel", contact: "9823011122", roleName: "Senior Agent" },
  { userId: 202, userName: "Sneha Kulkarni", email: "sneha.kulkarni@waari.travel", contact: "9833099900", roleName: "Senior Agent" },
  { userId: 203, userName: "Rohan Kapoor", email: "rohan.kapoor@waari.travel", contact: "9844588877", roleName: "Sales Agent" },
  { userId: 204, userName: "Meera Iyer", email: "meera.iyer@waari.travel", contact: "9855077766", roleName: "Sales Agent" },
  { userId: 205, userName: "Riya Patel", email: "riya.patel@waari.travel", contact: "9866066655", roleName: "Sales Agent" },
  { userId: 206, userName: "Aarav Sharma", email: "aarav.sharma@waari.travel", contact: "9877055544", roleName: "Sales Agent" },
  { userId: 207, userName: "Neha Pawar", email: "neha.pawar@waari.travel", contact: "9888044433", roleName: "Sales Agent" },
  { userId: 208, userName: "Dev Anand", email: "dev.anand@waari.travel", contact: "9899033322", roleName: "Sales Agent" },
  { userId: 209, userName: "Samar Gupta", email: "samar.gupta@waari.travel", contact: "9810122211", roleName: "Sales Agent" },
  { userId: 210, userName: "Imran Shaikh", email: "imran.shaikh@waari.travel", contact: "9821432100", roleName: "Sales Agent" },
  { userId: 211, userName: "Shweta Nair", email: "shweta.nair@waari.travel", contact: "9832543210", roleName: "Sales Agent" },
  { userId: 212, userName: "Kiran Rao", email: "kiran.rao@waari.travel", contact: "9843654321", roleName: "Sales Agent" },
  { userId: 213, userName: "Juhi Wadhwa", email: "juhi.wadhwa@waari.travel", contact: "9854765432", roleName: "Sales Agent" },
  { userId: 214, userName: "Parth Mehta", email: "parth.mehta@waari.travel", contact: "9865876543", roleName: "Sales Agent" },
];

const TEAM_LEAD_LIST = [
  {
    id: 1,
    teamName: "Alpha Achievers",
    leadId: "Anita Shah",
    leadUserId: 101,
    assignAgent: ["Rahul Verma", "Sneha Kulkarni", "Rohan Kapoor"],
    assignAgentIds: [201, 202, 203],
  },
  {
    id: 2,
    teamName: "Voyage Vanguard",
    leadId: "Sagar Joshi",
    leadUserId: 102,
    assignAgent: ["Meera Iyer", "Riya Patel"],
    assignAgentIds: [204, 205],
  },
  {
    id: 3,
    teamName: "Trailblazer Squad",
    leadId: "Harshit Deshmukh",
    leadUserId: 103,
    assignAgent: ["Aarav Sharma", "Neha Pawar", "Dev Anand", "Samar Gupta"],
    assignAgentIds: [206, 207, 208, 209],
  },
  {
    id: 4,
    teamName: "Summit Circle",
    leadId: "Varsha Patil",
    leadUserId: 104,
    assignAgent: ["Imran Shaikh", "Shweta Nair"],
    assignAgentIds: [210, 211],
  },
  {
    id: 5,
    teamName: "Horizon Crew",
    leadId: "Nikhil Bhat",
    leadUserId: 105,
    assignAgent: ["Kiran Rao", "Juhi Wadhwa", "Parth Mehta"],
    assignAgentIds: [212, 213, 214],
  },
];

const SALES_TEAM_MEMBERS = USER_DIRECTORY.filter((user) => user.userId >= 201).map(({ userId, userName }) => ({
  userId,
  userName,
}));

const SAMPLE_GROUP_TOURS = [
  "Alpine Discovery",
  "Maldives Escape",
  "Himalayan Circuit",
  "Iceland Lights",
  "Kenyan Safari",
  "Balkan Explorer",
];

const SAMPLE_CUSTOM_DESTINATIONS = [
  "Swiss Trails",
  "Kyoto Blossoms",
  "Andean Peaks",
  "Santorini Blends",
  "Perth Coast",
  "Canadian Rockies",
];

const SAMPLE_THEMES = ["Retreat", "Expedition", "Odyssey", "Journey", "Quest"];
const SAMPLE_LAST_NAMES = ["Kulkarni", "Deshmukh", "Patel", "Sharma", "Rao", "Menon"];
const ENQUIRY_STATUSES = ["NEW", "FOLLOW_UP", "PROPOSAL", "CONFIRMED"];

const STAGE_TWO_ENTRY_PAGES = [
  {
    pageId: "website-enquiry-form",
    title: "Website Enquiry Form",
    channel: "Website",
    intent: "Inbound lead capture",
  },
  {
    pageId: "presales-enquiry",
    title: "Presales Enquiry",
    channel: "Presales",
    intent: "Manual entry by sales desk",
  },
  {
    pageId: "my-enquiries",
    title: "My Enquiries",
    channel: "Sales Console",
    intent: "Owner level tracking",
  },
  {
    pageId: "group-tours-enquiries",
    title: "Group Tours Enquiries",
    channel: "Group Tours",
    intent: "Specific departure requests",
  },
  {
    pageId: "customized-tours-enquiries",
    title: "Customized Tours Enquiries",
    channel: "Tailor-made",
    intent: "Requirement-based capture",
  },
];

const STAGE_TWO_CASE_META = {
  groupTour: {
    caseId: "GROUP_TOUR_ENQUIRY",
    title: "Case A: Group Tour Enquiry",
    description: "Customer selects a published group tour and raises an enquiry that flows into the Enquiry Follow-up queue.",
    pagesInvolved: ["Enquiry Follow-up", "Group Tours Enquiries", "All Group Tours Enquiries"],
    flow: [
      "Customer selects a specific Group Tour",
      "Enquiry created with tourId, customer details, travel date, status set to NEW",
      "Record routed to Enquiry Follow-up for action",
    ],
    queue: "Enquiry Follow-up",
    primaryStatus: "NEW",
    secondaryStatus: "FOLLOW_UP",
  },
  customizedTour: {
    caseId: "CUSTOMIZED_TOUR_ENQUIRY",
    title: "Case B: Customized Tour Enquiry",
    description: "Customer shares destination, dates, and budget without linking a fixed tour; status stays New or Requirement Pending.",
    pagesInvolved: ["Customized Tours Enquiries", "All Customized Tours Enquiries"],
    flow: [
      "Customer submits requirement with destination, dates, and budget",
      "No fixed tour mapped yet, planner reviews scope",
      "Status tracked as NEW or REQUIREMENT_PENDING until scoped",
    ],
    queue: "Customized Tours Enquiries",
    primaryStatus: "NEW",
    secondaryStatus: "REQUIREMENT_PENDING",
  },
};

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (date, offset) => {
  const cloned = new Date(date);
  cloned.setDate(cloned.getDate() + offset);
  return cloned;
};

const formatDateOnly = (date) => date.toISOString().slice(0, 10);

const generateContactNumber = (seed) => {
  const base = 9100000000;
  const value = base + (seed % 899999999);
  return String(value);
};

const findUserById = (userId) => USER_DIRECTORY.find((user) => Number(user.userId) === Number(userId));

const findTeamByAgentId = (agentId) => TEAM_LEAD_LIST.find((team) => team.assignAgentIds.includes(agentId));

const normalizeAgentIds = (agentIds, leadUserId) => {
  if (!Array.isArray(agentIds)) {
    return [];
  }
  const unique = [...new Set(agentIds.map((id) => toPositiveInt(id, null)).filter(Boolean))];
  return unique.filter((id) => Number(id) !== Number(leadUserId));
};

const toSortableTimestamp = (value) => {
  if (!value) {
    return 0;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatDisplayDate = (value) => {
  if (!value) {
    return "";
  }
  if (value instanceof Date) {
    return formatDateOnly(value);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return formatDateOnly(date);
};

const normalizeStatusToken = (status, fallback = "NEW", remap = {}) => {
  const token = (status || "").toString().trim().toUpperCase();
  if (!token) {
    return fallback;
  }
  return remap[token] || token;
};

const summarizeStatusBreakdown = (records, statusAccessor, fallback, remap = {}) => {
  const breakdown = {};
  const accessor = typeof statusAccessor === "function" ? statusAccessor : () => null;
  records.forEach((record) => {
    const token = normalizeStatusToken(accessor(record), fallback, remap);
    breakdown[token] = (breakdown[token] || 0) + 1;
  });
  return breakdown;
};

const buildCaseSummary = (records, options = {}) => ({
  total: records.length,
  breakdown: summarizeStatusBreakdown(
    records,
    options.statusAccessor,
    options.defaultStatus || "NEW",
    options.remap || {}
  ),
});

const buildRecentEnquiries = (records, selectors = {}, limit = 5) => {
  if (!records.length) {
    return [];
  }
  const sortAccessor = selectors.sortBy || (() => null);
  const idAccessor = selectors.id || (() => null);
  const referenceAccessor = selectors.reference || (() => "");
  const customerAccessor = selectors.customer || (() => "");
  const assignedAccessor = selectors.assignedUser || (() => "");
  const travelAccessor = selectors.travelDate || (() => null);
  const statusAccessor = selectors.status || (() => "");
  const capturedAccessor = selectors.capturedAt || (() => null);
  return [...records]
    .sort((a, b) => toSortableTimestamp(sortAccessor(b)) - toSortableTimestamp(sortAccessor(a)))
    .slice(0, limit)
    .map((record) => ({
      id: idAccessor(record),
      reference: referenceAccessor(record),
      customer: customerAccessor(record),
      assignedUser: assignedAccessor(record),
      travelDate: formatDisplayDate(travelAccessor(record)),
      capturedAt: formatDisplayDate(capturedAccessor(record)),
      status: statusAccessor(record),
    }));
};

const buildCasePayload = (meta, summary, latest) => {
  const primaryKey = meta.primaryStatus || meta.defaultStatus || "NEW";
  const secondaryKey = meta.secondaryStatus || null;
  return {
    caseId: meta.caseId,
    title: meta.title,
    description: meta.description,
    pagesInvolved: [...meta.pagesInvolved],
    flow: [...meta.flow],
    queue: meta.queue,
    summary: {
      totalEnquiries: summary.total,
      primaryStatus: primaryKey,
      primaryStatusCount: summary.breakdown[primaryKey] || 0,
      secondaryStatus: secondaryKey,
      secondaryStatusCount: secondaryKey ? summary.breakdown[secondaryKey] || 0 : 0,
      statusBreakdown: summary.breakdown,
    },
    latestEnquiries: latest,
  };
};

let groupSalesSequence = 4500;
let customSalesSequence = 5500;
const groupSalesEnquiries = [];
const customSalesEnquiries = [];

const createGroupSalesEnquiry = (agentId, bias = 0) => {
  const agent = findUserById(agentId) || { userName: `Agent ${agentId}` };
  const today = startOfToday();
  groupSalesSequence += 1;
  const tourName = SAMPLE_GROUP_TOURS[(groupSalesSequence + bias) % SAMPLE_GROUP_TOURS.length];
  const team = findTeamByAgentId(agentId);
  const baseName = team ? team.teamName.split(" ")[0] : agent.userName.split(" ")[0];
  const enquiryDate = addDays(today, -((groupSalesSequence % 9) + 1));
  const startDate = addDays(today, (groupSalesSequence % 5) + 2);
  const endDate = addDays(startDate, Math.max(3, (groupSalesSequence % 4) + 3));
  const status = ENQUIRY_STATUSES[groupSalesSequence % ENQUIRY_STATUSES.length];
  return {
    enquiryGroupId: groupSalesSequence,
    uniqueEnqueryId: `GT-${groupSalesSequence}`,
    tourName,
    groupName: `${baseName} ${SAMPLE_THEMES[groupSalesSequence % SAMPLE_THEMES.length]}`.trim(),
    enquiryProcess: status,
    startDate: formatDateOnly(startDate),
    endDate: formatDateOnly(endDate),
    enquiryDate: formatDateOnly(enquiryDate),
    guestName: `${agent.userName.split(" ")[0]} Family`,
    contact: generateContactNumber(groupSalesSequence + agentId),
    paxNo: 2 + ((groupSalesSequence + bias) % 6),
    assignedUserId: agentId,
    assignedUserName: agent.userName,
  };
};

const createCustomSalesEnquiry = (agentId, bias = 0) => {
  const agent = findUserById(agentId) || { userName: `Agent ${agentId}` };
  const today = startOfToday();
  customSalesSequence += 1;
  const destinationName = SAMPLE_CUSTOM_DESTINATIONS[(customSalesSequence + bias) % SAMPLE_CUSTOM_DESTINATIONS.length];
  const team = findTeamByAgentId(agentId);
  const baseName = team ? team.teamName.split(" ")[0] : agent.userName.split(" ")[0];
  const enqDate = addDays(today, -((customSalesSequence % 12) + 2));
  const startDate = addDays(today, (customSalesSequence % 7) + 5);
  const endDate = addDays(startDate, Math.max(4, (customSalesSequence % 5) + 4));
  const status = ENQUIRY_STATUSES[customSalesSequence % ENQUIRY_STATUSES.length];
  const lastName = SAMPLE_LAST_NAMES[(customSalesSequence + bias) % SAMPLE_LAST_NAMES.length];
  return {
    enquiryCustomId: customSalesSequence,
    uniqueEnqueryId: `CT-${customSalesSequence}`,
    groupName: `${baseName} ${SAMPLE_THEMES[(customSalesSequence + 1) % SAMPLE_THEMES.length]}`.trim(),
    enquiryProcess: status,
    startDate: formatDateOnly(startDate),
    endDate: formatDateOnly(endDate),
    enqDate: formatDateOnly(enqDate),
    contactName: `${agent.userName.split(" ")[0]} ${lastName}`.trim(),
    contact: generateContactNumber(customSalesSequence + agentId + 50),
    pax: 2 + ((customSalesSequence + bias) % 5),
    destinationName,
    assignedUserId: agentId,
    assignedUserName: agent.userName,
  };
};

const ensureAgentSalesFixtures = (agentId) => {
  const id = toPositiveInt(agentId, null);
  if (!id) {
    return;
  }
  const user = findUserById(id);
  if (!user || user.userId < 201) {
    return;
  }
  if (!groupSalesEnquiries.some((record) => Number(record.assignedUserId) === id)) {
    groupSalesEnquiries.push(createGroupSalesEnquiry(id, groupSalesEnquiries.length));
  }
  if (!customSalesEnquiries.some((record) => Number(record.assignedUserId) === id)) {
    customSalesEnquiries.push(createCustomSalesEnquiry(id, customSalesEnquiries.length));
  }
};

const bootstrapSalesFixtures = () => {
  TEAM_LEAD_LIST.forEach((team, teamIndex) => {
    team.assignAgentIds.forEach((agentId, agentIndex) => {
      groupSalesEnquiries.push(createGroupSalesEnquiry(agentId, teamIndex + agentIndex));
      customSalesEnquiries.push(createCustomSalesEnquiry(agentId, teamIndex + agentIndex));
    });
  });
};

bootstrapSalesFixtures();

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

const listLeadSales = async () => {
  const [rows] = await pool.query(
    `SELECT t.teamId, t.teamName, t.teamLeadId,
            lead.userName AS leadName,
            lead.email AS leadEmail,
            COALESCE(SUM(st.targetAmount), 0) AS totalTarget,
            COALESCE(SUM(st.achievedAmount), 0) AS totalAchieved,
            COUNT(DISTINCT tm.userId) AS memberCount
       FROM teams t
       LEFT JOIN users lead ON lead.userId = t.teamLeadId
       LEFT JOIN team_members tm ON tm.teamId = t.teamId
       LEFT JOIN sales_targets st ON st.teamId = t.teamId
      GROUP BY t.teamId, t.teamName, t.teamLeadId, lead.userName, lead.email
      ORDER BY t.teamName ASC`
  );

  return rows.map((row) => ({
    teamId: row.teamId,
    teamName: row.teamName,
    lead: {
      userId: row.teamLeadId,
      name: row.leadName,
      email: row.leadEmail,
    },
    targets: {
      totalTarget: Number(row.totalTarget) || 0,
      totalAchieved: Number(row.totalAchieved) || 0,
    },
    memberCount: row.memberCount,
  }));
};

const listSalesTeamLeadListing = ({ page, perPage }) => paginate(TEAM_LEAD_LIST, page, perPage);

const listSalesTeamLeadMembers = ({ page, perPage }) => paginate(SALES_TEAM_MEMBERS, page, perPage);

const listAllUsersDropdown = () => ({
  data: USER_DIRECTORY.map((user) => ({
    userId: user.userId,
    userName: user.userName,
    email: user.email,
    contact: user.contact,
    roleName: user.roleName,
  })),
  total: USER_DIRECTORY.length,
  message: USER_DIRECTORY.length ? "Users fetched successfully" : "No users available",
});

const listSalesUnderTeamLead = () => ({
  data: SALES_TEAM_MEMBERS,
  total: SALES_TEAM_MEMBERS.length,
  message: SALES_TEAM_MEMBERS.length ? "Sales agents fetched successfully" : "No sales agents available",
});

const viewLeadData = (id) => {
  const leadId = toPositiveInt(id, null);
  if (!leadId) {
    return { data: null, message: "id is required" };
  }
  const entry = TEAM_LEAD_LIST.find((team) => Number(team.id) === leadId);
  if (!entry) {
    return { data: null, message: "Team lead not found" };
  }
  const assignAgent = entry.assignAgentIds
    .map((agentId) => findUserById(agentId))
    .filter(Boolean)
    .map((agent) => ({ userId: agent.userId, userName: agent.userName }));
  return {
    data: {
      id: entry.id,
      teamName: entry.teamName,
      leadName: entry.teamName,
      leadId: entry.leadUserId,
      leadUserName: entry.leadId,
      assignAgent,
    },
    message: "Team lead fetched successfully",
  };
};

const nextTeamId = () => TEAM_LEAD_LIST.reduce((max, team) => Math.max(max, team.id), 0) + 1;

const buildTeamResponse = (team) => ({
  id: team.id,
  teamName: team.teamName,
  leadId: team.leadId,
  leadUserId: team.leadUserId,
  assignAgent: [...team.assignAgent],
  assignAgentIds: [...team.assignAgentIds],
});

const addTeamLead = ({ teamName, userId, assignAgents }) => {
  const trimmedName = typeof teamName === "string" ? teamName.trim() : "";
  const leadUserId = toPositiveInt(userId, null);
  if (!trimmedName || !leadUserId) {
    return { data: null, message: "teamName and userId are required" };
  }
  const leadUser = findUserById(leadUserId);
  if (!leadUser) {
    return { data: null, message: "Lead user not found" };
  }
  const agentIds = normalizeAgentIds(assignAgents, leadUserId);
  if (!agentIds.length) {
    return { data: null, message: "assignAgents is required" };
  }
  const agentUsers = agentIds.map((agentId) => findUserById(agentId)).filter(Boolean);
  if (!agentUsers.length) {
    return { data: null, message: "assignAgents is invalid" };
  }
  const team = {
    id: nextTeamId(),
    teamName: trimmedName,
    leadId: leadUser.userName,
    leadUserId: leadUser.userId,
    assignAgent: agentUsers.map((agent) => agent.userName),
    assignAgentIds: agentUsers.map((agent) => agent.userId),
  };
  TEAM_LEAD_LIST.push(team);
  agentUsers.forEach((agent) => ensureAgentSalesFixtures(agent.userId));
  return {
    success: true,
    data: buildTeamResponse(team),
    message: "Team lead added successfully",
  };
};

const updateTeamLead = ({ id, teamName, userId, assignAgents }) => {
  const teamId = toPositiveInt(id, null);
  if (!teamId) {
    return { data: null, message: "id is required" };
  }
  const entry = TEAM_LEAD_LIST.find((team) => Number(team.id) === teamId);
  if (!entry) {
    return { data: null, message: "Team lead not found" };
  }
  const trimmedName = typeof teamName === "string" && teamName.trim() ? teamName.trim() : entry.teamName;
  const leadUserId = toPositiveInt(userId, entry.leadUserId);
  const leadUser = findUserById(leadUserId);
  if (!leadUser) {
    return { data: null, message: "Lead user not found" };
  }
  const agentIds = normalizeAgentIds(assignAgents && assignAgents.length ? assignAgents : entry.assignAgentIds, leadUserId);
  if (!agentIds.length) {
    return { data: null, message: "assignAgents is required" };
  }
  const agentUsers = agentIds.map((agentId) => findUserById(agentId)).filter(Boolean);
  if (!agentUsers.length) {
    return { data: null, message: "assignAgents is invalid" };
  }
  entry.teamName = trimmedName;
  entry.leadUserId = leadUser.userId;
  entry.leadId = leadUser.userName;
  entry.assignAgentIds = agentUsers.map((agent) => agent.userId);
  entry.assignAgent = agentUsers.map((agent) => agent.userName);
  agentUsers.forEach((agent) => ensureAgentSalesFixtures(agent.userId));
  return {
    success: true,
    data: buildTeamResponse(entry),
    message: "Team lead updated successfully",
  };
};

const listGroupSalesEnquiries = ({ userId, page = 1, perPage = 10 } = {}) => {
  const targetUserId = toPositiveInt(userId, null);
  if (targetUserId) {
    ensureAgentSalesFixtures(targetUserId);
  }
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = groupSalesEnquiries.filter((record) =>
    targetUserId ? Number(record.assignedUserId) === targetUserId : true
  );
  const pagination = paginate(records, pageNumber, perPageNumber);
  return {
    data: pagination.data,
    total: pagination.total,
    page: pagination.page,
    perPage: pagination.perPage,
    lastPage: pagination.lastPage,
    message: pagination.total ? "Group enquiries fetched successfully" : "No group enquiries available",
  };
};

const listCustomSalesEnquiries = ({ userId, page = 1, perPage = 10 } = {}) => {
  const targetUserId = toPositiveInt(userId, null);
  if (targetUserId) {
    ensureAgentSalesFixtures(targetUserId);
  }
  const pageNumber = toPositiveInt(page, 1) || 1;
  const perPageNumber = toPositiveInt(perPage, 10) || 10;
  const records = customSalesEnquiries.filter((record) =>
    targetUserId ? Number(record.assignedUserId) === targetUserId : true
  );
  const pagination = paginate(records, pageNumber, perPageNumber);
  return {
    data: pagination.data,
    total: pagination.total,
    page: pagination.page,
    perPage: pagination.perPage,
    lastPage: pagination.lastPage,
    message: pagination.total ? "Custom enquiries fetched successfully" : "No custom enquiries available",
  };
};

const assignGroupEnquiry = ({ enquiryGroupId, userId }) => {
  const enquiryId = toPositiveInt(enquiryGroupId, null);
  const targetUserId = toPositiveInt(userId, null);
  if (!enquiryId || !targetUserId) {
    return { success: false, message: "enquiryGroupId and userId are required" };
  }
  const record = groupSalesEnquiries.find((entry) => Number(entry.enquiryGroupId) === enquiryId);
  if (!record) {
    return { success: false, message: "Group enquiry not found" };
  }
  const user = findUserById(targetUserId);
  if (!user || user.userId < 201) {
    return { success: false, message: "Sales agent not found" };
  }
  record.assignedUserId = user.userId;
  record.assignedUserName = user.userName;
  ensureAgentSalesFixtures(user.userId);
  return { success: true, message: "Group enquiry assigned successfully" };
};

const assignCustomEnquiry = ({ enquiryCustomId, userId }) => {
  const enquiryId = toPositiveInt(enquiryCustomId, null);
  const targetUserId = toPositiveInt(userId, null);
  if (!enquiryId || !targetUserId) {
    return { success: false, message: "enquiryCustomId and userId are required" };
  }
  const record = customSalesEnquiries.find((entry) => Number(entry.enquiryCustomId) === enquiryId);
  if (!record) {
    return { success: false, message: "Custom enquiry not found" };
  }
  const user = findUserById(targetUserId);
  if (!user || user.userId < 201) {
    return { success: false, message: "Sales agent not found" };
  }
  record.assignedUserId = user.userId;
  record.assignedUserName = user.userName;
  ensureAgentSalesFixtures(user.userId);
  return { success: true, message: "Custom enquiry assigned successfully" };
};

const getSalesStageTwoWorkflow = () => {
  const groupMeta = STAGE_TWO_CASE_META.groupTour;
  const customMeta = STAGE_TWO_CASE_META.customizedTour;
  const groupSummary = buildCaseSummary(groupSalesEnquiries, {
    statusAccessor: (record) => record.enquiryProcess || record.status,
    defaultStatus: groupMeta.primaryStatus,
  });
  const customSummary = buildCaseSummary(customSalesEnquiries, {
    statusAccessor: (record) => record.enquiryProcess,
    defaultStatus: customMeta.primaryStatus,
    remap: { FOLLOW_UP: "REQUIREMENT_PENDING" },
  });
  const groupLatest = buildRecentEnquiries(groupSalesEnquiries, {
    sortBy: (record) => record.enquiryDate || record.startDate,
    capturedAt: (record) => record.enquiryDate,
    id: (record) => record.enquiryGroupId,
    reference: (record) => record.uniqueEnqueryId,
    customer: (record) => record.guestName || record.groupName,
    assignedUser: (record) => record.assignedUserName,
    travelDate: (record) => record.startDate || record.endDate,
    status: (record) => normalizeStatusToken(record.enquiryProcess, groupMeta.primaryStatus),
  });
  const customLatest = buildRecentEnquiries(customSalesEnquiries, {
    sortBy: (record) => record.enqDate || record.startDate,
    capturedAt: (record) => record.enqDate,
    id: (record) => record.enquiryCustomId,
    reference: (record) => record.uniqueEnqueryId,
    customer: (record) => record.contactName || record.groupName,
    assignedUser: (record) => record.assignedUserName,
    travelDate: (record) => record.startDate || record.endDate,
    status: (record) =>
      normalizeStatusToken(record.enquiryProcess, customMeta.primaryStatus, { FOLLOW_UP: "REQUIREMENT_PENDING" }),
  });
  const groupCase = buildCasePayload(groupMeta, groupSummary, groupLatest);
  const customCase = buildCasePayload(customMeta, customSummary, customLatest);
  return {
    stageId: "SALES_STAGE_TWO",
    title: "Stage 2: Enquiry Comes In (Sales Entry Point)",
    entryPages: STAGE_TWO_ENTRY_PAGES,
    cases: {
      groupTour: groupCase,
      customizedTour: customCase,
    },
    totals: {
      overallEnquiries: groupSummary.total + customSummary.total,
      newCount:
        (groupSummary.breakdown[groupMeta.primaryStatus] || 0) +
        (customSummary.breakdown[customMeta.primaryStatus] || 0),
    },
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  listLeadSales,
  listSalesTeamLeadListing,
  listSalesTeamLeadMembers,
  listAllUsersDropdown,
  listSalesUnderTeamLead,
  viewLeadData,
  addTeamLead,
  updateTeamLead,
  listGroupSalesEnquiries,
  listCustomSalesEnquiries,
  assignGroupEnquiry,
  assignCustomEnquiry,
  getSalesStageTwoWorkflow,
};
