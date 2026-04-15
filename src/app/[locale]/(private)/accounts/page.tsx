"use client";

import dynamic from "next/dynamic";
const CardsViewDynamic = dynamic(() => import("@/Views/cards/cardsView"), { ssr: false });

export default function AccountsPage() {
    return <CardsViewDynamic />;
}
