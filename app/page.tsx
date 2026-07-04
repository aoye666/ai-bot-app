import { Sidebar } from "@/components/Sidebar/Sidebar";
import { ChatContainer } from "@/components/Chat/ChatContainer";

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatContainer />
      </div>
    </div>
  );
}
