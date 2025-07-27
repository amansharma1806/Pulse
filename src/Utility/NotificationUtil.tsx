import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"
import { title } from "process"

const successNotication=(message:string)=>{
    notifications.show({
        title:"Success",
        message:message,
        color:'teal',
        icon:<IconCheck/>,
        withCloseButton:true,
        withBorder:true,
        className:"!border-green-500"
    })
}
const errorNotication=(message:string)=>{
    notifications.show({
        title:"failure",
        message:message,
        color:'red',
        icon:<IconX/>,
        withCloseButton:true,
        withBorder:true,
        className:"!border-red-500"
    })
}
export {successNotication,errorNotication}