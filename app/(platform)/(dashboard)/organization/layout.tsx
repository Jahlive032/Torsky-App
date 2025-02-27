import { Sidebar } from "../_components/Sidebar";

const OrganizationLayout = ({children} : {children: React.ReactNode}) =>{

    return(
        <main className="pt-20 md:pt-24 px-2 max-w-6xl xl:max-w-screen-2xl mx-auto">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block left-0">
                    <Sidebar/>
                </div>
                {children}
            </div>  
        </main>
    )
}

export default OrganizationLayout;