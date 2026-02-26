import { SquareKanban } from "lucide-react";

interface MenuItemProps {
    icon: React.ReactNode,
    label: string,
    active?: boolean
}

function MenuItem({ icon, label, active = false }: MenuItemProps) {
    const activeClass = active ? "bg-slate-400 text-black" : "text-slate-600";

    return (
        <div className="w-10 h-10 text-center flex flex-col items-center justify-center">
            <div className={`mb-1 p-2 w-8 h-8 ${activeClass} rounded`}>
                {icon}
            </div>
            <span className="text-xs">{label}</span>
        </div>
    );
}

function MainSidebar() {
    return (
        <aside className="w-16 border-r border-gray-200 flex flex-col items-center justify-between py-4">
            <div>
                <div className="brand w-10 h-10 bg-slate-600 rounded-lg mb-8"></div>

                <nav className="flex flex-col items-center justify-center space-y-6">
                    <MenuItem icon={<SquareKanban className="w-4 h-4" />} label="Projects" active />
                    <MenuItem icon={<SquareKanban className="w-4 h-4" />} label="Wiki" />
                    <MenuItem icon={<SquareKanban className="w-4 h-4" />} label="Pi" />
                </nav>
            </div>
            <div>
                <div className="user w-10 h-10 bg-slate-600 rounded-lg"></div>
            </div>
        </aside>
    );
}

export default MainSidebar;
