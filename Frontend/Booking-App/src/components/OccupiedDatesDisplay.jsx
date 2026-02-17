import React, { useState, useEffect, useContext } from "react";
import "./OccupiedDatesDisplay.css";
import { UserContext } from "./UserContext";

const OccupiedDatesDisplay = () => {
  const [groupedDates, setGroupedDates] = useState({});
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    console.log(user);
    if (!user) {
      return;
    }

    const baseURL = "http://127.0.0.1:8000";
    async function fetchDates() {
      try {
        const response = await fetch(`${baseURL}/occupied-dates/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Fetch failed");
        }
        console.log(user.token);
        const data = await response.json(); // Parse the JSON response
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error during fetching dates:", error);
        return []; // Return an empty array if fetch fails
      }
    }

    async function processAndSetDates() {
      const fetchedDates = await fetchDates(); // Wait for fetchDates to resolve

      // Process dates into grouped ranges and carry room_type with ranges
      const processDates = (dates) => {
        // Convert to objects with date and roomType so we keep association
        const entries = dates.map((entry) => ({
          dateStr: entry.date,
          roomType: entry.room_type || (entry.room && entry.room.type) || null,
        }));

        // Ensure dates are sorted chronologically
        const sortedEntries = entries.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

        const ranges = {};
        let currentMonth = "";
        let currentRange = null;

        sortedEntries.forEach(({ dateStr, roomType }) => {
          // Parse the date explicitly to ensure it's valid
          const date = new Date(`${dateStr}T00:00:00`); // Add `T00:00:00` to avoid parsing issues

          if (isNaN(date.getTime())) {
            console.error("Invalid date:", dateStr);
            return; // Skip invalid dates
          }

          const month = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });

          if (month !== currentMonth) {
            // If month changes, finalize the previous range
            if (currentRange) {
              if (!ranges[currentMonth]) ranges[currentMonth] = [];
              ranges[currentMonth].push(currentRange);
            }
            currentMonth = month;
            currentRange = { startDate: dateStr, endDate: dateStr, roomType };
          } else {
            // Check if the date is consecutive
            const prevDate = new Date(`${currentRange.endDate}T00:00:00`);
            prevDate.setDate(prevDate.getDate() + 1); // Add 1 day to check continuity

            if (date.toISOString().split("T")[0] === prevDate.toISOString().split("T")[0]) {
              // Extend the current range. Keep the original roomType for the range.
              currentRange.endDate = dateStr;
            } else {
              // Finalize the current range and start a new one
              if (!ranges[currentMonth]) ranges[currentMonth] = [];
              ranges[currentMonth].push(currentRange);
              currentRange = { startDate: dateStr, endDate: dateStr, roomType };
            }
          }
        });

        // Finalize the last range
        if (currentRange) {
          if (!ranges[currentMonth]) ranges[currentMonth] = [];
          ranges[currentMonth].push(currentRange);
        }

        return ranges;
      };

      setGroupedDates(processDates(fetchedDates));
    }

    processAndSetDates(); // Fetch and process dates
  }, [user]); // Re-run when `user` changes

  return (
    <div className="occupied-dates-container">
      {Object.keys(groupedDates).map((month) => (
        <div key={month} className="month-section">
          <h2 className="month-title">{month}</h2>
          <div className="date-cards">
            {groupedDates[month].map((range, index) => (
              <div key={index} className="date-card">
                <p className="room-type">{range.roomType ? `Type: ${range.roomType}` : "Type: -"}</p>
                <p className="date-range">
                  {new Date(range.startDate).toLocaleDateString("hu")} -{" "}
                  {new Date(range.endDate).toLocaleDateString("hu")}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OccupiedDatesDisplay;