
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Users, FileText, LayoutGrid, ListFilter, List } from "lucide-react";
import { ColorPalettePicker } from "@/components/widget-builder/ColorPalettePicker";
import { PREDEFINED_COLORS } from "@/types/widget-types";

const AdminDashboard = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [themeColor, setThemeColor] = useState<string>("#6E59A5");
  
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your application and user access</p>
      </header>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active accounts on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">1,234</div>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="gap-1">
                  <Check size={14} /> 24 new today
                </Badge>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Published Widgets</CardTitle>
                <CardDescription>Widgets available to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">56</div>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="gap-1">
                  <Check size={14} /> 3 published this week
                </Badge>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Widgets awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">12</div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">View All</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="widgets">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Widget Management</h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="search" className="sr-only">Search</Label>
                  <Input id="search" placeholder="Search widgets..." className="w-[250px]" />
                </div>
                
                <ToggleGroup 
                  type="single" 
                  value={viewMode} 
                  onValueChange={(value) => value && setViewMode(value as 'list' | 'grid')}
                >
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the widget appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ColorPalettePicker
                    label="Primary Color"
                    value={themeColor}
                    onChange={setThemeColor}
                    colors={PREDEFINED_COLORS}
                  />
                  
                  <div>
                    <Label htmlFor="widget-scale">Widget Scale</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input id="widget-scale" type="range" min="50" max="150" defaultValue="100" />
                      <span className="text-sm font-medium">100%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Widget listing would go here - simplified for clarity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Widgets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Widget listing would display here in {viewMode} view</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage access and permissions</CardDescription>
              </div>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface would display here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Configure dashboard preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-theme">Dashboard Theme</Label>
                  <ColorPalettePicker
                    label="Theme Color"
                    value={themeColor} 
                    onChange={setThemeColor}
                    colors={PREDEFINED_COLORS}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input id="notification-email" placeholder="admin@example.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
