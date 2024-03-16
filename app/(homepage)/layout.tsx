import { Navbar } from "@/components/navbar";

interface ChatLayoutProps {
    children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    return (
        <div className="bg-slate-950">
            <Navbar />
            <main className="flex h-full">
                <div className="h-full w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};