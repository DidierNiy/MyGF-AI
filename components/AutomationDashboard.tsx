import { useState } from 'react';
import { createAutomationEngine } from '../services/automationEngine';
import type { User } from '../types';

interface AutomationDashboardProps {
    user: User;
}

export const AutomationDashboard: React.FC<AutomationDashboardProps> = ({ user }) => {
    const [selectedTask, setSelectedTask] = useState<string>('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const automationEngine = createAutomationEngine(user.id, user.role);

    // Role-specific automation tasks
    const getTasksForRole = () => {
        const icons = {
            chat: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
            calendar: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
            marketing: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
            followup: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
            money: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            search: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
            wrench: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            chart: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            sparkles: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
            card: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
        };

        switch (user.role) {
            case 'Agent':
                return [
                    { id: 'auto_respond', name: 'Auto-Respond to Inquiries', icon: icons.chat },
                    { id: 'auto_schedule', name: 'Auto-Schedule Viewings', icon: icons.calendar },
                    { id: 'auto_marketing', name: 'Auto-Generate Marketing', icon: icons.marketing },
                    { id: 'auto_followup', name: 'Auto-Follow-Up Leads', icon: icons.followup },
                ];
            case 'Landlord':
                return [
                    { id: 'auto_rent_reminder', name: 'Send Rent Reminders', icon: icons.money },
                    { id: 'auto_screen', name: 'Screen Tenant Application', icon: icons.search },
                    { id: 'auto_maintenance', name: 'Schedule Maintenance', icon: icons.wrench },
                ];
            case 'Property Owner':
                return [
                    { id: 'auto_pricing', name: 'Optimize Pricing', icon: icons.money },
                    { id: 'auto_analysis', name: 'Market Analysis', icon: icons.chart },
                    { id: 'auto_optimize', name: 'Optimize Listing', icon: icons.sparkles },
                ];
            case 'Tenant':
                return [
                    { id: 'auto_maintenance_route', name: 'Submit Maintenance Request', icon: icons.wrench },
                    { id: 'auto_payment_reminder', name: 'Payment Reminders', icon: icons.card },
                ];
            default:
                return [];
        }
    };

    const executeTask = async (taskId: string) => {
        setLoading(true);
        setSelectedTask(taskId);

        try {
            // Mock data for demonstration
            const mockData = getMockDataForTask(taskId);
            const result = await automationEngine.executeAutomation(taskId, mockData);
            setResult(result);
        } catch (error) {
            console.error('Automation error:', error);
            setResult({
                success: false,
                message: 'Automation failed',
                actions: []
            });
        } finally {
            setLoading(false);
        }
    };

    const getMockDataForTask = (taskId: string) => {
        // Mock data for demo purposes
        const mockData: Record<string, any> = {
            auto_respond: {
                inquiry: {
                    email: 'client@example.com',
                    message: 'I\'m interested in the 2-bedroom apartment',
                    propertyTitle: 'Modern 2BR Apartment in Westlands'
                }
            },
            auto_schedule: {
                preferences: {
                    days: ['Monday', 'Wednesday'],
                    times: ['2:00 PM', '4:00 PM']
                }
            },
            auto_marketing: {
                listing: {
                    title: 'Luxury 3BR Penthouse',
                    location: 'Kilimani, Nairobi',
                    price: '25,000,000 KSh'
                }
            },
            auto_rent_reminder: {
                tenants: [
                    { name: 'John Doe', unit: 'A101', rentDueDate: '2025-12-01' },
                    { name: 'Jane Smith', unit: 'B205', rentDueDate: '2025-12-01' }
                ]
            },
            auto_screen: {
                application: {
                    name: 'Michael Johnson',
                    income: 150000,
                    creditScore: 720
                }
            },
            auto_maintenance: {
                request: {
                    description: 'Leaking pipe in kitchen',
                    unit: 'C303'
                }
            },
            auto_pricing: {
                listing: {
                    title: '2BR Apartment',
                    price: '12,000,000 KSh',
                    location: 'Westlands'
                }
            },
            auto_analysis: {
                properties: [
                    { title: 'Property 1', price: '10M' },
                    { title: 'Property 2', price: '15M' }
                ]
            },
            auto_optimize: {
                listing: {
                    title: 'Nice house',
                    description: 'Good location',
                    imageUrls: ['img1.jpg', 'img2.jpg']
                }
            },
            auto_maintenance_route: {
                request: {
                    description: 'AC not working',
                    unit: 'D404'
                }
            },
            auto_payment_reminder: {
                dueDate: '2025-12-01',
                amount: '50,000 KSh'
            }
        };

        return mockData[taskId] || {};
    };

    const tasks = getTasksForRole();

    return (
        <div className="automation-dashboard">
            <div className="dashboard-header">
                <h2>🤖 AI Automation Center</h2>
                <p>Automate your {user.role} tasks with AI</p>
            </div>

            <div className="automation-grid">
                {tasks.map(task => (
                    <button
                        key={task.id}
                        className={`automation-card ${selectedTask === task.id ? 'active' : ''}`}
                        onClick={() => executeTask(task.id)}
                        disabled={loading}
                    >
                        <div className="task-icon text-indigo-600 dark:text-indigo-400">{task.icon}</div>
                        <div className="task-name">{task.name}</div>
                        {loading && selectedTask === task.id && (
                            <div className="task-loading">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {result && (
                <div className={`automation-result ${result.success ? 'success' : 'error'}`}>
                    <div className="result-header">
                        <span className={`result-icon ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                            {result.success ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </span>
                        <h3>{result.message}</h3>
                    </div>

                    {result.actions.length > 0 && (
                        <div className="result-actions">
                            <h4>Actions Taken:</h4>
                            <ul>
                                {result.actions.map((action: string, idx: number) => (
                                    <li key={idx}>{action}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .automation-dashboard {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .dashboard-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .dashboard-header h2 {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 8px;
                }

                .dashboard-header p {
                    color: #666;
                    font-size: 16px;
                }

                .automation-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .automation-card {
                    position: relative;
                    background: white;
                    border: 2px solid #e0e0e0;
                    border-radius: 16px;
                    padding: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                }

                .automation-card:hover {
                    border-color: #667eea;
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
                }

                .automation-card.active {
                    border-color: #667eea;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .automation-card:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .task-icon {
                    font-size: 48px;
                    margin-bottom: 12px;
                }

                .task-name {
                    font-size: 16px;
                    font-weight: 600;
                }

                .task-loading {
                    margin-top: 12px;
                }

                .spinner {
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .automation-result {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    border: 2px solid #e0e0e0;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .automation-result.success {
                    border-color: #4caf50;
                    background: linear-gradient(135deg, #f0fff4 0%, #e6f7ed 100%);
                }

                .automation-result.error {
                    border-color: #f44336;
                    background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
                }

                .result-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .result-icon {
                    font-size: 32px;
                }

                .result-header h3 {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0;
                }

                .result-actions h4 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #333;
                }

                .result-actions ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .result-actions li {
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 8px;
                    margin-bottom: 8px;
                    font-size: 14px;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};
