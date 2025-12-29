const pool = require("../../database/pool");

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

module.exports = {
  listLeadSales,
};
