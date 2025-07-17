import React, {useState} from "react";
import ElevationChart from "./ElevationChart";
import CorrosionRate from "./CR";
import WallLoss from "./WallLoss";

const ChartSelector_ICE = () => {
    console.log("ChartSelector_ICE rendered");
    const [selectedChart, setSelectedChart] = useState([]);

    const handleCheckboxChange = (chartId) => {
       setSelectedChart((prevSelected) => 
    prevSelected.includes(chartId) ? prevSelected.filter((id) => id !== chartId): // uncheck
       [...prevSelected, chartId]
 ); // check
    };

     return (
        <div style={{ padding: "1rem"}}>
            <h2>Select a chart for ICE</h2>

            <label>
                <input type="checkbox"
                checked={selectedChart.includes("elevation")}
                onChange={() => handleCheckboxChange("elevation")} />
                Rolled-Up
            </label>

            <br />

            <label>
                <input type="checkbox"
                checked={selectedChart.includes("corrosionRate")}
                onChange={() => handleCheckboxChange("corrosionRate")} />
                Corrosion Rate (Worst + Realistic)
            </label>

            <br />

             <label>
                <input type="checkbox"
                checked={selectedChart.includes("wallLoss")}
                onChange={() => handleCheckboxChange("wallLoss")} />
                % Wall-Loss
            </label>

           {selectedChart.includes("elevation") && <ElevationChart/>}
            {selectedChart.includes("corrosionRate") && <CorrosionRate/>}
             {selectedChart.includes("wallLoss") && <WallLoss/>}
            </div>
            )
}
export default ChartSelector_ICE
           