import React from "react";
import { Pie } from "@ant-design/plots";

const CategoryPieChart = ({data}) => {
  // const data = [
  //   { type: "Đồ đông lạnh", value: 27 },
  //   { type: "Hoa quả", value: 25 },
  //   { type: "Thịt", value: 18 },
  //   { type: "Đồ dễ vỡ", value: 15 },
  // ];

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      text: (d) => `${d.type}\n ${d.value}`,
      position: "spider",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
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
      <Pie {...config} />
    </div>
  );
};

export default CategoryPieChart;
