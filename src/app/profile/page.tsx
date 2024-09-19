// src/app/@me/page.tsx and src/app/profile/page.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MapPin, Mail, Phone, Globe, Briefcase, GraduationCap, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState({
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://janedoe.com',
    bio: 'Product designer and developer. Passionate about creating intuitive and beautiful user experiences.',
    birthday: new Date('1990-01-15'),
    occupation: 'Senior UX Designer',
    company: 'TechCorp Inc.',
    education: 'Master of Design, University of Creative Arts',
    skills: ['UI/UX Design', 'Prototyping', 'User Research', 'HTML/CSS', 'JavaScript'],
    interests: ['Photography', 'Hiking', 'Cooking', 'Travel'],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser(prevUser => ({ ...prevUser, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // In a real application, you would save the user data to a backend here
    console.log('Saving user data:', user)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Edit2 className="mr-2 h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={user.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={user.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={user.website}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-24"
                  />
                </div>
                <div>
                  <Label>Birthday</Label>
                  <Calendar
                    mode="single"
                    selected={user.birthday}
                    onSelect={(date) => setUser(prevUser => ({ ...prevUser, birthday: date }))}
                    disabled={!isEditing}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="professional">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={user.occupation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={user.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    name="education"
                    value={user.education}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="interests">
              <div className="space-y-4">
                <div>
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests.map((interest, index) => (
                      <Badge key={index} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {isEditing && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {user.website}
              </a>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>{user.occupation} at {user.company}</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>{user.education}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Birthday: {format(user.birthday, 'MMMM do, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}