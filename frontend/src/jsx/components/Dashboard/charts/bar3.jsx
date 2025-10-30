import React from "react";
import ReactApexChart from "react-apexcharts";

function Bar3({ totalEnqData, confirmEnqData, lostEnqData }) {

  const series = [
    {
      name: "Total Enquiries",
      data: totalEnqData,
    },
    {
      name: "Confirmed Enquiries",
      data: confirmEnqData,
    },
    {
      name: "Lost Enquiries",
      data: lostEnqData,
    },
  ]

  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: true,
      fontSize: "12px",
      fontWeight: 300,

      labels: {
        colors: "black",
      },
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 19,
        height: 19,
        strokeWidth: 0,
        radius: 19,
        strokeColor: "#fff",
        fillColors: ["#076fb0", "#00c2cb", "#ffd856"],
        offsetX: 0,
        offsetY: 0,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#3e4954",
          fontSize: "14px",
          fontFamily: "Calibri",
          fontWeight: 100,
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    },
    fill: {
      colors: ["#076fb0", "#00c2cb", "#ffd856", "#709fba"],
      opacity: 1,
    },
    tooltip: {
      y: {
        // formatter: function (val) {
        //   return "$ " + val + " thousands";
        // },
        formatter: function (val) {
          return val
        },
      },
    },
  }

  return (
    <div id="chart" className="line-chart-style bar-chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default Bar3;
