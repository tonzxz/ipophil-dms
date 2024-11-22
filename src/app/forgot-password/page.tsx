// src/app/forgot-password/page.tsx
'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface FormElements extends HTMLFormElement {
    email: HTMLInputElement
}

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const form = e.currentTarget as FormElements
            const email = form.email.value.trim()

            if (!email) {
                toast.error('Please enter your email address')
                return
            }

            // Simulate sending reset email
            setTimeout(() => {
                setEmailSent(true)
                toast.success('Reset link sent to your email')
            }, 1500)
        } catch (error) {
            toast.error('An error occurred while sending the reset link')
            console.error('Forgot password error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50/50 via-background to-orange-50/30 dark:from-background dark:via-card dark:to-background flex items-center justify-center p-4 transition-colors duration-500'
        >
            <div className='relative w-full max-w-md'>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className='backdrop-blur-xl bg-card/60 dark:bg-card/60 rounded-3xl shadow-2xl overflow-hidden border border-border/50 dark:border-border/50 p-8'
                >
                    <div className='space-y-8'>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className='flex items-center gap-4'
                        >
                            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Forgot Password
                            </h1>
                        </motion.div>

                        <AnimatePresence mode='wait'>
                            {!emailSent ? (
                                <motion.div
                                    key='form'
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <form onSubmit={handleSubmit} className='space-y-6'>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                            className='group space-y-2'
                                        >
                                            <Label
                                                htmlFor='email'
                                                className='text-sm font-medium text-neutral-700 dark:text-neutral-300'
                                            >
                                                Email address
                                            </Label>
                                            <div className='relative'>
                                                <Input
                                                    id='email'
                                                    name='email'
                                                    placeholder='name@example.com'
                                                    type='email'
                                                    disabled={isLoading}
                                                    className='h-11 bg-white/50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 focus:border-primary/50 dark:focus:border-primary/50 transition-all duration-200 backdrop-blur-sm'
                                                    required
                                                />
                                                <div className='absolute inset-0 border border-primary/50 rounded-md opacity-0 scale-105 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-200 pointer-events-none' />
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.7 }}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <Button
                                                    className='w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:to-primary text-white transition-all duration-300'
                                                    type='submit'
                                                    disabled={isLoading}
                                                >
                                                    <AnimatePresence mode='wait' initial={false}>
                                                        {isLoading ? (
                                                            <motion.div
                                                                key='loading'
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                className='flex items-center gap-2'
                                                            >
                                                                <Loader2 className='h-4 w-4 animate-spin' />
                                                                Sending...
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key='send'
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                className='flex items-center gap-2 relative'
                                                            >
                                                                Send Reset Link
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key='success'
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className='text-center space-y-4'
                                >
                                    <p className='text-gray-600 dark:text-gray-300'>
                                        We&apos;ve sent a password reset link to your email. Please check your inbox.
                                    </p>
                                    <Button
                                        className='w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:to-primary text-white transition-all duration-300'
                                        onClick={() => router.push('/')}
                                    >
                                        Back to Sign In
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}