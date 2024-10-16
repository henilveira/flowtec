"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Title from "../page-title";
import ProfileSettings from "./profile-settings";
import PrivacySettings from "./privacy-settings";
import AssociatedAccounts from "./associated-counties";
import NotificationSettings from "./notifications-settings";

export default function CompactUserSettings() {
  return (
    <div className="mx-auto h-screen flex flex-col overflow-hidden">
      <Title titulo="Configurações da conta" />

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          <ProfileSettings />
          <PrivacySettings />
          <AssociatedAccounts />
          <NotificationSettings />
        </div>
      </ScrollArea>
    </div>
  );
}
