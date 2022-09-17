import Footer from "../footer";
import AdminBar from "./AdminBar";

export default function AdminContainer({
  children,
  isOwner,
}: {
  children: React.ReactNode;
  isOwner: boolean;
}) {
  return (
    <div>
      <AdminBar />
      {children}
    </div>
  );
}
