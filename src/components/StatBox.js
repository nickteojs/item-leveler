import React from 'react'
import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/layout'
import { useColorModeValue } from '@chakra-ui/react'

const StatBox = ({ statArray }) => {
    const bg = useColorModeValue('gray.100', 'gray.800')
    return (
        <Grid templateColumns={{base: 'repeat(1)', md:'repeat(2, 0.16fr)', lg: 'repeat(3, 0.16fr)', xl: 'repeat(4, 0.16fr)', '2xl': 'repeat(5, 0.16fr)'}} gap={4}>
            {statArray.map((subArray, index, array) => {
                let firstLevel = array[index][0].lvl
                return <GridItem key={`lvl${index+1}`}bg={bg} borderRadius="10" p={6} mt={5} w={[210, 270]} boxShadow='md'>
                    <Heading size="md" mb={4}>Level: {firstLevel}</Heading>
                    {subArray.map((e, i) => {
                        // Renaming Variables
                        let statName = (e.stat).toUpperCase()
                        let normalStat = e.normalStat
                        let maxFromNorm = e.maxFromNorm
                        let maxOfMax = e.maxOfMax
                        return <Box key={`lvl${index+1}-${statName}`}_notLast={{borderBottom: '2px', textAlign: 'start'}}>
                            {/* Normal Stat */}
                            <Box my={3}>
                                {index === 0
                                ? <Flex justifyContent="space-between">{statName}: <Text fontWeight="500">{normalStat}</Text></Flex>
                                : <Flex justifyContent="space-between" >{statName}: <Text fontWeight="500">{normalStat} <span className='endWord'>+{normalStat - array[index-1][i].normalStat}</span></Text></Flex>}
                            </Box>
                            {/* Max From Normal */}
                            <Box my={3}>
                                {Boolean(index) && 
                                    <Flex justifyContent="space-between">
                                        Max from {array[index-1][i].normalStat}: <Text fontWeight="500">{maxFromNorm} <span className='endWord'>+{maxFromNorm - array[index-1][i].normalStat}</span></Text>
                                    </Flex>}
                            </Box>
                            {/* Max Of Max */}
                            <Box>
                                {index === 0
                                ? null
                                : index === 1 ? <Flex my={1} justifyContent="space-between">Max Of Max:<Text fontWeight="500">{maxOfMax} <span className="endWord">+{maxOfMax - array[index-1][i].normalStat}</span></Text></Flex>
                                : <Flex mb={3} justifyContent="space-between">Max Of Max:<Text fontWeight="500">{maxOfMax} <span className="endWord">+{maxOfMax - array[index-1][i].maxOfMax}</span></Text></Flex>}
                            </Box>
                            {/* ELS Rolls */}
                            <Box>
                                {(e.stat !== "ma" && e.stat !== "wa") && Boolean(index)
                                ? <Flex my={3} justifyContent="space-between">ELS Roll (88%) : <span className="endWord">+{e.elsRoll}</span></Flex>
                                : null}
                            </Box>
                        </Box>
                    })}
                </GridItem>
                })}
        </Grid>
    )
}

export default StatBox
