'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, FileText, Zap, Check, ChevronRight } from "lucide-react"
import { FaDiscord } from 'react-icons/fa';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <GraduationCap className="h-6 w-6 mr-2" />
          <span className="font-bold">AI Study Buddy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#discord">
            Discord
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-500 to-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col-reverse md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-start space-y-4 text-white">
                <motion.h1 
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Study Smarter with AI and Friends
                </motion.h1>
                <motion.p 
                  className="max-w-[700px] text-gray-200 md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Collaborate on documents, chat with AI, and ace your exams together. Join the future of studying.
                </motion.p>
                <motion.div 
                  className="space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button variant="secondary">Get Started</Button>
                  <Button variant="outline">Learn More</Button>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1532102522784-9e4d4d9a533c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="AI Study Buddy"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader>
                    <Zap className="w-8 h-8 mb-2 text-purple-500" />
                    <CardTitle>AI-Powered Assistance</CardTitle>
                  </CardHeader>
                  <CardContent>Get instant answers and explanations from our advanced AI.</CardContent>
                </Card>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader>
                    <Users className="w-8 h-8 mb-2 text-blue-500" />
                    <CardTitle>Collaborative Study</CardTitle>
                  </CardHeader>
                  <CardContent>Work on documents together in real-time with your study group.</CardContent>
                </Card>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card>
                  <CardHeader>
                    <FileText className="w-8 h-8 mb-2 text-green-500" />
                    <CardTitle>Smart Summaries</CardTitle>
                  </CardHeader>
                  <CardContent>AI-generated summaries of your study materials for quick review.</CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Basic", "Pro", "Enterprise"].map((plan, index) => (
                <motion.div key={plan} whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{plan}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold mb-4">
                        {index === 0 ? "$9.99/mo" : index === 1 ? "$19.99/mo" : "Custom"}
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-green-500" /> AI chat assistance</li>
                        <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-green-500" /> Document collaboration</li>
                        {index > 0 && <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-green-500" /> Advanced AI tools</li>}
                        {index > 1 && <li className="flex items-center"><Check className="w-5 h-5 mr-2 text-green-500" /> Custom integrations</li>}
                      </ul>
                      <Button className="mt-4 w-full">
                        {index === 2 ? "Contact Sales" : "Choose Plan"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section id="discord" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Community</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Connect with fellow students, share study tips, and get support in our Discord server.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button size="lg" className="mt-4">
                <FaDiscord className='mr-2 text-purple-600 dark:text-purple-400' />
                  Join our Discord
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 AI Study Buddy. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}