
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, ArrowLeft, User, Building, Phone, BookOpen, Briefcase, Hash, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Registration = () => {
    const [role, setRole] = useState<'student' | 'staff'>('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        phone: '',
        // Student specific
        rollNumber: '',
        year: '',
        // Staff specific
        staffId: '',
        designation: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure your passwords match.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = role === 'student'
                ? 'http://localhost:2110/auth/student'
                : 'http://localhost:2110/auth/staff';

            const payload: any = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                department: formData.department,
                phone: formData.phone,
            };

            if (role === 'student') {
                payload.rollNumber = formData.rollNumber;
                payload.year = Number(formData.year);
            } else {
                payload.staffId = formData.staffId;
                payload.designation = formData.designation;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                // If response is not JSON, read as text but don't crash
                const text = await response.text();
                data = { message: text };
            }

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            toast({
                title: 'Registration Successful',
                description: `Account created for ${formData.name}. Please login.`,
            });

            navigate('/login');
        } catch (error: any) {
            console.error('Registration Error:', error);
            toast({
                title: 'Registration Failed',
                description: error.message || "An error occurred during registration.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="container mx-auto px-4 py-4">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                                <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Create an Account</CardTitle>
                        <CardDescription>
                            Join the project repository platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Role Selection */}
                            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                <Label className="text-base font-medium">I am a</Label>
                                <RadioGroup
                                    value={role}
                                    onValueChange={(value) => setRole(value as 'student' | 'staff')}
                                    className="flex gap-8"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="student" id="student" />
                                        <Label htmlFor="student" className="cursor-pointer font-normal">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="staff" id="staff" />
                                        <Label htmlFor="staff" className="cursor-pointer font-normal">Staff Member</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Common Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@university.edu"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="department"
                                            placeholder="Computer Science"
                                            className="pl-10"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 9876543210"
                                            className="pl-10"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Student Specific Fields */}
                            {role === 'student' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="rollNumber">Roll Number</Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="rollNumber"
                                                placeholder="20XXCSXX"
                                                className="pl-10"
                                                value={formData.rollNumber}
                                                onChange={handleInputChange}
                                                required={role === 'student'}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year of Study</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="year"
                                                placeholder="3rd Year"
                                                className="pl-10"
                                                value={formData.year}
                                                onChange={handleInputChange}
                                                required={role === 'student'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Staff Specific Fields */}
                            {role === 'staff' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="staffId">Staff ID</Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="staffId"
                                                placeholder="STAFF123"
                                                className="pl-10"
                                                value={formData.staffId}
                                                onChange={handleInputChange}
                                                required={role === 'staff'}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="designation">Designation</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="designation"
                                                placeholder="Assistant Professor"
                                                className="pl-10"
                                                value={formData.designation}
                                                onChange={handleInputChange}
                                                required={role === 'staff'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Login here
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Registration;
