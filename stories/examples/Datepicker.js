import React from "react";
import glamorous from "glamorous";
import Dayzed from "../../src/index";
import ArrowKeysReact from "arrow-keys-react";
import { monthNamesFull, weekdayNamesShort as defaultWeekdayNamesShort } from "./calendarUtils";

let Calendar = glamorous.div({
  maxWidth: 800,
  margin: "0 auto",
  textAlign: "center"
});

let Month = glamorous.div({
  display: "inline-block",
  width: "50%",
  padding: "0 10px 30px",
  boxSizing: "border-box"
});

const dayOfMonthStyle = {
  display: "inline-block",
  width: "calc((100% / 7) - 4px)", // make allowance for active border
  border: "none",
  margin: "2px" // make allowance for active border
};

let DayOfMonth = glamorous.button(
  dayOfMonthStyle,
  ({ selected, unavailable, today }) => {
    let background = today ? "cornflowerblue" : "";
    background = selected ? "purple" : background;
    background = unavailable ? "teal" : background;
    return { background };
  }
);

let DayOfMonthEmpty = glamorous.div(dayOfMonthStyle, {
  background: "transparent"
});

const RenderCalendar = ({
  calendars,
  firstDayOfWeek,
  getDateProps,
  getBackProps,
  getForwardProps
}) => {
  const weekdayNamesShort = [...defaultWeekdayNamesShort];
  for (let i = 0; i < firstDayOfWeek; i++) {
    weekdayNamesShort.push(weekdayNamesShort.shift());
  }

  return !!calendars.length && (
    <Calendar {...ArrowKeysReact.events}>
      <div>
        <button
          {...getBackProps({
            calendars,
            offset: 12
          })}
        >
          {"<<"}
        </button>
        <button {...getBackProps({ calendars })}>Back</button>
        <button {...getForwardProps({ calendars })}>Next</button>
        <button
          {...getForwardProps({
            calendars,
            offset: 12
          })}
        >
          {">>"}
        </button>
      </div>
      {calendars.map(calendar => (
        <Month key={`${calendar.month}${calendar.year}`}>
          <div>
            {monthNamesFull[calendar.month]} {calendar.year}
          </div>
          {weekdayNamesShort.map(weekday => (
            <DayOfMonthEmpty
              key={`${calendar.month}${calendar.year}${weekday}`}
            >
              {weekday}
            </DayOfMonthEmpty>
          ))}
          {calendar.weeks.map((week, windex) =>
            week.map((dateObj, index) => {
              let key = `${calendar.month}${
                calendar.year
              }${windex}${index}`;
              if (!dateObj) {
                return <DayOfMonthEmpty key={key} />;
              }
              let { date, selected, selectable, today } = dateObj;
              return (
                <DayOfMonth
                  key={key}
                  {...getDateProps({
                    dateObj
                  })}
                  selected={selected}
                  unavailable={!selectable}
                  today={today}
                >
                  {selectable ? date.getDate() : "X"}
                </DayOfMonth>
              );
            })
          )}
        </Month>
      ))}
    </Calendar>
  )
};

class Datepicker extends React.Component {
  constructor(props) {
    super(props);
    ArrowKeysReact.config({
      left: () => {
        this.getKeyOffset(-1);
      },
      right: () => {
        this.getKeyOffset(1);
      },
      up: () => {
        this.getKeyOffset(-7);
      },
      down: () => {
        this.getKeyOffset(7);
      }
    });
  }

  getKeyOffset(number) {
    const e = document.activeElement;
    let buttons = document.querySelectorAll("button");
    buttons.forEach((el, i) => {
      const newNodeKey = i + number;
      if (el == e) {
        if (newNodeKey <= buttons.length - 1 && newNodeKey >= 0) {
          buttons[newNodeKey].focus();
        } else {
          buttons[0].focus();
        }
      }
    });
  }

  render() {
    return (
      <Dayzed
        {...this.props}
        render={RenderCalendar}
        firstDayOfWeek={this.props.firstDayOfWeek}
      />
    );
  }
}

export default Datepicker;
