import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
//helpers
import { getIDByUserName, login } from '../../../setup/API/user_api'
import { Encrypt } from '../../../setup/Cryption'
import { UserContext } from '../../../context/UserContext'
import { usePopAlert } from '../../../hooks/usePopAlert'
//components
import IForgotMyPassword from './IForgotMyPassword'
import Alert from '../../../components/Shared/Alert'
//css
import "../styles/Login.css"


const Login = () => {
    const navigate = useNavigate()
    const { setIsLogin, setCurrentUserID } = useContext(UserContext)

    //LOGIN INPUTS
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    })
    const [errors, setErrors] = useState<any>({})
    const { alertStates, popAlert } = usePopAlert()

    //IFORGOTMYPASSWORD 
    const [iForgotMyPass, setIForgotMyPass] = useState<boolean>(false);


    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData({ ...formData, [name]: value })
    }

    const handleLogin = async () => {
        if (await Validation()) {
            //set user that logged in as current user 
            const data = await getIDByUserName(formData.userName)
            const userID = data[0].userID.toString()
            const _currentUserID = Encrypt(userID)
            setCurrentUserID(_currentUserID)
            setIsLogin("true")

            //redirect to home page
            popAlert("green", "Login successful!")
            resetInputs()
            navigate("/home")
            return;
        }
    }


    //Support functions
    const Validation = async () => {
        let isValid = true
        const validationErrors: any = {}

        //username
        if (!formData.userName.trim()) {
            validationErrors.userName = "*Required"
        }

        //password
        if (!formData.password.trim()) {
            validationErrors.password = "*Required"
        }


        if (Object.keys(validationErrors).length != 0) {
            isValid = false
            setErrors(validationErrors)
        }
        else {
            const encryptedPass = Encrypt(formData.password);
            if (await login(formData.userName, encryptedPass) == false) {
                validationErrors.password = "*User name or password is wrong"
                isValid = false
                setErrors(validationErrors)
            }
        }

        return isValid
    }

    const resetInputs = () => {
        setErrors({})
        setFormData({
            userName: "",
            password: ""
        })
    }


    return (
        <>
            <Alert isOpen={alertStates.isOpen} color={alertStates.color} msg={alertStates.msg} />

            <div id='login-wrapper'>
                <div id='login-title'>
                    <p>Login</p>
                    <hr id="login-hr-line" />
                </div>

                <div id='login-inputs-wrapper'>
                    <div className="input-template">
                        <p className="input-label">Username</p>
                        <input className='input-text' name="userName" type="text" onChange={handleChange} />
                        <div>
                            {errors.userName && <span>{errors.userName}</span>}
                        </div>
                    </div>

                    <div className="input-template">
                        <p className="input-label">Password</p>
                        <input className='input-text' name="password" type="password" onChange={handleChange} />
                        <div>
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                    </div>
                </div>

                <div id='login-buttons-wrapper'>
                    <input className='input-button' id='login' type="button"
                        value="Login" onClick={handleLogin} />

                    <input className='input-button' id='register' type="button"
                        value="Register" onClick={() => navigate("/registration")} />
                        
                    <input className='input-button' id='forgotpassword' type="button"
                        value="I forgot my password" onClick={() => setIForgotMyPass(true)} />
                </div>
            </div>

            <IForgotMyPassword trigger={iForgotMyPass} setTrigger={setIForgotMyPass} />
        </>

    )
}

export default Login