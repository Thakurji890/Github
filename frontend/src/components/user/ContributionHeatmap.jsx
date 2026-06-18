import { useMemo } from "react";
import { Box, Typography, Tooltip, Paper } from "@mui/material";

const CONTRIBUTION_COLORS = {
  0: "#161b22", // Less
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353", // More
};

const CONTRIBUTION_COUNTS = {
  0: 0,
  1: 1,
  2: 3,
  3: 5,
  4: 8,
};

// Simple hash function to generate a seed from user name/id
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Helper to check contribution level for a date dynamically based on a seed
const getContributionForDate = (date, seed) => {
  const dateStr = date.toISOString().split("T")[0];
  const hash = hashCode(dateStr + seed);
  const val = hash % 100;
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  let level;
  if (isWeekend) {
    if (val < 70) level = 0;
    else if (val < 90) level = 1;
    else level = 2;
  } else {
    if (val < 40) level = 0;
    else if (val < 70) level = 1;
    else if (val < 85) level = 2;
    else if (val < 95) level = 3;
    else level = 4;
  }
  return {
    level,
    count: CONTRIBUTION_COUNTS[level],
  };
};

const ContributionHeatmap = ({ username }) => {
  const seed = useMemo(() => username || "default", [username]);

  // Generate calendar data for the last 53 weeks
  const { days, totalContributions, monthLabels } = useMemo(() => {
    const calendarData = [];
    const today = new Date();

    // Start 364 days ago (52 weeks)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Pad to the Sunday of that week
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    // Fill days
    const tempDate = new Date(startDate);
    while (tempDate <= today) {
      calendarData.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }

    let total = 0;
    const daysWithData = calendarData.map((date) => {
      const data = getContributionForDate(date, seed);
      total += data.count;
      return {
        date,
        ...data,
      };
    });

    // Extract month labels based on first day of each week
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels = [];
    let prevMonth = -1;

    for (let col = 0; col < Math.ceil(daysWithData.length / 7); col++) {
      const dayIdx = col * 7;
      if (dayIdx < daysWithData.length) {
        const date = daysWithData[dayIdx].date;
        const currentMonth = date.getMonth();
        if (currentMonth !== prevMonth) {
          labels.push({ label: months[currentMonth], colIndex: col });
          prevMonth = currentMonth;
        }
      }
    }

    // Adjust month labels so they don't overlap
    const filteredLabels = [];
    let lastColIdx = -4;
    labels.forEach((lbl) => {
      if (lbl.colIndex - lastColIdx >= 3) {
        filteredLabels.push(lbl);
        lastColIdx = lbl.colIndex;
      }
    });

    return {
      days: daysWithData,
      totalContributions: total,
      monthLabels: filteredLabels,
    };
  }, [seed]);

  const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 2,
        mt: 4,
      }}
    >
      <Typography sx={{ color: "#e6edf3", fontWeight: 600, fontSize: 15, mb: 2 }}>
        {totalContributions} contributions in the last year
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", overflowX: "auto", pb: 1 }}>
        {/* Month Labels */}
        <Box sx={{ display: "flex", pl: 3.5, position: "relative", height: 18, mb: 0.5 }}>
          {monthLabels.map((lbl, idx) => (
            <Typography
              key={idx}
              sx={{
                position: "absolute",
                left: `${35 + lbl.colIndex * 13}px`,
                fontSize: 10,
                color: "#8b949e",
                fontFamily: "inherit",
              }}
            >
              {lbl.label}
            </Typography>
          ))}
        </Box>

        {/* Calendar Grid Container */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          {/* Day Names (Only show Mon, Wed, Fri to match GitHub) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "repeat(7, 10px)",
              gap: "3px",
              height: 88,
              pt: 0.2,
            }}
          >
            {weekDayLabels.map((label, idx) => (
              <Typography
                key={idx}
                sx={{
                  fontSize: 9,
                  color: "#8b949e",
                  lineHeight: "10px",
                  visibility: idx % 2 === 1 ? "visible" : "hidden",
                  textAlign: "right",
                  pr: 0.5,
                  width: 20,
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>

          {/* Grid Squares */}
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "repeat(7, 10px)",
              gridAutoFlow: "column",
              gap: "3px",
            }}
          >
            {days.map((day, idx) => {
              const formattedDate = day.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <Tooltip
                  key={idx}
                  title={`${day.count} contributions on ${formattedDate}`}
                  arrow
                  placement="top"
                  enterTouchDelay={0}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "2px",
                      bgcolor: CONTRIBUTION_COLORS[day.level],
                      outline: "1px solid rgba(27, 31, 35, 0.06)",
                      cursor: "pointer",
                      transition: "transform 0.1s ease",
                      "&:hover": {
                        transform: "scale(1.15)",
                        zIndex: 1,
                      },
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5, mt: 2, pr: 1 }}>
          <Typography sx={{ fontSize: 10, color: "#8b949e" }}>Less</Typography>
          {[0, 1, 2, 3, 4].map((level) => (
            <Box
              key={level}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "2px",
                bgcolor: CONTRIBUTION_COLORS[level],
              }}
            />
          ))}
          <Typography sx={{ fontSize: 10, color: "#8b949e" }}>More</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ContributionHeatmap;
