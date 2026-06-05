"use client";

import { useState } from "react";
import { Card, Input, Button, Label, Select, SelectTrigger, SelectValue, SelectIndicator, SelectPopover, ListBox, ListBoxItem } from "@heroui/react";
import { FaSearch, FaSlidersH, FaHistory } from "react-icons/fa";

const CATEGORIES = ["Music", "Tech", "Sports", "Arts", "Business", "Food", "Other"];
const LOCATIONS = ["New York", "San Francisco", "London", "Dhaka", "Tokyo", "Berlin", "Online"];

export default function FilterPanel() {
  return (
    <Card className="relative overflow-hidden bg-slate-950/40 border border-white/10 backdrop-blur-2xl p-8 shadow-2xl rounded-3xl" radius="none">
      {/* Decorative gradient glow behind the panel */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="gap-6 grid grid-cols-1 md:grid-cols-4 items-end">
        {/* Search Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="search-title" className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Title</Label>
          <Input
            id="search-title"
            placeholder="Search keyword..."
            startContent={<FaSearch className="text-pink-500 text-sm mr-1" />}
            variant="bordered"
            className="w-full bg-slate-900/60 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-pink-500 hover:border-white/20 text-white text-sm cursor-pointer h-12 flex items-center transition-all duration-300"
          />
        </div>

        {/* Category Selector */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-category" className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</Label>
          <div className="relative group">
            <Select aria-label="Category" placeholder="All Categories" className="w-full">
              <SelectTrigger className="w-full flex items-center justify-between bg-slate-900/60 border border-white/10 rounded-xl px-3 h-12 text-white text-sm">
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectPopover className="bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-1 min-w-[200px]">
                <ListBox className="outline-none">
                  {CATEGORIES.map((cat) => (
                    <ListBoxItem key={cat} id={cat} textValue={cat} className="p-2 text-white hover:bg-pink-500/20 rounded-lg cursor-pointer">
                      {cat}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </SelectPopover>
            </Select>
          </div>
        </div>

        {/* Location Selector */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-location" className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</Label>
          <div className="relative group">
            <Select aria-label="Location" placeholder="All Locations" className="w-full">
              <SelectTrigger className="w-full flex items-center justify-between bg-slate-900/60 border border-white/10 rounded-xl px-3 h-12 text-white text-sm">
                <SelectValue />
                <SelectIndicator />
              </SelectTrigger>
              <SelectPopover className="bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-1 min-w-[200px]">
                <ListBox className="outline-none">
                  {LOCATIONS.map((loc) => (
                    <ListBoxItem key={loc} id={loc} textValue={loc} className="p-2 text-white hover:bg-pink-500/20 rounded-lg cursor-pointer">
                      {loc}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </SelectPopover>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <Button
            className="flex-grow bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold h-12 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            startContent={<FaSlidersH size={13} />}
          >
            Apply Filters
          </Button>
          <Button
            variant="bordered"
            className="border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-semibold h-12 transition-all duration-200 px-4 min-w-0"
            title="Reset Filters"
          >
            <FaHistory size={13} className="text-slate-400 hover:text-white" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
