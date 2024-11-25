import Image from "next/image";
import Link from "next/link";

import logo from "../../../public/images/logo.svg";

const Logo = () => (
    <Link href="/">
        <Image src={logo} alt="Webtrack logo" width={180} height={40} />
    </Link>
);

export default Logo;
