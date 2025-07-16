import React from "react";
import { Line } from "@ant-design/charts";

const UserLineChart = () => {
  const data = [
    { year: "1991", users: 3 },
    { year: "1992", users: 4 },
    { year: "1993", users: 3.5 },
    { year: "1994", users: 5 },
    { year: "1995", users: 4.9 },
    { year: "1996", users: 6 },
    { year: "1997", users: 7 },
    { year: "1998", users: 9 },
  ];

  const config = {
    data,
    title: {
      visible: true,
      text: "User Of System Analysis",
    },
    xField: "year",
    yField: "users",
    point: {
      visible: true,
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#2593fc",
        lineWidth: 2,
      },
    },
  };
  return (
    <div
      style={{
        border: "2px solid #2593fc",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <Line {...config} />
    </div>
  );
};
export default UserLineChart;
