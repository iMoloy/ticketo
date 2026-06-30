"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, Form, Input, Button, TextArea, Spinner } from "@heroui/react";
import { toast } from "react-toastify";

const OrganizationForm = () => {
    const [orgName, setOrgName] = useState("");
    const [logo, setLogo] = useState("");
    const [website, setWebsite] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch("/api/organizations");
                if (res.status === 200) {
                    const data = await res.json();
                    if (data) {
                        setOrgName(data.organizationName || "");
                        setLogo(data.logo || "");
                        setWebsite(data.website || "");
                        setDescription(data.description || "");
                    }
                }
            } catch (err) {
                console.error("Failed to load organization profile:", err);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/organizations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationName: orgName,
                    logo,
                    website,
                    description,
                }),
            });

            const data = await res.json();
            if (res.status === 200 && data.success) {
                toast.success("Organization profile saved successfully!");
                setSuccess("Organization profile saved successfully!");
            } else {
                toast.error(data.error || "Failed to save profile.");
                setError(data.error || "Failed to save profile.");
            }
        } catch (err) {
            console.error("Submit organization error:", err);
            toast.error("Network error occurred saving profile.");
            setError("Network error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }


    return (
        <div className="mt-6 space-y-6 max-w-3xl">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-2xl" radius="lg">
                <CardHeader className="flex flex-col gap-1 pb-4 border-b border-white/5 p-6">
                    <h3 className="text-xl font-bold text-white">Organization Details</h3>
                    <p className="text-slate-400 text-xs">Review and edit your organization credentials.</p>
                </CardHeader>
                <div className="p-6">
                    <Form onSubmit={handleSubmit} className="space-y-4 w-full">
                        {error && (
                            <div className="w-full p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="w-full p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-semibold">
                                {success}
                            </div>
                        )}

                        <Input 
                            id="organizationName" 
                            label="Organization Name" 
                            labelPlacement="outside" 
                            placeholder="TechEvents Corp" 
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            required 
                            className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                        />

                        <Input 
                            id="organizationLogo" 
                            label="Organization Logo URL" 
                            labelPlacement="outside" 
                            placeholder="https://images.unsplash.com/photo-1549880181-56a44cf8a4a1" 
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                            required 
                            className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                        />

                        <Input 
                            id="organizationWebsite" 
                            label="Organization Website" 
                            labelPlacement="outside" 
                            placeholder="techevents.corp" 
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            required 
                            className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                        />

                        <TextArea 
                            id="org-desc" 
                            label="Description" 
                            labelPlacement="outside" 
                            placeholder="Hosting global developer conferences and software hacking marathons." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required 
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none min-h-[100px] text-white text-sm" 
                        />

                        <div className="flex gap-4">
                            <Button type="submit" isLoading={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 shadow-lg" radius="lg">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default OrganizationForm;