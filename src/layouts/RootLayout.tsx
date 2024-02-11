import { FC, PropsWithChildren } from "react"

const RootLayout: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="px-8 h-screen flex flex-col">{children}</div>
  )
}

export default RootLayout