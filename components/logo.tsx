import { Mochiy_Pop_One } from "next/font/google";
import Image from "next/image";
import Link from "next/link"
import { cn } from "@/lib/utils";


const headFont = Mochiy_Pop_One({
    subsets: ["latin"],
    weight: ["400"]
})

const Logo = () =>{
    return(
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image
                    src="/icons/logo.svg"
                    alt="logo"
                    width={30}
                    height={30}
                />
                <p className={cn("text-lg text-neutral-700 pb-1", headFont.className)}>Torsky</p>
            </div>
        </Link>
    )
}

export default Logo;