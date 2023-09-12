import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../context/UserContext'
//CSS
import './styles/ChangePass.css'
//exported functions
import { Decrypt, Encrypt } from '../../../../setup/Crypto/Cryption'
import { changePass, verifyPass } from '../../../../setup/API/user_api'
//Component
import Alert from '../../../../components/Shared/Alert'
import { usePopAlert } from '../../../../hooks/usePopAlert'


const passwordPattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(\S).{8,20}$/)


type propsType = {
  trigger: boolean,
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>

}


const ChangePass = (props: propsType) => {
  //Local Storage
  const { currentUserID } = useContext(UserContext)
  const _currentUserID = Decrypt(currentUserID)

  //Input States
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<any>({})
  const {alertStates, popAlert} = usePopAlert()


  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData, [name]: value
    })
  }
  
  const handleSave = async () => {
    if (await Validation()) {
      if (await changePass(_currentUserID, Encrypt(formData.newPassword))) {
        popAlert("green", "Password successfuly changed")
        resetInputs()
        setTimeout(() => {
          props.setTrigger(false)
        }, 2000)
      } else {
        popAlert("red", "Password could not changed")
      }
    }
  }
  
  const Validation = async () => {
    let isValid = true
    const validationErrors: any = {}

    //password
    if(!formData.password.trim()) {
      validationErrors.password = "*Cannot be left blank"
    }
    else if(!await verifyPass(_currentUserID, formData.password)) {
      validationErrors.password = "*Password is wrong"
    }

    //newPassword
    if(!formData.newPassword.trim()) {
      validationErrors.newPassword = "*Cannot be left blank"
    }
    else if (!passwordPattern.test(formData.newPassword)) {
      validationErrors.newPassword = "*Password must contain at least 8 characters, 1 capital letter and 1 number"
    }

    //confirmPassword
    if(!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "*Cannot be left blank"
    }
    else if (formData.newPassword.trim() !== formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "*Does not match with new password"
    }

    if(Object.keys(validationErrors).length != 0) {
      isValid = false
      setErrors(validationErrors)
    }

    return isValid
  }
  
  const resetInputs = () => {
    setErrors({})
    setFormData({
      password: "",
      newPassword: "",
      confirmPassword: ""
    })
  }



  return props.trigger ? (
    <div className='change-pass-background'>

      <div className='change-pass-wrapper'>

        <div className="close-change-pass">
          <i className="fa-solid fa-x" onClick={() => {
            resetInputs();
            props.setTrigger(false);
          }}></i>
        </div>

        <p>Password</p>

        <div className='input-group'>
          <p>Current Password</p>
          <input name="password" type="password" onChange={handleChange} autoComplete="off"/>
          <div>
            {errors.password && <span>{errors.password}</span>}
          </div>
        </div>

        <div className="input-group">
          <p>New Password</p>
          <input name="newPassword" type="password" onChange={handleChange} autoComplete="off"/>
          <div>
            {errors.newPassword && <span>{errors.newPassword}</span>}
          </div>
        </div>

        <div className="input-group">
          <p>Confirm New Password</p>
          <input name="confirmPassword" type="password" onChange={handleChange} autoComplete="off"/>
          <div>
            {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
          </div>
        </div>

        <button className='change-pass-save' onClick={handleSave}>Save</button>
      </div>

      <Alert isOpen={alertStates.isOpen} color={alertStates.color} msg={alertStates.msg} />
    </div>
  ) : null
}

export default ChangePass