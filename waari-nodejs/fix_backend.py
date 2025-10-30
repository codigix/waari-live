import re

file_path = r"D:\Waari\waari-nodejs\src\routes\groupTourRoute.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the view-group-tour endpoint and replace it
old_section = r'''    // TODO: Replace with actual filtered query
    const \[totalRows\] = await db\.query\(
      "SELECT COUNT\(\*\) AS total FROM grouptours"
    \);
    const total = totalRows\[0\]\?\.total \|\| 0;

    const \[data\] = await db\.query\("SELECT \* FROM grouptours LIMIT \? OFFSET \?", \[
      perPage,
      offset,
    \]\);

    res\.status\(200\)\.json\(\{
      message: "Group tours fetched successfully",
      filters,
      total, // total records for pagination
      perPage,
      page,
      data,
    \}\);'''

new_section = '''    // ✅ Build filtered query with JOIN to get tourTypeName
    let query = `
      SELECT g.*, t.tourTypeName
      FROM grouptours g
      LEFT JOIN tourtype t ON g.tourTypeId = t.tourTypeId
      WHERE 1=1
    `;
    let params = [];

    // ✅ Apply filters
    if (filters.tourName) {
      query += ` AND g.tourName LIKE ?`;
      params.push(`%${filters.tourName}%`);
    }

    if (filters.tourType) {
      query += ` AND g.tourTypeId = ?`;
      params.push(filters.tourType);
    }

    if (filters.travelStartDate && filters.travelEndDate) {
      query += ` AND g.startDate >= ? AND g.endDate <= ?`;
      params.push(filters.travelStartDate, filters.travelEndDate);
    } else if (filters.travelStartDate) {
      query += ` AND g.startDate >= ?`;
      params.push(filters.travelStartDate);
    } else if (filters.travelEndDate) {
      query += ` AND g.endDate <= ?`;
      params.push(filters.travelEndDate);
    }

    if (filters.totalDuration) {
      query += ` AND CONCAT(g.days, 'D-', g.night, 'N') LIKE ?`;
      params.push(`%${filters.totalDuration}%`);
    }

    if (filters.travelMonth) {
      const month = moment(filters.travelMonth, "YYYY-MM-DD").format("MM");
      query += ` AND MONTH(g.startDate) = ?`;
      params.push(month);
    }

    // ✅ Count total for pagination
    let countQuery = query.replace(/SELECT g\\.\*, t\\.tourTypeName/i, "SELECT COUNT(*) as total");
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    // ✅ Apply pagination and sorting
    query += ` ORDER BY g.created_at DESC LIMIT ? OFFSET ?`;
    params.push(perPage, offset);

    // ✅ Get filtered data
    const [data] = await db.query(query, params);

    res.status(200).json({
      message: "Group tours fetched successfully",
      filters,
      total, // total records for pagination
      perPage,
      page,
      currentPage: page,
      lastPage: Math.ceil(total / perPage),
      data,
    });'''

# Use a more flexible replacement
content = re.sub(old_section, new_section, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ Backend /view-group-tour endpoint FIXED with proper JOINs and filters!")
