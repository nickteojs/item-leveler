import './App.css';
import React, {useState, useEffect} from 'react'
import StatBox from './components/StatBox';

function App() {
  const [baseStr, setBaseStr] = useState(0)
  const [baseDex, setBaseDex] = useState(0)
  const [baseInt, setBaseInt] = useState(0)
  const [baseLuk, setBaseLuk] = useState(0)
  const [baseWa, setBaseWa] = useState(0)
  const [baseMa, setBaseMa] = useState(0)
  const [level, setLevel] = useState(0)
  const [startLevel, setStartLevel] = useState(1)
  const [endLevel, setEndLevel] = useState(7)
  const [strArray, setStrArray] = useState([])
  const [statArray, setStatArray] = useState([])
  const [testArray, setTestArray] = useState([])
  const [baseStats, setBaseStats] = useState([])
 
  const statSetter = e => {
    switch(e.target.id) {
      case "str" :
        setBaseStr(+e.target.value)
        break;
      case "dex" :
        setBaseDex(+e.target.value)
        break;
      case "int" :
        setBaseInt(+e.target.value)
        break;
      case "luk" :
        setBaseLuk(+e.target.value)
        break;
      case "wa" :
        setBaseWa(+e.target.value)
        break;
      case "ma" :
        setBaseMa(+e.target.value)
        break;
      default:
        console.log("Error while setting stats!")
    }
  }

  const setLevelSelect = () => {
    let startLevelSelector = document.getElementById('startLevel')
    let maxLevelSelector = document.getElementById('endLevel')
    let i = startLevel
    let limit = 11
    let options = ""
    while (i < limit) {
      options += `<option value=${i+1}>${i+1}</option>`
      maxLevelSelector.innerHTML = options 
      i++
    }

    if (+startLevelSelector.value < 7) {
      let difference = 7 - +startLevelSelector.value
      maxLevelSelector.selectedIndex = difference-1
    }
    if (+startLevelSelector.value >= 7) {
      let difference = 10 - +startLevelSelector.value
      maxLevelSelector.selectedIndex = difference-1
    }
    if (+startLevelSelector.value === 10) {
      maxLevelSelector.innerHTML = `<option value=${11}>${11}</option>`
    }
    setEndLevel(+maxLevelSelector.value)
  }

  const checkMod = stat => {
    let primaryTypes = ["str", "dex", "int", "luk"]
    let secondaryTypes = ["wa", "ma"]
    if (primaryTypes.includes(stat)) {
      return 4
    } if (secondaryTypes.includes(stat)) {
      return 16
    }
  }

  const calculateIncrease = () => {
    // Check number of levels to go through
    let levels = endLevel - startLevel 
    setLevel(level + 1)
    const fullArray = []
    baseStats.forEach(stat => {

    const getNormalRoll = stat => {
      let indivX = 1 + Math.floor(stat/4)
      let indivY = (indivX * (indivX + 1) / 2) + indivX
      let randomZ = Math.floor((Math.random() * indivY + 1))
      if (randomZ < indivX) { 
        return 0 
      } else {
        return (1 + Math.floor((-1 + Math.sqrt((8 * (randomZ - indivX)) + 1)) / 2));          
      }
    }

    const getNormalRollMod = (stat, mod) => {
      let indivX = 1 + Math.floor(stat/mod)
      let indivY = (indivX * (indivX + 1) / 2) + indivX
      let randomZ = Math.floor((Math.random() * indivY + 1))
      if (randomZ < indivX) {
        return 0 
      } else {
        return (1 + Math.floor((-1 + Math.sqrt((8 * (randomZ - indivX)) + 1)) / 2));          
      }
    }

    const getMaxRolls = stat => {
      let i = 0;
      let iterations = 100000;
      let highestValue = 0;
      while (i <= iterations) {
        const value = getNormalRoll(stat)
        if (value > highestValue) {
          highestValue = value;
        }
        i++
      }
      return highestValue
    }

    const getMaxRollsMod = (stat, mod) => {
      let i = 0;
      let iterations = 100000;
      let highestValue = 0;
      while (i <= iterations) {
        const value = getNormalRollMod(stat, mod)
        if (value > highestValue) {
          highestValue = value;
        }
        i++
      }
      return highestValue
    }

    // For each stat, run this function that does the calculations.
    const newCalculate = stat => {
      let baseStat = Object.values(stat)[0]
      let statName = Object.keys(stat)[0]
      console.log(stat)
      const tempArray = []
      for (let i = 0; i<=levels; i++) {
        if (baseStat > 0) {
          if (i === 0) {
            tempArray.push({
              stat: statName,
              lvl: startLevel,
              normalStat: baseStat
            })
          } if (i === 1) {
            // At this point, the stat passed in is {str:15}
            // Do check here, pass in 2 arguments? 1st one is the modifier, second one is the stat as a number
            let mod = checkMod(Object.keys(stat)[0])
            let statValue = Object.values(stat)[0]
            console.log(mod, statValue)
            let normalRoll = getNormalRollMod(statValue, mod)
            let normalStat = normalRoll + baseStat
            let maxFromNorm = getMaxRollsMod(statValue, mod) + baseStat
            tempArray.push({
              stat: statName,
              lvl: startLevel + 1, 
              normalStat: normalStat, 
              maxFromNorm: maxFromNorm, 
              maxOfMax: maxFromNorm
            })
          } if (i > 1) {
            let mod = checkMod(tempArray[i-1].stat)
            let prevLevel = tempArray[i-1].lvl
            let prevStat = tempArray[i-1].normalStat
            let prevMom = tempArray[i-1].maxOfMax
            console.log(tempArray)
            let normalRoll = getNormalRollMod(prevStat, mod) + prevStat
            let maxFromNorm = getMaxRollsMod(prevStat, mod) + prevStat
            let maxOfMax = getMaxRollsMod(prevMom, mod) + prevMom
            tempArray.push({
              stat: statName,
              lvl: prevLevel + 1,
              normalStat: normalRoll,
              maxFromNorm: maxFromNorm,
              maxOfMax: maxOfMax
            })
          }
        }
      }
      fullArray.push(tempArray)
      const completeArray = fullArray.filter(i => i.length>0)
      setStatArray(completeArray)
    }
    newCalculate(stat)

    

    // Object Keys/Values
    // This takes the first value from the statArray's elements, {str, strGain: maxStr}, so in this case str.
    let statName = Object.keys(stat)[0]
    const tempArray = []
    if (statName === "str") {
      let strStat = Object.values(stat)[0]
      console.log(strStat)
      for (let i = 0; i<=levels; i++) {
        if (i === 0) {
          tempArray.push({
            lvl: startLevel,
            normalStat: strStat
          })
        } if (i === 1) {
          let normalRoll = getNormalRoll(strStat)
          let normalStat = normalRoll + strStat
          let maxFromNorm = getMaxRolls(strStat) + strStat
          tempArray.push({
            lvl: startLevel + 1, 
            normalStat: normalStat, 
            maxFromNorm: maxFromNorm, 
            maxOfMax: maxFromNorm
          })
        } if (i > 1) {
          let prevLevel = tempArray[i-1].lvl
          let prevStat = tempArray[i-1].normalStat
          let prevMom = tempArray[i-1].maxOfMax
          let normalRoll = getNormalRoll(prevStat) + prevStat
          let maxFromNorm = getMaxRolls(prevStat) + prevStat
          let maxOfMax = getMaxRolls(prevMom) + prevMom
          tempArray.push({
            lvl: prevLevel + 1,
            normalStat: normalRoll,
            maxFromNorm: maxFromNorm,
            maxOfMax: maxOfMax
          })
        }
      }
      console.log(tempArray)
      setStrArray(tempArray)
    }

      if (statName === "dex") {
        let dexStat = Object.values(stat)[0]
        console.log(dexStat)
        for (let i = 0; i<=levels; i++) {
          if (i === 0) {
            tempArray.push({
              lvl: startLevel,
              normalStat: dexStat
            })
          } if (i === 1) {
            let normalRoll = getNormalRoll(dexStat)
            let normalStat = normalRoll + dexStat
            let maxFromNorm = getMaxRolls(dexStat) + dexStat
            tempArray.push({
              lvl: startLevel + 1, 
              normalStat: normalStat, 
              maxFromNorm: maxFromNorm, 
              maxOfMax: maxFromNorm
            })
          } if (i > 1) {
            let prevLevel = tempArray[i-1].lvl
            let prevStat = tempArray[i-1].normalStat
            let prevMom = tempArray[i-1].maxOfMax
            let normalRoll = getNormalRoll(prevStat) + prevStat
            let maxFromNorm = getMaxRolls(prevStat) + prevStat
            let maxOfMax = getMaxRolls(prevMom) + prevMom
            tempArray.push({
              lvl: prevLevel + 1,
              normalStat: normalRoll,
              maxFromNorm: maxFromNorm,
              maxOfMax: maxOfMax
            })
          }
        }
      }
    })

    // BLOCK 2
    // New function to organise data by levels
  const levelOrg = () => {
    let levels = endLevel - startLevel
    let levelArray = []    
    let lvl2Array = []
    const endArray = [levelArray, lvl2Array]  

    const getNormalRollMod = (stat, mod) => {
      let indivX = 1 + Math.floor(stat/mod)
      let indivY = (indivX * (indivX + 1) / 2) + indivX
      let randomZ = Math.floor((Math.random() * indivY + 1))
      if (randomZ < indivX) {
        return 0 
      } else {
        return (1 + Math.floor((-1 + Math.sqrt((8 * (randomZ - indivX)) + 1)) / 2));          
      }
    }

    const getMaxRollsMod = (stat, mod) => {
      let i = 0;
      let iterations = 100000;
      let highestValue = 0;
      while (i <= iterations) {
        const value = getNormalRollMod(stat, mod)
        if (value > highestValue) {
          highestValue = value;
        }
        i++
      }
      return highestValue
    }

    for (let i = 0; i<=levels; i++) {
      let fillArray = []
      baseStats.forEach(stat => {
        let statValue = Object.values(stat)[0]
        let statName = Object.keys(stat)[0]
        if (statValue > 0) {
          if (i === 0) {
            levelArray.push({
              stat: statName,
              lvl: startLevel,
              normalStat: statValue
            })
          }
          if (i === 1) {
            let mod = checkMod(statName)
            let normalRoll = getNormalRollMod(statValue,mod)
            let normalStat = statValue + normalRoll
            let maxFromNorm = getMaxRollsMod(statValue, mod) + statValue
            let maxOfMax = maxFromNorm
            let elsRoll = Math.ceil(0.88 * getMaxRollsMod(statValue,mod))
            lvl2Array.push({
              stat: statName,
              lvl: startLevel + 1,
              normalStat: normalStat,
              maxFromNorm: maxFromNorm,
              maxOfMax: maxOfMax,
              elsRoll: elsRoll
            })
          }
          if (i > 1) {
            let mod = checkMod(statName)
            let prevArray = (endArray[i-1].filter(i => i.stat === statName))
            let prevLevel = prevArray[0].lvl
            let prevNorm = prevArray[0].normalStat
            let prevMaxFromNorm = prevArray[0].maxFromNorm
            let prevMom = prevArray[0].maxOfMax
            let normalStat = getNormalRollMod(prevNorm, mod) + prevNorm
            let maxFromNorm = getMaxRollsMod(prevNorm, mod) + prevNorm
            let maxFromMax = getMaxRollsMod(prevMom, mod) + prevMom
            let elsRoll = Math.ceil(0.88 * getMaxRollsMod(prevMom, mod))
            // Error because you are not pushing anything past lvl 3 / OR ur object is wrong - should be pushing to end array
            fillArray.push({
              stat: statName,
              lvl: prevLevel + 1,
              normalStat: normalStat,
              maxFromNorm: maxFromNorm,
              maxOfMax: maxFromMax,
              elsRoll: elsRoll
            })
            // Only push once the array has equal parts no. of stats to prev level's array
            if(fillArray.length === endArray[i-1].length) {
              endArray.push(fillArray)
            }
          }
        }
      })
    }
    setTestArray(endArray)
  }
  levelOrg();
  }

  

  const submitHandler = () => {
    setStrArray([])
    calculateIncrease();
  }

  // Update the statsArray values with the user's stat input & resets whenever user changes values.
  useEffect(() => {
    setBaseStats([
      {str: baseStr},
      {dex: baseDex},
      {int: baseInt},
      {luk: baseLuk},
      {wa: baseWa},
      {ma: baseMa},
    ])
  }, [baseStr, baseDex, baseInt, baseLuk, baseWa, baseMa])

  // useEffect(() => {
  //   setStrArray([])
  // }, [startLevel, endLevel, baseStr])

  useEffect(() => {
    setLevelSelect()
  }, [startLevel])
  
  return (
    <div className="container">
      <h1>Item Leveler</h1>

      <label htmlFor="str">STR</label>
      <input id="str" type="text" onChange={statSetter}/>
      <label htmlFor="dex">DEX</label>
      <input id="dex" type="text" onChange={statSetter}/>
      <label htmlFor="int">INT</label>
      <input id="int" type="text" onChange={statSetter}/>
      <label htmlFor="luk">LUK</label>
      <input id="luk" type="text" onChange={statSetter}/>
      <label htmlFor="wa">WA</label>
      <input id="wa" type="text" onChange={statSetter}/>
      <label htmlFor="ma">MA</label>
      <input id="ma" type="text" onChange={statSetter}/>
      <label htmlFor="startLevel">Start Level</label>

      <select name="startLevel" id="startLevel" onChange={e => setStartLevel(+e.target.value)}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>

      <label htmlFor="endLevel">End Level</label>
      <select name="endLevel" id="endLevel" onChange={e => setEndLevel(+e.target.value)}>
      </select>

      <button onClick={submitHandler}>Submit</button>
      {statArray.length && testArray.length ? <StatBox strArray={strArray} statArray={statArray} testArray={testArray}/> : "No stats yet"}
      {/* {strArray.map(array => {
        return array.map(item => (
          <li>{item}</li>
        ))
        }       
      )} */}
      {/* {statsArray.map(stat => {
        let baseStat = Object.keys(stat)[0]
        let baseStatValue = Object.values(stat)[0]
        let baseIncrease = Object.values(stat)[1]
        let maxFromBase = Object.values(stat)[2]
        return <>
          {baseStatValue !== 0 ? <div className="statCard">
          <h1>{baseStat}: {(baseStatValue + baseIncrease)} +<span className="statIncrease">{baseIncrease}</span></h1>
          <p>Max from {baseStatValue}: {maxFromBase}</p>
          </div> : null}
        </>
      })} */}
      {/* {strArray.map((array, index) => {
        console.log(strArray[0])
        let stats = strArray[0]
          {stats.forEach(stat => (
              <h1>{stat}</h1>
      ))}
      })} */}
      
    </div>
    
  );
}

export default App;
