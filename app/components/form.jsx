import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Signup from "./signupform"
import Login from "./loginform"

export default function Form() {
  return (
    <Tabs defaultValue="Login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Signup">Signup</TabsTrigger>
        <TabsTrigger value="Login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="Signup">
        <Signup />
      </TabsContent>
      <TabsContent value="Login">
        <Login />
      </TabsContent>
    </Tabs>
  )
}
