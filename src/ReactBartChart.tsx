import * as React from "react";
import "./style.css";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export interface State {
  color: string;
  startRange: number;
  endRange: number;
  filteredData: any[];
}

export const initialState: State = {
  color: "#ffffff",
  startRange: 50,
  endRange: 100,
  filteredData: [],
};

export class BarChartVisual extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  public static update(newState: State) {
    if (typeof BarChartVisual.updateCallback === "function") {
      BarChartVisual.updateCallback(newState);
    }
  }

  render() {
    const { filteredData } = this.state;

    const data = {
      labels: filteredData.map(entry => entry.name), // Use original order
      datasets: [
        {
          label: "Quantity",
          data: filteredData.map(entry => entry.quantity), // Use original order
          backgroundColor: filteredData.map(entry => entry.fill || this.state.color),
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      indexAxis: 'y', // Horizontal bar chart
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          type: 'category',
          labels: filteredData.map(entry => entry.name), // Keep labels in original order
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    return (
      <div className="flex flex-col items-center w-full container">
        <h1 className="text-center font-bold text-3xl md:text-4xl mb-4">
          Sales Data for Electronic Products by Month
        </h1>

        <div style={{ width: "100%", height: "400px", overflowY: "hidden" }}>
          <div className="scrollable-chart-container" style={{ width: "100%", height: "100%", overflowX: "auto", overflowY: "hidden" }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    );
  }

  private static updateCallback: (data: object) => void = null;

  public componentWillMount() {
    BarChartVisual.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    BarChartVisual.updateCallback = null;
  }
}

export default BarChartVisual;
