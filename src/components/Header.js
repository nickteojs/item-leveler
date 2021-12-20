import React from 'react'
import {IconButton, Flex, Text, Heading} from '@chakra-ui/react'
import {SunIcon, MoonIcon} from '@chakra-ui/icons'

const Header = ({ colorMode, toggleColorMode }) => {
    return (
        <Flex w={{base: "210px", sm: "470px", md: "550px", lg: "100%"}} justifyContent="space-between">
            <Heading alignSelf="center" fontSize={{base: 'lg', sm: '2xl'}} fontWeight="bold">Item Leveler</Heading>
            <IconButton
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
            />
        </Flex>
    )
}

export default Header
