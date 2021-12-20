import React from 'react'
import { Box, Grid, Flex, Select, FormControl, FormLabel, Input, Button, useColorModeValue } from '@chakra-ui/react'

const Inputs = ({statSetter, setStartLevel, setEndLevel, submitHandler}) => {
    const bg = useColorModeValue('gray.200', 'gray.700')

    const eventHandler = e => {
        const maxLength = 3
        if (e.target.value.length > maxLength) {
             e.target.value = e.target.value.slice(0, maxLength)
        }
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
        statSetter(e)
    }

    return (
        <>
            <Grid templateColumns={{base: "repeat(3, 0.05fr)", sm: 'repeat(6, 64px)'}} gap={{base: '2', sm: '4'}} mt={6}>
                <FormControl w="16">
                    <Box>
                        <FormLabel>Str</FormLabel>
                        <Input bg={bg} variant='filled' w="16" type="number" id="str" onChange={eventHandler}></Input>
                    </Box>
                </FormControl>
                <FormControl w="16">
                    <Box>
                        <FormLabel>Dex</FormLabel>
                        <Input bg={bg} variant='filled' w="16" type="number" id="dex" onChange={eventHandler}></Input>
                    </Box>
                </FormControl>
                <FormControl w="16">
                    <Box>
                        <FormLabel>Int</FormLabel>
                        <Input bg={bg} variant='filled' w="16" type="number" id="int" onChange={eventHandler}></Input>
                    </Box>
                </FormControl>
                <FormControl w="16">
                    <Box>
                        <FormLabel>Luk</FormLabel>
                        <Input bg={bg} variant='filled' w="16" type="number" id="luk" onChange={eventHandler}></Input>
                    </Box>
                </FormControl>
                <FormControl w="16">
                    <Box>
                        <FormLabel>Wa</FormLabel>
                        <Input bg={bg} variant='filled' w="16" type="number" id="wa" onChange={eventHandler}></Input>
                    </Box>
                </FormControl>
                <FormControl w="16">
                    <Box>
                        <FormLabel>Ma</FormLabel>
                        <Input bg={bg} variant='filled' w="16" type="number" id="ma" onChange={eventHandler}></Input>
                    </Box>
                </FormControl>
            </Grid>
                <Grid my={4} gap={4} rowGap={6} templateColumns={{base: "repeat(2, 0.05fr)", sm: 'repeat(3, 96px)'}}>
                    <Box w="24">
                        <FormLabel>Start Level</FormLabel>
                        <Select bg={bg} variant='filled' name="startLevel" id="startLevel" onChange={e => setStartLevel(+e.target.value)}>
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
                        </Select>
                    </Box>
                    <Box w="24">
                        <FormLabel>End Level</FormLabel>
                        <Select bg={bg} w="24" variant='filled' name="endLevel" id="endLevel" onChange={e => setEndLevel(+e.target.value)}></Select>
                    </Box>
                        <Flex alignContent="flex-end"><Button bg={bg} alignSelf="flex-end" onClick={submitHandler}>Submit</Button></Flex>
                </Grid>
                </>
    )
}

export default Inputs
