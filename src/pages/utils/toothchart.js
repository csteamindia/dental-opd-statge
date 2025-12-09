import React, { useState } from "react";
import { upperRight, upperLeft, lowerLeft, lowerRight } from '../../constants/Constrant_dropdowns';
import toothImages from '../../assets/tooth-image';

const renderTeethRow = (handleToothClick, selectedTeeth, selectedTrat, teeth, isUpper) => (
    <table className="w-100">
        <tbody>
            <tr>
                {teeth.map((tooth) => (
                    <td key={tooth} className="text-center">
                        <strong>{tooth}</strong>
                        <div>
                            {
                                isUpper ? <>
                                    <img 
                                        onClick={() => handleToothClick(tooth)} 
                                        src={selectedTeeth[tooth] ? toothImages[`${selectedTrat}${tooth}_tooth_upper`] : toothImages[`${tooth}_tooth_upper`]} 
                                        alt={`Tooth ${tooth}`} 
                                        className="img-fluid" 
                                        style={{ width: '26px' }} 
                                    />
                                    <br />
                                    <img 
                                        onClick={() => handleToothClick(tooth)} 
                                        src={selectedTeeth[tooth] ? toothImages[`${selectedTrat}${tooth}_tooth_front`] : toothImages[`${tooth}_tooth_front`]} 
                                        alt={`Tooth ${tooth}`} 
                                        className="img-fluid" 
                                        style={{ width: '26px' }} 
                                    />
                                </> : <>
                                    <img 
                                        onClick={() => handleToothClick(tooth)} 
                                        src={selectedTeeth[tooth] ? toothImages[`${selectedTrat}${tooth}_lower_front`] : toothImages[`${tooth}_lower_front`]} 
                                        alt={`Tooth ${tooth}`} 
                                        className="img-fluid" 
                                        style={{ width: '26px' }} 
                                    />
                                    <br />
                                    <img 
                                        onClick={() => handleToothClick(tooth)} 
                                        src={selectedTeeth[tooth] ? toothImages[`${selectedTrat}${tooth}_lower_tooth`] : toothImages[`${tooth}_lower_tooth`]} 
                                        alt={`Tooth ${tooth}`} 
                                        className="img-fluid" 
                                        style={{ width: '26px' }} 
                                    />
                                </>
                            }
                        </div>
                    </td>
                ))}
            </tr>
        </tbody>
    </table>
);

export const Toothchart = ({ callback, selectedTeeth, selectedTrat  }) => {
    return <table className="table table-border w-100 text-center">
        <tbody>
            <tr>
                <td>{renderTeethRow(callback, selectedTeeth, selectedTrat, upperRight, true)}</td>
                <td>{renderTeethRow(callback, selectedTeeth, selectedTrat, upperLeft, true)}</td>
            </tr>
            <tr>
                <td>{renderTeethRow(callback, selectedTeeth, selectedTrat, lowerLeft, false)}</td>
                <td>{renderTeethRow(callback, selectedTeeth, selectedTrat, lowerRight, false)}</td>
            </tr>
        </tbody>
    </table>
}
