import React, { useEffect, useState } from "react";
import Scaffold, { TypeLoading } from "../../shared/components/Scaffold/Scaffold.tsx";
import usePageState from "../../hooks/usePageState.ts";
import Header from "./components/Header.tsx";
import { ChartData, ChartOptions } from "chart.js";
import { Chart } from "primereact/chart";
import AppColors from "../../shared/styles/AppColors.ts";
const HomePage: React.FC = () => {
  const { isLoading, setLoading } = usePageState();

  const data: ChartData = {
    labels: ['January', 'February'],
    datasets: [
      {
        type: 'bar',
        label: 'Dataset 1',
        backgroundColor: 'var(--blue-500)',
        data: [50]
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: 'red',
        data: [21, 84]
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: 'var(--blue-500)',
        data: [41, 52]
      }
    ]
  };

  const options: ChartOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: AppColors.colorPrimary,
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: AppColors.colorPrimary
        },
        grid: {
          color: AppColors.colorPrimary
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: AppColors.colorPrimary
        },
        grid: {
          color: AppColors.colorPrimary
        }
      }
    }
  };

  return (
    <>
      <Scaffold
        isLoading={isLoading}
        typeLoading={TypeLoading.OVERLAY}>
        <Header/>

        <PieChartDemo/>

        <Chart
          type={"bar"}
          data={data}
          options={options}
        />

      </Scaffold>
    </>
  );
};

export default HomePage;

function PieChartDemo() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400')
          ]
        }
      ]
    }
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card flex justify-content-center">
      <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
    </div>
  )
}
