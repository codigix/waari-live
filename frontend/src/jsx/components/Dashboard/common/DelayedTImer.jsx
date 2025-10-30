import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DelayTimer = ({ followUpDate, followUpTime }) => {
  const [timeDifference, setTimeDifference] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const interval = setInterval(() => {
      // Parse the date and time with the custom format
      const followUp = dayjs(`${followUpDate} ${followUpTime}`, "DD-MM-YYYY HH:mm");
      const now = dayjs();

      if (!followUp.isValid()) {
        setTimeDifference("Invalid Date");
        setIsLoading(false);
        return;
      }

      const diffInMilliseconds = now.diff(followUp);
      const isDelayed = diffInMilliseconds > 0;

      // Calculate days, hours, and minutes
      const totalMinutes = Math.abs(Math.floor(diffInMilliseconds / (1000 * 60)));
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      let formattedTime = "";
      if (days > 0) {
        formattedTime += `${days}d `;
      }
      formattedTime += `${hours.toString().padStart(2, "0")}h `;
      formattedTime += `${minutes.toString().padStart(2, "0")}m`;

      setTimeDifference(isDelayed ? formattedTime : `In: ${formattedTime}`);
      setIsLoading(false); // Mark as loaded once calculation is done
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [followUpDate, followUpTime]);

  // Determine if delayed
  const isDelayed = dayjs(`${followUpDate} ${followUpTime}`, "DD-MM-YYYY HH:mm").isBefore(dayjs());

  return (
    <span style={{ color: isDelayed ? "red" : "black" }}>
      {isLoading ? "Loading..." : timeDifference}
    </span>
  );
};

export default DelayTimer;
