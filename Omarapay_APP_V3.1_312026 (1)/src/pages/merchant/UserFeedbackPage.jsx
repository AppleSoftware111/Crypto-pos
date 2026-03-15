import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const UserFeedbackPage = () => {
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "💌 Thank You!",
            description: "Your feedback has been submitted. We appreciate your input!",
        });
        e.target.reset();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Send Feedback</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Share Your Thoughts</CardTitle>
                    <CardDescription>We value your feedback. Let us know how we can improve.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="feedback">Your Message</Label>
                            <Textarea id="feedback" placeholder="Tell us what you think..." rows={6} required />
                        </div>
                        <Button type="submit">Submit Feedback</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserFeedbackPage;