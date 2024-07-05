import React, { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { useAccount as useEthereumAccount } from "wagmi"
import { Stack, Text, Button, useToast } from "@chakra-ui/react"
import { signWithKeplr } from '../../utlis/keplr';
import { useChain } from '@cosmos-kit/react';
import { InputEthereumAddress } from './InputEthereumAddress';
import { InputSommelierAddress } from './InputSommelierAddress';
interface SnapshotFormProps {
    wrongNetwork: boolean
}

export interface SnapshotFormValues {
    eth_address: string
    somm_address: string
}

const SnapshotForm: React.FC<SnapshotFormProps> = ({
                                                       wrongNetwork,
                                                   }) => {
    const methods = useForm<SnapshotFormValues>()
    const { isConnected: isEthereumConnected } = useEthereumAccount()
    const ethAddress = methods.watch("eth_address")
    const sommAddress = methods.watch("somm_address")
    const isFormFilled = ethAddress && sommAddress
    const toast = useToast()


    const [registrationMessage, setRegistrationMessage] = useState("")

    const { getOfflineSignerDirect, connect, isWalletConnected } = useChain("stargaze");

    useEffect(() => {
        const checkRegistration = async () => {
            if (!isEthereumConnected || wrongNetwork) return

            try {
                const checkResponse = await fetch("/api/checkRegistration", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ethAddress: ethAddress,
                        sommAddress: sommAddress,
                    }),
                })

                const checkData = await checkResponse.json()

                if (checkResponse.status === 409) {
                    setRegistrationMessage(checkData.message)
                } else if (!checkResponse.ok) {
                    throw new Error(
                        checkData.message || "Failed to check registration"
                    )
                }
            } catch (error) {
                console.error("Error checking registration: ", error)
            }
        }

        checkRegistration()
    }, [isEthereumConnected, wrongNetwork, ethAddress, sommAddress])

    const onSubmit = async (data: SnapshotFormValues) => {
        if (!isEthereumConnected || wrongNetwork) {
            toast({
                title: "Submission Error",
                status: "error",
                description: (
                        "Please check your wallet connection and network."
                ),
                isClosable: true,
                duration: null,
            })
            return
        }

        try {
            const checkResponse = await fetch("/api/checkRegistration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ethAddress: data.eth_address,
                    sommAddress: data.somm_address,
                }),
            })
            
            const checkData = await checkResponse.json()
            
            if (checkResponse.status === 409) {
                toast({
                    title: "Already Registered",
                    status: "warning",
                    description: (
                        `${checkData.message}. You can still proceed to sign and
                                update your registration.`
                    ),
                    isClosable: true,
                    duration: null,
                })
            } else if (!checkResponse.ok) {
                throw new Error(
                    checkData.message || "Failed to check registration"
                )
            }

            if (!isWalletConnected) {
                connect();
                return <></>;
            }

            const signer = getOfflineSignerDirect();


            const {
                signature,
                pubKey,
                data: encodedData,
            } = await signWithKeplr(
                signer,
                data.somm_address,
                data.eth_address,
                data.somm_address
            )

            const response = await fetch("/api/saveSignedMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sommAddress: data.somm_address,
                    ethAddress: data.eth_address,
                    signature,
                    pubKey,
                    data: encodedData,
                }),
            })

            if (!response.ok) {
                const text = await response.text()
                throw new Error(
                    `HTTP error! status: ${response.status}. Body: ${text}`
                )
            }

            const responseData = await response.json()
            console.log("Response from server:", responseData)
            toast({
                title: "Success",
                status: "success",
                description: "Your addresses have been successfully signed.",
                isClosable: true,
                duration: null,
            })
        } catch (error) {
            console.error("Error in form submission: ", error)
            toast({
                title: "Submission Error",
                status: "error",

                description: "There was an error during the submission process. Please try again.",
                isClosable: true,
                duration: null,
            })
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <Text color="white">{registrationMessage ?? ""}</Text>
    
                    <InputEthereumAddress />
                    <InputSommelierAddress />
                    <Button
                        height="69px"
                        fontSize="21px"
                        type="submit"
                        colorScheme="purple"
                        color="white" // Explicitly setting the text color to white
                        _hover={{ bg: 'purple.600' }} // Adjust hover background as necessary
                        isDisabled={
                            !isEthereumConnected || wrongNetwork || !isFormFilled || !isWalletConnected
                        }
                    >
                        Sign
                    </Button>
                    <Text color="white">
                        Re-link to update with a new wallet at any time.
                    </Text>
                </Stack>
            </form>
        </FormProvider>
    )
    
}

export default SnapshotForm
