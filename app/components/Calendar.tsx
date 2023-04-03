"use client";
import React from "react";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekdayPlugin from "dayjs/plugin/weekday";
import objectPlugin from "dayjs/plugin/toObject";
import isTodayPlugin from "dayjs/plugin/isToday";
import styles from "../page.module.scss";

const Calendar = () => {
  dayjs.extend(weekdayPlugin);
  dayjs.extend(objectPlugin);
  dayjs.extend(isTodayPlugin);

  type CustomDateObject = {
    day: number;
    month: number;
    year: number;
    isInCurrentMonth: boolean;
    isCurrentDay: boolean;
  };

  const now = dayjs();
  const [currentMonth, setCurrentMonth] = useState(now);
  const [daysInMonth, setDaysInMonth] = useState<
    { dates: CustomDateObject[] }[]
  >([]);

  const getDaysNames = () => {
    const daysNames = [];
    for (let i = 0; i < 7; i++) {
      daysNames.push(dayjs().weekday(i).format("dd"));
    }
    return daysNames;
  };

  const daysNames = getDaysNames();
  const actualMonth = currentMonth.format("MMMM");
  const currentDay = dayjs().format("DD, dddd");

  // TODO: Add possibility to change the month
  const nextMonth = () => {
    const next = currentMonth.add(1, "month");
    setCurrentMonth(next);
  };

  const previousMonth = () => {
    const prev = currentMonth.subtract(1, "month");
    setCurrentMonth(prev);
  };

  const createDateObject = (date: dayjs.Dayjs): CustomDateObject => {
    const day = date.date();
    const month = date.month();
    const year = date.year();
    const isInCurrentMonth = date.isSame(currentMonth, "month");
    const isCurrentDay = date.isSame(now, "day");

    return {
      day: day,
      month: month,
      year: year,
      isInCurrentMonth: isInCurrentMonth,
      isCurrentDay: isCurrentDay,
    };
  };

  const getAllDaysInMonth = () => {
    let currentDate = currentMonth.startOf("month").weekday(0);
    const nextMonth = currentMonth.add(1, "month").month();
    let dates = [];
    let weekDates = [];
    let weekCounter = 1;

    while (currentDate.weekday(0).toObject().months !== nextMonth) {
      const formated = createDateObject(currentDate);
      weekDates.push(formated);
      if (weekCounter === 7) {
        dates.push({ dates: weekDates });
        weekDates = [];
        weekCounter = 0;
      }
      weekCounter++;
      currentDate = currentDate.add(1, "day");
    }
    setDaysInMonth(dates);
  };

  const DaysNumbers = () => {
    return (
      <div>
        {daysInMonth.map((week, index) => (
          <div key={index} className={styles.calendar__number__container}>
            {week.dates.map((date, index) => (
              <div key={index} className={styles.calendar__number}>
                {date.isInCurrentMonth ? (
                  date.day
                ) : (
                  <div className={styles.fade}>{date.day}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    getAllDaysInMonth();
  }, [currentMonth]);

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__picture}>
        <h2>{currentDay}</h2>
        <h3>{actualMonth}</h3>
        <h5>International Cookie Day</h5>
      </div>
      <div className={styles.calendar__date}>
        {daysNames.map((day) => (
          <div className={styles.calendar__day} key={day}>
            {day}
          </div>
        ))}
      </div>
      <DaysNumbers />
    </div>
  );
};

export default Calendar;
