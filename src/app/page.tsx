"use client"
import CustomTabBar, { Tab } from "@/components/ui/tab-bar";
import { useState } from "react";
import Transfer from "./transfer";
import Driver from "./driver";
import Vehicle from "./vehicle";
import Assigned from "./assign";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    { name: "Driver",  current: true, component: <Driver /> },
    { name: "Vehicle",  current: false, component: <Vehicle /> },
    { name: "Assign Vehicles",  current: false, component: <Assigned /> },
    { name: "Transfer History",  current: false, component: <Transfer /> },
]);
  return (
    <div className="container">
      <CustomTabBar tabs={tabs} setTabs={setTabs}/>
      <Toaster
            richColors
            position="top-right"
          />
    </div>
  );
}
