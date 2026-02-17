import React from "react";

const RoomInfo = ({ room }) => {
  // Support both frontend camelCase fields and backend snake_case/standard fields
  const title = room.roomName || room.name || "Untitled Room";
  const type = room.roomType || room.type || "-";
  const price = room.pricePerNight || room.price_per_night || "N/A";
  const currency = room.currency || "";
  const maxOccupancy = room.maxOccupancy || room.max_occupancy || "-";
  const description = room.description || "";

  return (
    <div className="room-info">
      <h2>{title}</h2>
      <p>
        <strong>Type:</strong> {type}
      </p>
      <p>
        <strong>Price per Night:</strong> {currency} {price}
      </p>
      <p>
        <strong>Max Occupancy:</strong> {maxOccupancy} guests
      </p>
      <p className="description">{description}</p>
    </div>
  );
};

export default RoomInfo;