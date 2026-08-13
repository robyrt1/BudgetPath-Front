"use client";

import dynamic from "next/dynamic";
const SettingsViewDynamic = dynamic(() => import("@/Views/settings/settingsView"), { ssr: false });

export default function SettingsPage() {
    return <SettingsViewDynamic />;
}
