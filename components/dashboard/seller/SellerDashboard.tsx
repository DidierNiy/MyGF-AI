import React, { useState } from 'react';
import { type Listing, type Message, type User, UserRole } from '../../../types';
import { OwnerListingManager } from '../owner/OwnerListingManager';
import { OwnerClientChat } from '../owner/OwnerClientChat';
import { OwnerMarketing } from '../owner/OwnerMarketing';
import { OwnerAiSettings } from '../owner/OwnerAiSettings';
import { ListingForm } from '../ListingForm';
import { Settings } from '../ProfileSettings';
import { NotificationBadge } from '../NotificationBadge';
import { NotificationPanel } from '../NotificationPanel';
import { DashboardSidebar, DashboardSection } from '../DashboardSidebar';
import { MenuIcon } from '../../icons/MenuIcon';

interface SellerDashboardProps {
    user?: User;
    listings: Listing[];
    onAddListing: (newListing: Omit<Listing, 'id' | 'agentName' | 'agentContact' | 'createdBy' | 'imageUrls'> & { images: File[] }) => void;
    onEditListing?: (propertyId: string, updatedData: Partial<Omit<Listing, 'id' | 'imageUrls'>>) => Promise<void>;
    onDeleteListing?: (propertyId: string) => Promise<void>;
    interactionChats: Record<string, Message[]>;
    humanTakeoverChats: Record<string, boolean>;
    onTakeoverChat: (propertyId: string) => void;
    onSendAgentMessage: (propertyId: string, text: string) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
    user, listings, onAddListing, onEditListing, onDeleteListing, interactionChats, humanTakeoverChats, onTakeoverChat, onSendAgentMessage
}) => {
    const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleAddListingSubmit = (newListing: Omit<Listing, 'id' | 'agentName' | 'agentContact' | 'createdBy' | 'imageUrls'> & { images: File[] }) => {
        onAddListing(newListing);
        setIsFormOpen(false);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return <OwnerListingManager listings={listings} onOpenAddListingModal={() => setIsFormOpen(true)} onEditListing={onEditListing} onDeleteListing={onDeleteListing} />;
            case 'chat':
                return (
                    <OwnerClientChat
                        interactionChats={interactionChats}
                        listings={listings}
                        humanTakeoverChats={humanTakeoverChats}
                        onTakeoverChat={onTakeoverChat}
                        onSendAgentMessage={onSendAgentMessage}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-black flex pt-16 h-full overflow-hidden">
            {/* Dashboard Sidebar */}
            <DashboardSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                role="Property Seller"
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <span className="font-semibold text-gray-900 dark:text-white">Dashboard</span>
                    <NotificationBadge onViewAll={() => setActiveSection('notifications')} />
                </div>

                {/* Desktop Header (Welcome Message) */}
                <header className="hidden md:flex items-center justify-between px-8 py-6 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Welcome back, {user?.name?.split(' ')[0] || 'Seller'}!
                            <span className="text-yellow-500 animate-wave inline-block origin-bottom-right">👋</span>
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage your property sales and track performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBadge onViewAll={() => setActiveSection('notifications')} />
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>

            <ListingForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddListing={handleAddListingSubmit}
                userRole={user?.role}
            />
        </div>
    );
};
