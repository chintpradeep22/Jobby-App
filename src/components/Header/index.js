import Cookies from 'js-cookie'
import { withRouter, Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import { BsBriefcaseFill } from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import './index.css'

const Header = props => {
    const onClickLogout = () => {
        const { history } = props
        Cookies.remove('jwt_token')
        history.replace('/login')
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <Link to="/" className="link-item">
                    <img
                        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                        alt="website logo"
                        className="website-logo"
                    />
                </Link>
            </div>

            {/* Desktop view */}
            <ul className="header-list-items desktop-view">
                <Link to="/" className="link-item">
                    <li className="nav-text">Home</li>
                </Link>
                <Link to="/jobs" className="link-item">
                    <li className="nav-text">Jobs</li>
                </Link>
                <li>
                    <button
                        type="button"
                        className="logout-button"
                        onClick={onClickLogout}
                    >
                        Logout
                    </button>
                </li>
            </ul>

            {/* Mobile view */}
            <ul className="header-icons mobile-view">
                <li>
                    <Link to="/" className="icon-link">
                        <AiFillHome className="icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/jobs" className="icon-link">
                        <BsBriefcaseFill className="icon" />
                    </Link>
                </li>
                <li>
                    <button type="button" onClick={onClickLogout} className="icon-button">
                        <FiLogOut className="icon" />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default withRouter(Header)
