const pool = require("../../database/pool");

const TEAM_LEAD_LIST = [
  {
    id: 1,
    teamName: "Alpha Achievers",
    leadId: "Anita Shah",
    assignAgent: ["Rahul Verma", "Sneha Kulkarni", "Rohan Kapoor"],
  },
  {
    id: 2,
    teamName: "Voyage Vanguard",
    leadId: "Sagar Joshi",
    assignAgent: ["Meera Iyer", "Riya Patel"],
  },
  {
    id: 3,
    teamName: "Trailblazer Squad",
    leadId: "Harshit Deshmukh",
    assignAgent: ["Aarav Sharma", "Neha Pawar", "Dev Anand", "Samar Gupta"],
  },
  {
    id: 4,
    teamName: "Summit Circle",
    leadId: "Varsha Patil",
    assignAgent: ["Imran Shaikh", "Shweta Nair"],
  },
  {
    id: 5,
    teamName: "Horizon Crew",
    leadId: "Nikhil Bhat",
    assignAgent: ["Kiran Rao", "Juhi Wadhwa", "Parth Mehta"],
  },
];

const SALES_TEAM_MEMBERS = [
  { userId: 201, userName: "Rahul Verma" },
  { userId: 202, userName: "Sneha Kulkarni" },
  { userId: 203, userName: "Rohan Kapoor" },
  { userId: 204, userName: "Meera Iyer" },
  { userId: 205, userName: "Riya Patel" },
  { userId: 206, userName: "Aarav Sharma" },
  { userId: 207, userName: "Neha Pawar" },
  { userId: 208, userName: "Dev Anand" },
  { userId: 209, userName: "Samar Gupta" },
  { userId: 210, userName: "Imran Shaikh" },
  { userId: 211, userName: "Shweta Nair" },
  { userId: 212, userName: "Kiran Rao" },
  { userId: 213, userName: "Juhi Wadhwa" },
  { userId: 214, userName: "Parth Mehta" },
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

module.exports = {
  listLeadSales,
  listSalesTeamLeadListing,
  listSalesTeamLeadMembers,
};
