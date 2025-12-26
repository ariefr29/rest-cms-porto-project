import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderKanban, Globe, PenTool, ArrowRight } from 'lucide-react'

interface DashboardPageProps {
    stats: {
        projectsCount: number
        sitesCount: number
    }
    onNavigate: (page: string) => void
}

export function DashboardPage({ stats, onNavigate }: DashboardPageProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome back to your CMS. Here's an overview of your portfolio.</p>
                </div>
                <Button onClick={() => onNavigate('projects')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20">
                    Manage Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.projectsCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active project folders</p>
                    </CardContent>
                </Card>

                <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Sites</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{stats.sitesCount}</div>
                        <p className="text-xs text-muted-foreground mt-1"> deployed endpoints</p>
                    </CardContent>
                </Card>
            </div>

            {/* Guide / Tutorial Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-blue-600" />
                    Quick Start Guide
                </h2>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Step 1 */}
                    <Card className="bg-card border-border relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
                                Create Project
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Start by creating a <strong>Project</strong> folder. This groups your different websites or applications together.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Step 2 */}
                    <Card className="bg-card border-border relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
                                Add Site & Schema
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Create a <strong>Site</strong> within a project. Then use the Field Builder to define your data structure (schema) for that site.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Step 3 */}
                    <Card className="bg-card border-border relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
                                Manage Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Once your schema is ready, add content entries. You can then access this data via the generated <strong>API Endpoints</strong>.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
