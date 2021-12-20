import './App.css';
import React, {useState, useEffect} from 'react'
import StatBox from './components/StatBox';
import Header from './components/Header';
import Inputs from './components/Inputs';
import { useToast, Flex, Box, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'

function App() {
  const [baseStr, setBaseStr] = useState(0)
  const [baseDex, setBaseDex] = useState(0)
  const [baseInt, setBaseInt] = useState(0)
  const [baseLuk, setBaseLuk] = useState(0)
  const [baseWa, setBaseWa] = useState(0)
  const [baseMa, setBaseMa] = useState(0)
  const [startLevel, setStartLevel] = useState(1)
  const [endLevel, setEndLevel] = useState(7)
  const [statArray, setStatArray] = useState([])
  const [baseStats, setBaseStats] = useState([])
  const [validated, setValidated] = useState(false)

  const toast = useToast()
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue('gray.50', 'gray.900')
 
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
            let prevMom = prevArray[0].maxOfMax
            let normalStat = getNormalRollMod(prevNorm, mod) + prevNorm
            let maxFromNorm = getMaxRollsMod(prevNorm, mod) + prevNorm
            let maxFromMax = getMaxRollsMod(prevMom, mod) + prevMom
            let elsRoll = Math.ceil(0.88 * getMaxRollsMod(prevMom, mod))
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
    setStatArray(endArray)
  }

  const inputValidation = () => {
    let stats = [baseStr, baseDex, baseInt, baseLuk, baseWa, baseMa]
    let filled = false
    // 1. Check if at least 1 input is filled
    if (stats.some(s => s !== 0)) {
      filled = true
    }

    // 2. IF at least 1 input is filled, check inputs and see if any are negative
    if (filled) {
      if (stats.some(s => s<0)) {
        setValidated(false)
        return (toast({
          title: 'Please use positive values!',
          status: 'warning',
          duration: 1500,
          isClosable: true,
        }))
      } else {
        setValidated(true)
      }
    }
  }

  const submitHandler = () => {
    if (validated) {
      calculateIncrease();
    } else {
        return (toast({
          title: 'Please insert stats!',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        }))
    }
  }

  function checkLocalStorage () {
    const item = JSON.parse(localStorage.getItem('stats'))
    if (item) {
      setStatArray(item)
    } else {
      console.log("No items")
    }
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

  useEffect(() => {
    setLevelSelect()
  }, [startLevel])

  useEffect(() => {
    checkLocalStorage()
  }, [])

  useEffect(() => {
    inputValidation()
  }, [baseStats])

  // Check on page load if statArray exists, if it does then save it to localStorage
  useEffect(() => {
    if (statArray.length > 0) {
      localStorage.setItem('stats', JSON.stringify(statArray))
    } else { 
      return 
    }
  }, [statArray])
  
  return (
      <Box>
        <Flex minH="100vh" bg={bg} flexDirection="column" px={{base: '6', md: '24'}} pt={12} alignItems={{base: 'center', lg: 'flex-start'}}>
          <Header colorMode={colorMode} toggleColorMode={toggleColorMode}/>
          <Inputs statSetter={statSetter} setStartLevel={setStartLevel} setEndLevel={setEndLevel} submitHandler={submitHandler}/>
          {statArray.length ? <Box fontSize={{base: "sm", sm: "md"}}>
            <StatBox statArray={statArray}/>
          </Box> : null}
          <Box py={10}>
            <Text mt={6} fontSize="sm">Created by Moweyy.</Text>
          </Box>
        </Flex>
      </Box>
  );
}

export default App;
