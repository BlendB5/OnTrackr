'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Calendar, BarChart3, ArrowRight, Play, Star, Shield, Zap, Mail, Phone, MapPin, CheckCircle, Target, TrendingUp, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-24 h-24 bg-purple-200/25 rounded-full blur-xl"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-primary rounded-full blur-lg opacity-30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Clock className="h-8 w-8 text-primary relative z-10" />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">OnTrackr</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Compact theme button in header */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link href="#about">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-primary">
                About
              </Button>
            </Link>
            <Link href="#contact">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-primary">
                Contact
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-primary">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              Stay On Time.{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Stay OnTrackr.
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            OnTrackr is a comprehensive workforce management platform that revolutionizes how businesses 
            track time, manage schedules, and optimize productivity. Built for modern teams who value 
            efficiency, transparency, and data-driven insights.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              "Real-time Time Tracking",
              "Smart Scheduling",
              "Advanced Analytics",
              "Team Management",
              "Mobile App",
              "API Integration"
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link href="/signup">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-2 border-slate-300 dark:border-slate-600 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {[
              { icon: Star, text: "14-day free trial" },
              { icon: Shield, text: "No credit card required" },
              { icon: Zap, text: "Setup in under 5 minutes" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3D Dashboard Preview */}
          <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="relative bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-border card-darkify"
            whileHover={{ 
              scale: 1.02, 
              rotateY: 2,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white dark:from-primary dark:to-primary/70 glow-accent">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
                  <p className="text-blue-100">9:24 AM • Monday, January 15, 2025</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-8 w-8 text-blue-200" />
                </motion.div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 bg-white dark:bg-card">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-900/40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Present</p>
                      <p className="text-2xl font-bold text-green-700">24</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-900/40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                    <p className="text-sm text-primary font-medium">Hours</p>
                    <p className="text-2xl font-bold text-primary">7.5</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <motion.div 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-300">Clock In</span>
                    <span className="text-sm text-slate-500 ml-auto">9:00 AM</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-slate-600 dark:text-slate-300">Break Start</span>
                    <span className="text-sm text-slate-500 ml-auto">12:00 PM</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            {
              icon: Clock,
              title: "Clock In/Out",
              description: "Simple one-click time tracking with GPS location verification and automatic break detection for accurate attendance records.",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Users,
              title: "Team Management",
              description: "Monitor team attendance, manage schedules, and get real-time insights into productivity patterns across your organization.",
              color: "from-indigo-500 to-indigo-600"
            },
            {
              icon: BarChart3,
              title: "Analytics & Reports",
              description: "Generate detailed reports, export timesheet data, and gain valuable insights to optimize your workforce management.",
              color: "from-purple-500 to-purple-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-card/90 backdrop-blur-sm card-darkify">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color.replace('from-blue-500 to-blue-600','from-primary to-primary/70')} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* About Us Section */}
        <motion.section 
          id="about"
          className="mt-32 py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">About OnTrackr</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We're on a mission to transform how businesses manage their most valuable asset - time. 
              Founded in 2024, OnTrackr combines cutting-edge technology with intuitive design to 
              create workforce management solutions that actually work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Our Mission",
                description: "To empower businesses with intelligent time tracking and workforce management tools that drive productivity and growth."
              },
              {
                icon: TrendingUp,
                title: "Our Vision",
                description: "A world where every business has the insights and tools they need to optimize their workforce and achieve their goals."
              },
              {
                icon: Award,
                title: "Our Values",
                description: "Innovation, transparency, and user-centric design guide everything we do. We believe in making complex problems simple."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-card/90 backdrop-blur-sm card-darkify">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose OnTrackr Section */}
        <motion.section 
          className="py-20 bg-white/50 dark:bg-card/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">Why Choose OnTrackr?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Join thousands of businesses that trust OnTrackr to streamline their operations and boost productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "500+", label: "Companies" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-border shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Us Section */}
        <motion.section 
          id="contact"
          className="py-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">Get in Touch</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Ready to transform your workforce management? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Contact Information</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    content: "hello@ontrackr.com",
                    description: "Send us an email anytime"
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    content: "+1 (555) 123-4567",
                    description: "Mon-Fri 9am-6pm EST"
                  },
                  {
                    icon: MapPin,
                    title: "Office",
                    content: "123 Business Ave, Suite 100",
                    description: "San Francisco, CA 94105"
                  },
                  {
                    icon: Globe,
                    title: "Website",
                    content: "www.ontrackr.com",
                    description: "Visit our main website"
                  }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <contact.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{contact.title}</h4>
                      <p className="text-primary font-medium">{contact.content}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{contact.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your needs..."
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 mt-20 border-t border-slate-200 dark:border-slate-700">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">OnTrackr</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              The modern workforce management platform that helps businesses track time, 
              manage schedules, and optimize productivity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8 text-center text-slate-500 dark:text-slate-400">
          <p>&copy; 2024 OnTrackr. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  );
}