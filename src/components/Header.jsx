import { NavLink } from "react-router-dom";



export default function Header({ nameApp }) {


    const headerLinks = [

        { title: "Home", path: "/" },
        { title: "Our products", path: "/products" },

    ];


    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">FuelUp</div>
                <div>
                    <ul className="nav-item">
                        {headerLinks.map((link, index) => (
                            <li  key={index}>
                                <NavLink
                                    className="nav-link"
                                    aria-current="page"
                                    to={link.path}
                                >
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </header>
    );
}