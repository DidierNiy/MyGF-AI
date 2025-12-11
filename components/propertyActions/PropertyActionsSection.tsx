import React from 'react';
import { ActionCard } from './ActionCard';
import { Listing } from '../../types';

interface PropertyActionsSectionProps {
    property: Listing;
    onOpenMortgage: () => void;
    onOpenValuation: () => void;
    onOpenVerification: () => void;
    onOpenLandSearch: () => void;
    onScheduleViewing: () => void;
}

export const PropertyActionsSection: React.FC<PropertyActionsSectionProps> = ({
    property,
    onOpenMortgage,
    onOpenValuation,
    onOpenVerification,
    onOpenLandSearch,
    onScheduleViewing
}) => {
    return (
        <div className="mt-8 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    🎯 What would you like to do?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Explore financing, valuation, and verification options for this property
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ActionCard
                    icon="💰"
                    title="Calculate Mortgage"
                    description="See monthly payments and compare bank offers"
                    onClick={onOpenMortgage}
                    color="green"
                    badge="Popular"
                />

                <ActionCard
                    icon="📊"
                    title="Get Valuation"
                    description="AI estimate or professional valuation report"
                    onClick={onOpenValuation}
                    color="blue"
                />

                <ActionCard
                    icon="✅"
                    title="Request Verification"
                    description="Verify documents and ownership"
                    onClick={onOpenVerification}
                    color="purple"
                />

                <ActionCard
                    icon="🗺️"
                    title="Find Similar Land"
                    description="Search nearby land parcels"
                    onClick={onOpenLandSearch}
                    color="orange"
                />

                <ActionCard
                    icon="📞"
                    title="Schedule Viewing"
                    description="Book a surveyor site visit"
                    onClick={onScheduleViewing}
                    color="indigo"
                    badge="New"
                />

                <ActionCard
                    icon="💬"
                    title="Chat with AI"
                    description="Ask questions about this property"
                    onClick={() => {/* Will integrate with chat */ }}
                    color="indigo"
                />
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Need help deciding?
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Our AI assistant can guide you through the process and answer any questions about financing, verification, or this property.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
