import AdminBar from './AdminBar'



export default function AdminContainer ({ children, isOwner }: { children: React.ReactNode, isOwner: boolean }) {

    return (<div className="w-full flex flex-col items-center">
        <AdminBar />
        { children }
    </div >)
}