import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Mochiy_Pop_One, Poppins } from "next/font/google";


const headFont = Mochiy_Pop_One({
    subsets: ["latin"],
    weight: ["400"]
})

const textFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

const HomePage = () =>{
    return(
        <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center flex-col">
                <div className={cn("mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase", headFont.className)}>
                    <Medal className="w-6 h-6 mr-2"/>
                    N°1 des gestionnaires de tâches
                </div>
                <h1 className={cn("text-3xl md:text-5xl text-center text-neutral-800 mb-6", headFont.className)}>Tâches organisées, succès garanti.</h1>
                <div className={cn("text-2xl md:text-4xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-4 p-2 rounded-md pb-4 w-fit text-white", headFont.className)}>
                    Soyez synchrône
                </div>
            </div>
            <div className={cn("text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto", textFont.className)}>
                Collaborez, gérez des projets et atteignez de nouveaux sommets de productivité.
                Des gratte-ciel au bureau à domicile, la façon dont votre équipe travaille est
                unique, accomplissez tout cela avec Torsky.
            </div>
            <Button className={cn("mt-6", headFont.className)} size="lg" asChild>
                <Link href="/sign-up">
                    Commencez gratuitement
                </Link>
            </Button>
        </div>
    )
}

export default HomePage;