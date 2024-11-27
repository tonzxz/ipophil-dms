'use client';

import { useSession } from 'next-auth/react';
import { DashboardHeader } from '@/components/custom/dashboard/header';
import { AddDocumentButton } from '@/components/custom/common/add-document/add-document-button';
import { Card } from '@/components/ui/card';

export default function Page() {
    const { data: session } = useSession();

    return (
        <>
            {/* Header Section */}
            <DashboardHeader userName={session?.user?.first_name} />

            {/* Unified Top Banner Section */}
            <div className="p-8 rounded-lg flex flex-col md:flex-row justify-between items-center text-center md:text-left mt-8">
                <div className="flex flex-col items-center md:items-start md:mr-8">
                    <h1 className="text-7xl font-bold text-orange-400">IPOPHIL</h1>
                    <p className="text-lg font-bold mt-2">DOCUMENT MANAGEMENT SYSTEM</p>
                    <p className="mt-4">Add your documents now!</p>
                    <div className="mt-6 flex justify-center md:justify-start space-x-4">
                        <AddDocumentButton title="Receive a Document" actionType="Receive" variant="destructive" />
                        <AddDocumentButton title="Transmit a Document" actionType="Release" variant="destructive" />
                        <AddDocumentButton title="Enroll a Document" actionType="Create" variant="default" />
                    </div>
                </div>
                <div className="mt-8 md:mt-0 flex justify-center">
                    <img
                        src="/images/homepage1.png"
                        alt="Transfer, License, and Sell"
                        className="w-full max-w-lg"
                    />
                </div>
            </div>

            {/* Bottom 2x2 Grid Layout */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Bottom Left: Director Section */}
                <Card className="p-8 rounded-lg flex flex-col items-center text-center">
                    <img
                        src="/images/r.barba.png"
                        alt="The Director General"
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    <h2 className="text-2xl font-bold text-orange-600">The Director General</h2>
                    <p className="text-lg font-medium mt-1">Rowel S. Barba</p>
                    <p className="mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                    </p>
                </Card>

                {/* Bottom Right: Infomercial Video Section */}
                <Card className="p-8 rounded-lg flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Infomercial Video</h2>
                    <video
                        className="rounded-lg shadow-lg"
                        controls
                        src="/videos/infomercial.mp4"
                        width="600"
                    >
                        Your browser does not support the video tag.
                    </video>
                </Card>
            </div>
        </>
    );
}
