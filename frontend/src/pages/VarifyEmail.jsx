import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VarifyEmail = () => {
    let [otp, setOtp] = useState('')
    let { user, varifyEmail, isLoading, error } = useAuthStore()
    const navigate = useNavigate()

    const handleOtpChange = (e) => {
        setOtp((pre) => pre = e.target.value)
        if (otp.length === 6) {
            handleSubmit(e)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(otp)
        try {
            await varifyEmail(otp)
            setOtp('')
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify Your Email</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <Input maxLength={6} value={otp} onChange={handleOtpChange} type="number" placeholder="Enter OTP" className="text-md text-center app" />
                    </div>

                    {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                    <Button type="submit" className="w-full">
                        Varify
                    </Button>
                </form>
            </div>
        </div>

    )
}

export default VarifyEmail
