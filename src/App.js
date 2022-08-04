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
  const [endLevel, setEndLevel] = useState(5)
  const [statArray, setStatArray] = useState([])
  const [baseStats, setBaseStats] = useState([])
  const [validated, setValidated] = useState(false)

  const toast = useToast()
  const {colorMode, toggleColorMode} = useColorMode()
  const bg = useColorModeValue('gray.50', 'gray.900')
  const bgInfo = useColorModeValue('gray.100', 'gray.700')
 
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
    let limit = 10
    let options = ""
    while (i < limit) {
      options += `<option value=${i+1}>${i+1}</option>`
      maxLevelSelector.innerHTML = options 
      i++
    }

    if (+startLevelSelector.value < 5) {
      let difference = 5 - +startLevelSelector.value
      maxLevelSelector.selectedIndex = difference-1
    }
    if (+startLevelSelector.value >= 5) {
      let difference = 10 - +startLevelSelector.value
      maxLevelSelector.selectedIndex = difference-1
    }
    if (+startLevelSelector.value === 9) {
      maxLevelSelector.innerHTML = `<option value=${10}>${10}</option>`
    }
    setEndLevel(+maxLevelSelector.value)
  }

  const checkMod = stat => {
    let primaryTypes = ["str", "dex", "int", "luk"]
    if (primaryTypes.includes(stat)) {
      return 8
    } if (stat === "wa") {
      return 16
    } if (stat === "ma") {
      return 4
    }
  }

  const calculateIncrease = () => {
    let levels = endLevel - startLevel
    let levelArray = []    
    let lvl2Array = []
    const endArray = [levelArray, lvl2Array]  

    const getGaussian = () => {
      let u = Math.random()*0.682;
      return ((u % 1e-8 > 5e-9 ? 1 : -1) * (Math.sqrt(-Math.log(Math.max(1e-9, u)))-0.618))*1.618 * 1;
    }

    // Calculates gains based on gaussian distributed pseudorandom number
    const gaussianLeveling = (stat, mod) => {
      let min = 1
      let max = (stat / mod) + 2
      let mean = (max + min) / 2
      let deviation = (max - mean) / 2
      let v; 
      do {
        v = getGaussian() * deviation + mean
      } while (v < min || v > max);
      return Math.round(v)
    }

    const uniformLeveling = (stat, mod) => {
      // Randomizer lower bound = 1, maximum = stat / (mod + 2), lower inclusive, upper exclusive
      let upperBound = (stat / mod) + 2
      // Trunc removes any decimal numbers, replicating int type casting in java
      let result = Math.trunc(Math.random() * (upperBound) + 1);
      return result
    }

    const getNormalRollMod = (stat, mod, level) => {
      if (startLevel >= 5) {
        return gaussianLeveling(stat, mod)
        // Starting level is less than 5, end level can be anything
      } else if (startLevel < 5) {
          // Leveling from 5 onwards
          if (level >= 6) {
            return gaussianLeveling(stat, mod)
          } else {
            return uniformLeveling(stat, mod)
          }
      } else {
          return uniformLeveling(stat, mod)
      }
    }

    const getMaxRollsMod = (stat, mod, level) => {
      let i = 0;
      let iterations;
      if (level >= 6) {
        iterations = 1000000;
      } else {
        iterations = 100000;
      }
      let highestValue = 0;
      while (i <= iterations) {
        const value = getNormalRollMod(stat, mod, level)
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
          // Initial Level
          if (i === 0) {
            levelArray.push({
              stat: statName,
              lvl: startLevel,
              normalStat: statValue
            })
          }
          // First Level
          if (i === 1) {
            let mod = checkMod(statName)
            let normalRoll = getNormalRollMod(statValue, mod, startLevel + 1)
            let normalStat = statValue + normalRoll
            let maxFromNorm = getMaxRollsMod(statValue, mod, startLevel + 1) + statValue
            let maxOfMax = maxFromNorm
            let elsRoll = Math.ceil(0.88 * getMaxRollsMod(statValue,mod, startLevel +1))
            lvl2Array.push({
              stat: statName,
              lvl: startLevel + 1,
              normalStat: normalStat,
              maxFromNorm: maxFromNorm,
              maxOfMax: maxOfMax,
              elsRoll: elsRoll
            })
          }
          // Subsequent Levels
          if (i > 1) {
            let mod = checkMod(statName)
            let prevArray = (endArray[i-1].filter(i => i.stat === statName))
            let prevLevel = prevArray[0].lvl
            let prevNorm = prevArray[0].normalStat
            let prevMom = prevArray[0].maxOfMax
            let normalStat = getNormalRollMod(prevNorm, mod, prevLevel + 1) + prevNorm
            let maxFromNorm = getMaxRollsMod(prevNorm, mod, prevLevel + 1) + prevNorm
            let maxFromMax = getMaxRollsMod(prevMom, mod, prevLevel + 1) + prevMom
            let elsRoll = Math.ceil(0.88 * getMaxRollsMod(prevMom, mod, prevLevel + 1))
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
    setValidated(false)
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
          <Box w={{base: "210px", sm: "460px", md: "550px", lg: "100%"}} bg={bgInfo} borderRadius="15" mt={10} py={6} px={{base: '10', md: '5'}}>
            <Text mb={2} textAlign={{base: 'center'}}>• <b>DO NOT</b> use Lvl 1-5 for Lvl 5-10 or vice versa, the formulae are <b>different</b>.</Text>
            <Text textAlign={{base: 'center'}}>• Enhancement Scroll (ES) roll is the recommended minimum stat (88% of max) you should take but pick any stats you want, it's just a recommendation.</Text>
          </Box>
          <Box py={10}>
            <Text textAlign={{base: 'center'}} mb={6} fontSize="sm">Created by Moweyy.</Text>
          </Box>
        </Flex>
      </Box>
  );
}

export default App;
