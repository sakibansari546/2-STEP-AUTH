import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import AnimationWrapper from '@/common/AnimationWrapper'
import { useAuthStore } from '@/store/authStore'

export default function AuthForm({ type }) {
    const navigate = useNavigate()

    let [formvalue, setFromValue] = useState({})

    let { user, signup, isLoading, error } = useAuthStore()

    const handleChange = (e) => {
        setFromValue({
            ...formvalue,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formvalue)
        try {
            await signup(formvalue, type)
            navigate('/varify-email')
        } catch (err) {
            console.log(err);

        }
    }

    useEffect(() => {
        if (type === 'signup') {
            setFromValue({
                username: '',
                email: '',
                password: ''
            })
        } else {
            setFromValue({
                email: '',
                password: ''
            })
        }
    }, [type])

    return (
        <AnimationWrapper keyValue={type} initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <div className='h-screen flex items-center justify-center'>
                <Card className="sm:w-[60vw] w-[100vw] max-w-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">{type == 'signup' ? "Rigester" : "Login"}</CardTitle>
                        <CardDescription>{type == 'signup' ? "Create your account to login" : "Enter your email and password to login to your account"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {
                                type === 'signup' &&
                                <div className="space-y-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input value={formvalue.username} name='username' label="Username" id="username" type="text" placeholder="username" handleChange={handleChange} />
                                </div>
                            }
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input value={formvalue.email} label="Email" name='email' id="email" type="email" placeholder="m@example.com" handleChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Password</Label>
                                <Input value={formvalue.password} label="Password" name='password' id="password" type="password" handleChange={handleChange} />
                            </div>

                            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                            <Button onClick={handleSubmit} type="submit" className="w-full">
                                {
                                    isLoading ? "Loading..." : type == 'signup' ? "Rigester" : "Login"
                                }

                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            {type == 'signup' ? "Already have an account?" : "Don't have an account?"}
                            <Link to={type == 'signup' ? "/signin" : "/signup"} className="underline">
                                {type == 'signup' ? "Login" : "Rigester"}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AnimationWrapper>
    )

}