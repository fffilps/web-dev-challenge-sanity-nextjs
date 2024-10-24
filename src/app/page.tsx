import React from "react";
import { GiftIcon, Users2Icon, Truck } from "lucide-react";
import Link from "next/link";

function Card({
  title,
  description,
  icon: Icon,
  bgColor,
  buttonText,
  link,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  buttonText: string;
  link: string;
}) {
  return (
    <div
      className={`${bgColor} rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/20">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/90">{description}</p>
      <Link href={link}>
      <button className="mt-6 px-6 py-2 bg-white text-red-700 rounded-full font-semibold hover:bg-white/90 transition-colors">
        {buttonText}
      </button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 via-red-600 to-red-800">
      {/* Snow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="animate-fall absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}px`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 pt-32 pb-24 text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight">
          Santa's Chaotic Workshop
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
          Where holiday magic meets modern efficiency. Discover how we're
          revolutionizing gift-giving one present at a time.
        </p>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white rounded-full p-1">
            <div className="w-1 h-3 bg-white rounded-full mx-auto animate-bounce" />
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          <Card
            title="Santa's Dashboard"
            description="Access wish lists, track nice/naughty status, and manage gift preferences. Your direct line to holiday joy."
            icon={Users2Icon}
            bgColor="bg-blue-700"
            buttonText="View Dashboard"
            link="/santasDashboard"
          />
          <Card
            title="HR's and Managers Dashboard"
            description="Manage elf operations, Reindeer status, and sleights maintenance. Streamline the magic behind the scenes."
            icon={GiftIcon}
            bgColor="bg-green-700"
            buttonText="Manage Team"
            link="/cms"
          />
          <Card
            title="Supply Chain"
            description="Optimize materials, suppliers, toys, and warehouses for efficient production and delivery."
            icon={Truck}
            bgColor="bg-purple-700"
            buttonText="Manage Inventory"
            link="/supplychain"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
