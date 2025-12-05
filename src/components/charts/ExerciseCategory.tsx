"use client";

import { useEffect, useRef, useState } from "react";
import { ExerciseCategories, handleAppError } from "@/lib/utils";
import { ExerciseCategoryType } from "@/lib/types";
import { getExerciseCatData } from "@/lib/actions/charts";
import { subDays } from "date-fns";
import { DatePicker } from "../DatePicker";
import Selector from "../Selector";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import ExerciseCategoryChart from "./ExerciseCategoryChart";

const ExerciseCategory = ({ userId }: { userId: string }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryError, setCategoryError] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    subDays(new Date(), 30)
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const categories = ExerciseCategories;
  const chartName = useRef(`${selectedCategory} PROGRESS`);
  const [data, setData] = useState<Array<{name: string, val: number}>>([]);

  useEffect(() => {
    const getData = async () => {
      const end = new Date();
      const start = subDays(end, 30);
      try{
        const chartData = await getExerciseCatData("STRENGTH", start, end);
        setData(chartData!);
      }catch(err){
        handleAppError(err);
      }
    }
    getData();
  }, [userId])

  const updateData = async () => {
    if(!selectedCategory){
      setCategoryError(true);
      return;
    }
    setLoading(true);
    try{
      const updatedData = await getExerciseCatData(selectedCategory as ExerciseCategoryType, dateFrom, dateTo);
      setData(updatedData!);
      chartName.current = `${selectedCategory} PROGRESS`;
    }catch(err){
      handleAppError(err);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    setCategoryError(false);
  }, [selectedCategory]);


  return (
    <div className="boundary p-5 dark:bg-sage-400">
      <h3 className="mb-2">Progress by Workout Type</h3>
      <div className="flex flex-wrap gap-2 md:gap-5">
        <div>
          <Selector
            choices={categories}
            placeholder="Strength"
            setChoice={setSelectedCategory}
            selectedValue={selectedCategory}
          />
          {categoryError && <span className="error">Required</span>}
        </div>
        <DatePicker label="From:" date={dateFrom} setDate={setDateFrom} />
        <DatePicker label="To:" date={dateTo} setDate={setDateTo} />
        <Button variant='default' onClick={updateData} disabled={loading}>{loading? <Spinner /> : "Go"}</Button>
      </div>
      <div className="h-60 sm:h-70 md:h-80 lg:h-90 m-auto mx-auto mt-2.5 flex-center">
        <ExerciseCategoryChart data={data} chartName={chartName.current} />
      </div>
    </div>
  );
};

export default ExerciseCategory;
