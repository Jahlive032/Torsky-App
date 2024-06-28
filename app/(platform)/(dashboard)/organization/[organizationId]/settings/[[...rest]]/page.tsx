import { OrganizationProfile } from "@clerk/nextjs";

const SettingsLayout = () =>{
    return (
        <div className="w-full">
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width: "100%",
                            
                        },
                        card: {
                            border: "1px solid #e4e5e5",
                            boxShadow: "none",
                            width: "100%",
                        }
                    }
                }}
            />
        </div>
    )
}

export default SettingsLayout;