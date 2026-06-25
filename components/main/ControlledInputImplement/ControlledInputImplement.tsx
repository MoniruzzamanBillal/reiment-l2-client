"use client";

import DateSelect from "@/components/shared/input/DateSelect";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import CreateUpdateForm from "./form/CreateUpdateForm";

export default function ControlledInputImplement() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState(null);

  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >(undefined);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleDateChange = (date: Date | DateRange | undefined) => {
    if (date === undefined || "from" in date) {
      setSelectedDateRange(date as DateRange | undefined);
    }

    if (date === undefined || date instanceof Date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Employee Management System
          </h1>
          <p className="text-muted-foreground mt-2">
            A demo page showcasing all controlled form components with a data
            table
          </p>
        </div>

        {/*  */}

        <div className=" bg-secondary py-10 ">
          <DateSelect
            value={selectedDateRange}
            onChange={handleDateChange}
            mode={"range"}
            placeholder={"Select Date Range"}
          />
        </div>

        <div className=" bg-secondary py-10 ">
          <DateSelect
            value={selectedDate}
            onChange={handleDateChange}
            placeholder={"Select Date "}
          />
        </div>

        {/*  */}

        {/* Main Content */}
        <div className="">
          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-card text-card-foreground rounded-lg shadow p-6 border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Employee Directory
                </h2>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Reset Data
                  </Button>
                </div>
              </div>
            </div>

            <CreateUpdateForm
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedData(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
