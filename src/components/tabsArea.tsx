import React from 'react'
import * as Tabs from '@radix-ui/react-tabs'; // Import all components from Radix UI Tabs
import FileUpload from './file-upload'; // Make sure the path is correct for your FileUpload component
// import ChatInterface from './ChatInterface'; // Same for ChatInterface

const TabsArea = () => {
    return (
        <div className="relative z-10 w-full max-w-4xl bg-blue-900 ">
            <div className="w-full bg-red-500 dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                <Tabs.Root defaultValue="upload" className="w-full">
                    <Tabs.List className="grid w-full grid-cols-2 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700">
                        <Tabs.Trigger
                            value="upload"
                            className="px-6 py-4 font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-tl-lg"
                        >
                            Upload Document
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="chat"
                            className="px-6 py-4 font-medium transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-tr-lg"
                        >
                            Chat with Document
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="upload" className="p-6 md:p-8">
                        <div className="flex flex-col items-center space-y-8">
                            <FileUpload />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="chat" className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-full md:w-1/2 flex justify-center">
                                {/* Character placeholder */}
                                <div className="h-64 w-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-zinc-600 shadow-inner">
                                    <span className="text-gray-500 dark:text-gray-300 font-medium">AI Assistant</span>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2">
                                {/* <ChatInterface /> */}
                            </div>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
}

export default TabsArea;
