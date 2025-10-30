file_path = r"D:\Waari\waari-nodejs\src\routes\groupTourRoute.js"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find the line with "const [totalRows]"
start_idx = None
for i, line in enumerate(lines):
    if "const [totalRows] = await db.query(" in line:
        start_idx = i - 1  # Start from the comment line
        break

if start_idx is not None:
    print(f"Found target at line {start_idx + 1}")
    
    # Find the end of the old section (the closing brace of res.status)
    end_idx = None
    for i in range(start_idx + 1, len(lines)):
        if "});  // res.status closing" in lines[i] or ("})" in lines[i] and "res.status" in "".join(lines[max(0, i-10):i])):
            end_idx = i
            break
    
    # If we can't find it, search more carefully
    if end_idx is None:
        for i in range(start_idx + 1, len(lines)):
            if lines[i].strip() == "})" and i > start_idx + 10:
                # Check if this closes the res.status block
                end_idx = i
                break
    
    if end_idx is not None:
        print(f"Found end at line {end_idx + 1}")
        
        # The new code to insert
        new_code = '''    // ✅ Build filtered query with JOIN to get tourTypeName
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
    });
'''
        
        # Replace the section
        new_lines = lines[:start_idx] + [new_code + "\n"] + lines[end_idx+1:]
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
        
        print("✅ Successfully replaced /view-group-tour endpoint!")
    else:
        print("❌ Could not find end of section")
else:
    print("❌ Could not find target section")
