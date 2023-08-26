import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../context/UserContext'
import { ChangeContext } from '../../../../context/ChangeContext'
//exported functions
import { addLocation } from '../../../../setup/API/location_api'
import { Decrypt } from '../../../../setup/Crypto/Cryption'
//css
import './styles/LocationAdd.css'
//components
import Alert from '../../../../components/Shared/Alert'

type propsType = {
    trigger: boolean,
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

const LocationAdd = (props: propsType) => {
    //Context
    const { locationToggle, setLocationToggle } = useContext(ChangeContext)
    const { currentUserID } = useContext(UserContext)
    const _currentUserID = Decrypt(currentUserID)

    //Add Location States
    const [formData, setFormData] = useState({
        title: "",
        province: "",
        district: "",
        neighbourhood: "",
        street: "",
        buildingNo: "",
        buildingAddition: "",
        apartmentNo: "",
        note: ""
    })
    const [errors, setErrors] = useState<any>({})

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData({
            ...formData, [name]: value
        })
    }

    const handleAdd = async () => {
        if (Validation()) {
            try {
                await addLocation(_currentUserID, formData.title, formData.province, formData.district, formData.neighbourhood,
                    formData.street, formData.buildingNo, formData.buildingAddition, formData.apartmentNo, formData.note)
                popAlert("green", "Addrees successfuly added")
                setLocationToggle(!locationToggle)
                resetInputs()
                setTimeout(() => {
                    props.setTrigger(false)
                }, 2000)
            } catch (error) {
                popAlert("red", "Address could not be added")
            }
        }
    }

    //Support functions
    const Validation = () => {
        let isValid = true
        const validationErrors: any = {}

        //title
        if (!formData.title.trim()) {
            validationErrors.title = "*Required"
        }
        else if (formData.title.length > 25) {
            validationErrors.title = "Title can contain up to 25 characters"
        }

        //province
        if (!formData.province.trim()) {
            validationErrors.province = "*Required"
        }
        else if (formData.province.length > 25) {
            validationErrors.province = "Province can contain up to 25 characters"
        }

        //district
        if (!formData.district.trim()) {
            validationErrors.district = "*Required"
        }
        else if (formData.district.length > 25) {
            validationErrors.district = "District can contain up to 25 characters"
        }

        //neighbourhood
        if (!formData.neighbourhood.trim()) {
            validationErrors.neighbourhood = "*Required"
        }
        else if (formData.neighbourhood.length > 35) {
            validationErrors.neighbourhood = "Neighbourhood can contain up to 35 characters"
        }

        //street
        if (formData.street.length > 25) {
            validationErrors.street = "*Street can contain up to 25 characters"
        }

        //building no
        if (formData.buildingNo.length > 10) {
            validationErrors.buildingNo = "*Building number can contain up to 10 characters"
        }

        //building addition
        if (formData.buildingAddition.length > 10) {
            validationErrors.buildingAddition = "*Building addition can contain up to 10 characters"
        }

        //apartment no
        if (formData.apartmentNo.length > 10) {
            validationErrors.apartmentNo = "*Apartment number can contain up to 10 characters"
        }

        //note
        if (formData.note.length > 50) {
            validationErrors.note = "*Note can contain up to 50 characters"
        }

        if (Object.keys(validationErrors).length != 0) {
            isValid = false
            setErrors(validationErrors)
        }

        return isValid
    }

    const resetInputs = () => {
        setErrors({})
        setFormData({
            title: "",
            province: "",
            district: "",
            neighbourhood: "",
            street: "",
            buildingNo: "",
            buildingAddition: "",
            apartmentNo: "",
            note: ""
        })
    }

    //Alert States
    const [color, setColor] = useState<string>("");
    const [msg, setMsg] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const popAlert = (color: string, msg: string) => {
        setIsOpen(true)
        setColor(color)
        setMsg(msg)

        setTimeout(() => {
            setIsOpen(false)
        }, 3000)
    }

    return props.trigger ? (
        <div className='add-address-background'>
            <div className='add-address-wrapper'>

                <div className="close-add-address">
                    <i className="fa-solid fa-x" onClick={() => {
                        resetInputs();
                        props.setTrigger(false);
                    }}></i>
                </div>

                <p>Add Address</p>

                <div className='input-group'>
                    <p>Title</p>
                    <input name="title" type="text" onChange={handleChange} />
                    <div>
                        {errors.title && <span>{errors.title}</span>}
                    </div>
                </div>
                <div className='input-group'>
                    <p>Province</p>
                    <input name="province" type="text" onChange={handleChange} />
                    <div>
                        {errors.province && <span>{errors.province}</span>}
                    </div>
                </div>
                <div className="input-group">
                    <p>District</p>
                    <input name="district" type="text" onChange={handleChange} />
                    <div>
                        {errors.district && <span>{errors.district}</span>}
                    </div>
                </div>
                <div className='input-group'>
                    <p>Neighbourhood</p>
                    <input name="neighbourhood" type="text" onChange={handleChange} />
                    <div>
                        {errors.neighbourhood && <span>{errors.neighbourhood}</span>}
                    </div>
                </div>
                <div className='input-group'>
                    <p>Street</p>
                    <input name="street" type="text" onChange={handleChange} />
                    <div>
                        {errors.street && <span>{errors.street}</span>}
                    </div>
                </div>

                <div className="row">
                    <div className='building-info'>
                        <div className='input-group'>
                            <p>Building Number</p>
                            <input name="buildingNo" type="text" onChange={handleChange} />
                            <div>
                                {errors.buildingNo && <span>{errors.buildingNo}</span>}
                            </div>
                        </div>
                        <div className='input-group'>
                            <p>Building Addition</p>
                            <input name="buildingAddition" type="text" onChange={handleChange} />
                            <div>
                                {errors.buildingAddition && <span>{errors.buildingAddition}</span>}
                            </div>
                        </div>
                    </div>

                    <div className='input-group'>
                        <p>Apartment Number</p>
                        <input name="apartmentNo" type="text" onChange={handleChange} />
                        <div>
                            {errors.apartmentNo && <span>{errors.apartmentNo}</span>}
                        </div>
                    </div>
                </div>
                <div className="input-group">
                    <p>Note</p>
                    <textarea name="note" rows={3} onChange={handleChange} />
                    <div>
                        {errors.note && <span>{errors.note}</span>}
                    </div>
                </div>

                <button className='address-add' onClick={handleAdd}>Add</button>
            </div >

            <Alert isOpen={isOpen} color={color} msg={msg} />
        </div>
    ) : null
}

export default LocationAdd