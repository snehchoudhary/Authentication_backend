import React, {useState} from "react";
import Home from "./CP_CPIPS";
import ACVG from "./ACVG";
 import DCVG from "./DCVG";
import ACPSP from "./ACPSP";
import DOC from "./DOC";
import Attenuation from "./Attenuation";
// import DCVG_Bar from "./DCVG_Bar";
import ACVG_mv from "./ACVG_mv";

const ChartSelector = () => {
    const [selectedChart, setSelectedChart] = useState([]);

    const handleCheckboxChange = (chartId) => {
       setSelectedChart((prevSelected) => 
    prevSelected.includes(chartId) ? prevSelected.filter((id) => id !== chartId): // uncheck
       [...prevSelected, chartId]
 ); // check
    };

    return (
        <div style={{ padding: "1rem", fontSize: '20px'}}>
            <h2>Select a chart for EC:</h2>

            <label style = {{cursor: 'pointer'}}>
                <input type="checkbox"
                checked={selectedChart.includes("acvg")}
                onChange={() => handleCheckboxChange("acvg")} />
                ACVG_VSS_DB
            </label>

        <br />

        <label style = {{cursor: 'pointer'}}>
            <input type="checkbox"
            checked={selectedChart.includes("dcvg")}
            onChange={() => handleCheckboxChange("dcvg")} />
            DCVGPercentIR
        </label>
        <br />

        <label style={{cursor: 'pointer'}}>
            <input type="checkbox"
            checked={selectedChart.includes("acpsp")}
            onChange={() => handleCheckboxChange("acpsp")} />
            ACPSP_OnPotential
        </label>

        <br />

          <label style = {{cursor: 'pointer'}}>
            <input type="checkbox"
            checked={selectedChart.includes("doc")}
            onChange={() => handleCheckboxChange("doc")} />
            DepthOfCover (DOC)
        </label>
        <br />

        <label style = {{cursor: 'pointer'}}>
            <input type="checkbox"
            checked={selectedChart.includes("cpcips")}
            onChange={() => handleCheckboxChange("cpcips")} />
            CPCIPS (On + Instant Off)
        </label>

        <br />

        <label style = {{cursor: 'pointer'}}>
            <input type="checkbox"
            checked={selectedChart.includes("attenuation")}
            onChange={() => handleCheckboxChange("attenuation")} />
            Attenuation
        </label>

       <br />


         <label style = {{cursor: 'pointer'}}>
            <input type="checkbox"
            checked={selectedChart.includes("acvg_mv")}
            onChange={() => handleCheckboxChange("acvg_mv")} />
            ACVG (mV)
        </label>

       
        {selectedChart.includes("acvg") && <ACVG/>}
        {selectedChart.includes("dcvg") && <DCVG/>}
        {selectedChart.includes("acpsp") && <ACPSP/>}
        {selectedChart.includes("doc") && <DOC/>}
        {selectedChart.includes("cpcips") && <Home/>}
        {selectedChart.includes("attenuation") && <Attenuation/>}
         {/* {selectedChart.includes("dcvg_bar") && <DCVG_Bar/>} */}
        {selectedChart.includes("acvg_mv") && <ACVG_mv/>}
        </div>
        
    );
};

export default ChartSelector;