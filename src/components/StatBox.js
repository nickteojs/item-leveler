import React from 'react'

const StatBox = ({ strArray, statArray, testArray }) => {
    // {statArray.map(subArray => (
    //     subArray.map((e, i, a) => (
    //         <div className="statCard">
    //             <h3>Level: {e.lvl}</h3>
    //             <p>{`${(e.stat).toUpperCase()}: ${e.normalStat}`}</p>
    //             <p>{i === 0 ? null : `Max From ${a[i-1].normalStat}: ${e.maxFromNorm} + ${e.maxFromNorm - a[i-1].normalStat}`}</p>
    //             {/* If i = 1, let max of max = max from norm */}
    //             <p>{i === 0 ? null : i === 1 ? `Max of Max: ${a[i].maxOfMax} + ${a[i].maxOfMax - a[i-1].normalStat}` 
    //             : `Max of Max: ${a[i].maxOfMax} + ${a[i].maxOfMax - a[i-1].maxOfMax}` }</p>
    //         </div>
    //     ))
    // ))}
    return (
        <>
        {/* {strArray.map((e, i, a) => (
             <div className="statCard">
                <h3>Level: {e.lvl}</h3>
                <p>STR: {i === 0 ? e.normalStat : (a[i].normalStat)}</p>
                <p>{i === 0 ? null : `Max From ${a[i-1].normalStat}: ${e.maxFromNorm} + ${e.maxFromNorm - a[i-1].normalStat}`}</p>
                <p>{i === 0 ? null : `Max of Max: ${a[i].maxOfMax}`}</p>
            </div>
        ))} */}
        
        {testArray.map((subArray, index, array) => {
            let firstLevel = array[index][0].lvl
            // Need to use some of the testArray values as arguments
            return <div className="statCard">
                <h1>Level: {firstLevel}</h1>
                {subArray.map((e, i, a) => {
                    return <div className="indivBox">
                        {/* <p>{index === 0 ? `${(e.stat).toUpperCase()}: ${e.normalStat}` : 
                            index > 0 ? `${(e.stat).toUpperCase()}: ${e.normalStat} + ${e.normalStat - array[index-1][i].normalStat}` : 
                            null}
                        </p> */}
                        {/* Normal Stat */}
                        <p>{index === 0 ? `${(e.stat).toUpperCase()}: ${e.normalStat}` : 
                            `${(e.stat).toUpperCase()}: ${e.normalStat} + ${e.normalStat - array[index-1][i].normalStat}`}
                        </p>
                        {/* Max From Normal */}
                        <p>{Boolean(index) && `Max from ${array[index-1][i].normalStat}: ${e.maxFromNorm} + ${e.maxFromNorm - array[index-1][i].normalStat}`}</p>
                        {/* Max Of Max */}
                        <p>{index === 0 ? null : 
                            index === 1 ? `Max Of Max: ${e.maxOfMax} + ${e.maxOfMax - array[index-1][i].normalStat}` : 
                            `Max Of Max: ${e.maxOfMax} + ${e.maxOfMax - array[index-1][i].maxOfMax}`}
                        </p>
                        {/* ELS Rolls */}
                        <p>{Boolean(index) && <i>ELS Roll (22%) : {e.elsRoll}</i>}</p>
                    </div>
                })}
            </div>
            })}
        </>
    )
}

export default StatBox
